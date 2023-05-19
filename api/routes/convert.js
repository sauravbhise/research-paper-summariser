// setup this file as a router
const express = require('express');
const axios = require('axios');
const router = express.Router();
const { convertPDFToJSON } = require('../utils/convert-utils');
const { insertDocument } = require('../utils/db-utils')

// @route   POST api/convert
// @desc    Convert PDF to JSON
// @access  Public
router.post('/', async (req, res) => {
	const domain = req.body.Domains;
	const file = req.file;
	const pdfPath = "./" + file.path;

	// TODO: Remove this hardcoded path
	// const pdfPath = '/home/sauravbhise/college/projects/research-paper-summariser/api/files/Optimization of hydraulic fracturing.pdf';

	const original = await convertPDFToJSON(pdfPath);

	// get rid of all keys having empty values
	for (const [key, value] of Object.entries(original)) {
		if (value === "") {
			delete original[key];
		}
	}

	// get rid of all keys that don't contains any alphabets
	for (let key in original) {
		if (!/[a-zA-Z]/.test(key)) {
			delete original[key];
		}
	}

	// Send original json to flask API & recieve json with summary
	try {
		const summary = await axios.post('http://localhost:4000/summarize', { original_text: original })
		console.log("Summary", summary)
	} catch (err) {
		console.log(err)
	}

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
