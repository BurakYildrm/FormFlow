const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
	id: { type: Number },
	name: { type: String },
	message: { type: String },
	gender: { type: String },
	country: { type: String },
	read: { type: Boolean, default: false },
	creationDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
