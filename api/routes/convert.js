// setup this file as a router
const express = require('express');
const router = express.Router();
const { convertPDFToJSON } = require('../utils/convert-utils');
const { insertDocument } = require('../utils/db-utils')

// @route   POST api/convert
// @desc    Convert PDF to JSON
// @access  Public
router.post('/', async (req, res) => {
	const { domain } = req.body;
	const file = req.file;
	const pdfPath = "./" + file.path;
	// TODO: Remove this hardcoded path
	// const pdfPath = '/home/sauravbhise/college/projects/research-paper-summariser/api/files/rajkumar2011.pdf';

	const original = await convertPDFToJSON(pdfPath);

	// get rid of all keys having empty values
	for (const [key, value] of Object.entries(original)) {
		if (value === "") {
			delete original[key];
		}
	}


	// TODO: Send original json to flask API & recieve json with summary
	const summary = {};

	// Insert original and summary json into database
	for (const [key, value] of Object.entries(summary)) {
		if (original[key] === undefined) continue;
		const data = {
			section: key,
			originalText: original[key],
			summary: value,
			feedback: null,
			domain: domain,
		}
		const result = await insertDocument(original.Title, data);
		console.log("Result", result);
	}

	// Send summary json to frontend
	res.json(summary);
});

module.exports = router;
