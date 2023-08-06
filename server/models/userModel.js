const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	id: { type: Number },
	username: { type: String },
	password: { type: String },
	role: { type: String },
	base64Photo: { type: String },
});

module.exports = mongoose.model("User", userSchema);
