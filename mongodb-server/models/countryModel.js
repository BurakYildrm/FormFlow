const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
	en: { type: String },
	tr: { type: String },
});

module.exports = mongoose.model("Country", countrySchema);
