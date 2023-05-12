// setup this file as a router
const express = require('express');
const router = express.Router();
const { convertPDFToJSON } = require('../utils/convert-utils');

// @route   POST api/convert
// @desc    Convert PDF to JSON
// @access  Public
router.post('/', async (req, res) => {
	const { pdfPath } = req.body;
	// TODO: Remove this hardcoded path
	// const pdfPath = '/home/sauravbhise/college/projects/research-paper-summariser/api/files/blockchain-1.pdf';
	const json = await convertPDFToJSON(pdfPath);
	res.json(json);
});

module.exports = router;
