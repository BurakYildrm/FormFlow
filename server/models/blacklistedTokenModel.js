const mongoose = require("mongoose");

const blacklistedTokenSchema = new mongoose.Schema({
	token: { type: String },
});

module.exports = mongoose.model("BlacklistedToken", blacklistedTokenSchema);
