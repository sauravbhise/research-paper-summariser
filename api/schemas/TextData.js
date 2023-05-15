const mongoose = require('mongoose');

// Collection name will be name of the paper
const textDataSchema = new mongoose.Schema({
	// id = SectionName
	_id: {
		type: String,
		required: true,
	},
	originalText: {
		type: String,
		required: true,
	},
	summary: {
		type: String,
		required: true,
	},
	feedback: {
		type: Boolean,
	},
	domain: {
		type: [String],
		required: true,
	}
});

module.exports = textDataSchema;
