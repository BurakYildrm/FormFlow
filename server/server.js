const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const fs = require("fs");
const { promisify } = require("util");
const {
	Country,
	Role,
	User,
	Counter,
	BlacklistedToken,
	Message,
} = require("./models");

const IMG_PREFIX = "data:image/png;base64,";

const readFileAsync = promisify(fs.readFile);
dotenv.config();
const app = express();
const port = 5768;
let db = null;
app.use(cors());

async function readDataFromFile(fileName) {
	try {
		const dataString = await readFileAsync(fileName, "utf8");
		const data = dataString ? JSON.parse(dataString) : [];
		return data;
	} catch (err) {
		console.error("Error reading file:", err);
		throw new Error("Error reading file", err);
	}
}

async function initiateDatabase() {
	try {
		console.log(process.env.MONGO_URL);
		await mongoose.connect(process.env.MONGO_URL, {
			useNewUrlParser: true,
		});
		console.log("Connected to MongoDB database");

		db = mongoose.connection.db;
		const collections = await db.listCollections().toArray();

		if (!collections.some((collection) => collection.name === "roles")) {
			const roles = [{ name: "admin" }, { name: "reader" }];
			Role.insertMany(roles);
		}

		if (
			!collections.some((collection) => collection.name === "countries")
		) {
			const countries = await readDataFromFile("data/countries.json");
			Country.insertMany(
				countries.map((country) => {
					return {
						en: country.en,
						tr: country.tr,
					};
				})
			);
		}

		if (!collections.some((collection) => collection.name === "users")) {
			const adminImg = await readFileAsync("data/admin.png", "base64");
			const admin = new User({
				id: 1,
				username: "admin",
				password: "admin123",
				role: "admin",
				base64Photo: IMG_PREFIX + adminImg,
			});

			await admin.save();

			const readerImg = await readFileAsync("data/reader.png", "base64");
			const reader = new User({
				id: 2,
				username: "reader1",
				password: "reader1pass",
				role: "reader",
				base64Photo: IMG_PREFIX + readerImg,
			});

			await reader.save();
		}

		if (!(await Counter.findOne({ _id: "userCounter" }))) {
			const userCounter = new Counter({
				_id: "userCounter",
				count: 2,
			});

			await userCounter.save();
		}

		if (!(await Counter.findOne({ _id: "messageCounter" }))) {
			const messageCounter = new Counter({
				_id: "messageCounter",
				count: 0,
			});

			await messageCounter.save();
		}
	} catch (err) {
		console.log("Failed to connect to MongoDB database");
		console.log(err);
	}
}

initiateDatabase();

// Start the server
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

async function checkTokenAndRole(req, res, roleList = null) {
	const { token } = req.headers;

	if (!token) {
		res.status(401).send({ error: "User is not authenticated" });
		return false;
	}

	try {
		const jwtTokenPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);
		const blacklisted = await BlacklistedToken.findOne({ token: token });

		if (blacklisted) {
			res.status(401).send({ error: "User is not authenticated" });
			return false;
		}

		const user = await User.findOne({ id: jwtTokenPayload.userId });

		if (!user) {
			res.status(401).send({ error: "User is not authenticated" });
			return false;
		}

		const findParams = roleList ? { name: { $in: roleList } } : {};
		const roles = (await Role.find(findParams, { _id: 0, __v: 0 })).map(
			(role) => role.name
		);

		if (!roles.includes(user.role)) {
			res.status(403).send({ error: "User is not authorized" });
			return false;
		}

		return true;
	} catch (err) {
		res.status(401).send({ error: "User is not authenticated" });
		return false;
	}
}

app.post("/api/user/login", express.json(), async (req, res) => {
	const { username, password, expiry } = req.body;

	if (!username) {
		res.status(400).send({ error: "Username is required" });
		return;
	}

	if (!password) {
		res.status(400).send({ error: "Password is required" });
		return;
	}

	const user = await User.findOne({ username: username });

	if (!user) {
		res.status(400).send({ error: "Username does not exist" });
		return;
	}

	if (user.password !== password) {
		res.status(400).send({ error: "Password is incorrect" });
		return;
	}

	const jwtTokenPayload = {
		userId: user.id,
		username: user.username,
	};

	const jwtToken = jwt.sign(jwtTokenPayload, process.env.JWT_SECRET_KEY, {
		expiresIn: expiry,
	});

	res.status(200).send({ data: { user: user, token: jwtToken } });
});

app.post("/api/user/check-login", express.json(), async (req, res) => {
	const { token } = req.headers;

	if (!token) {
		res.status(401).send({ error: "Token is required" });
		return;
	}

	try {
		const jwtTokenPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);
		const isBlacklisted = (await BlacklistedToken.findOne({ token: token }))
			? true
			: false;

		if (isBlacklisted) {
			res.status(401).send({ error: "Token is invalid" });
			return;
		}

		const user = await User.findOne(
			{ id: jwtTokenPayload.userId },
			{ __id: 0, __v: 0 }
		);

		if (!user) {
			res.status(401).send({ error: "User does not exist" });
			return;
		}

		res.status(200).send({ data: { user: user } });
	} catch (err) {
		res.status(401).send({ error: "Token is invalid" });
		return;
	}
});

app.post("/api/user/logout", express.json(), async (req, res) => {
	const { token } = req.headers;

	if (!token) {
		res.status(401).send({ error: "Token is required" });
		return;
	}

	const blacklisted = await BlacklistedToken.findOne({ token: token });

	if (!blacklisted) {
		const blacklistedToken = new BlacklistedToken({
			token: token,
		});

		await blacklistedToken.save();
	}

	res.status(200).send({ data: { message: "Logged out successfully" } });
});

app.get("/api/countries", async (req, res) => {
	const countries = await Country.find({});
	res.status(200).send({
		data: {
			countries: countries.map((country) => {
				return { en: country.en, tr: country.tr };
			}),
		},
	});
});

app.post("/api/message/add", express.json(), async (req, res) => {
	const { name, message, gender, country } = req.body;

	if (!name) {
		res.status(400).send({ error: "Name is required" });
		return;
	}

	if (!message) {
		res.status(400).send({ error: "Message is required" });
		return;
	}

	if (!gender) {
		res.status(400).send({ error: "Gender is required" });
		return;
	}

	if (!country) {
		res.status(400).send({ error: "Country is required" });
		return;
	}

	const currCounter = await Counter.findOneAndUpdate(
		{ _id: "messageCounter" },
		{ $inc: { count: 1 } },
		{ new: true, useFindAndModify: false }
	);

	const newMessage = new Message({
		id: currCounter.count,
		name: name,
		message: message,
		gender: gender,
		country: country,
	});

	await newMessage.save();
	res.status(200).send({ data: { message: newMessage } });
});

app.get("/api/messages", async (req, res) => {
	const authCheck = await checkTokenAndRole(req, res);

	if (!authCheck) {
		return;
	}

	const messages = await Message.find({}, { _id: 0, __v: 0 });
	res.status(200).send({ data: { messages } });
});

app.get("/api/message/:id", async (req, res) => {
	const authCheck = await checkTokenAndRole(req, res);

	if (!authCheck) {
		return;
	}

	const { id } = req.params;
	const message = await Message.findOne({ id: id }, { _id: 0, __v: 0 });

	if (!message) {
		res.status(404).send({ error: "Message not found" });
		return;
	}

	res.status(200).send({ data: { message } });
});

app.post("/api/message/read/:id", express.json(), async (req, res) => {
	const authCheck = await checkTokenAndRole(req, res);

	if (!authCheck) {
		return;
	}

	const { id } = req.params;
	const message = await Message.findOne({ id: id });

	if (!message) {
		res.status(404).send({ error: "Message not found" });
		return;
	}

	message.read = true;
	await message.save();
	res.status(200).send({ data: { message } });
});

app.post("/api/message/delete/:id", express.json(), async (req, res) => {
	const authCheck = await checkTokenAndRole(req, res);

	if (!authCheck) {
		return;
	}

	const { id } = req.params;
	const result = await Message.deleteOne({ id: id });

	if (result.deletedCount === 0) {
		res.status(404).send({ error: "Message not found" });
		return;
	}

	res.status(200).send({ data: { message: { id } } });
});

app.post("/api/user/add-reader", express.json(), async (req, res) => {
	const authCheck = await checkTokenAndRole(req, res, ["admin"]);

	if (!authCheck) {
		return;
	}

	const { username, password, base64Photo } = req.body;

	if (!username) {
		res.status(400).send({ error: "Username is required" });
		return;
	}

	if (!password) {
		res.status(400).send({ error: "Password is required" });
		return;
	}

	if (!base64Photo) {
		res.status(400).send({ error: "Photo is required" });
		return;
	}

	const user = await User.findOne({ username: username });

	if (user) {
		res.status(400).send({ error: "Username already exists" });
		return;
	}

	const currCounter = await Counter.findOneAndUpdate(
		{ _id: "userCounter" },
		{ $inc: { count: 1 } },
		{ new: true, useFindAndModify: false }
	);

	const newUser = new User({
		id: currCounter.count,
		username: username,
		password: password,
		role: "reader",
		base64Photo: IMG_PREFIX + base64Photo,
	});

	await newUser.save();
	res.status(200).send({ data: { user: newUser } });
});

app.get("/api/users", async (req, res) => {
	const authCheck = await checkTokenAndRole(req, res, ["admin"]);

	if (!authCheck) {
		return;
	}

	const users = await User.find({}, { _id: 0, __v: 0 });
	res.status(200).send({ data: { users } });
});

app.get("/api/user/:id", async (req, res) => {
	const authCheck = await checkTokenAndRole(req, res, ["admin"]);

	if (!authCheck) {
		return;
	}

	const { id } = req.params;
	const user = await User.findOne({ id: id }, { _id: 0, __v: 0 });

	if (!user) {
		res.status(404).send({ error: "User not found" });
		return;
	}

	res.status(200).send({ data: { user } });
});

app.post("/api/user/update/:id", express.json(), async (req, res) => {
	const authCheck = await checkTokenAndRole(req, res, ["admin"]);

	if (!authCheck) {
		return;
	}

	const { id } = req.params;
	const { username, password, base64Photo } = req.body;

	if (!username) {
		res.status(400).send({ error: "Username is required" });
		return;
	}

	if (!password) {
		res.status(400).send({ error: "Password is required" });
		return;
	}

	if (!base64Photo) {
		res.status(400).send({ error: "Photo is required" });
		return;
	}

	const user = await User.findOne({ id: id }, { _id: 0, __v: 0 });

	if (!user) {
		res.status(404).send({ error: "User not found" });
		return;
	}

	user.username = username;
	user.password = password;
	user.base64Photo = IMG_PREFIX + base64Photo;
	await user.save();
	res.status(200).send({ data: { user } });
});
