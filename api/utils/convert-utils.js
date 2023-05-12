const fs = require('fs');
const PDFParser = require('pdf-parse');


// convert pdf to string
function convertPDFToString(pdfPath) {
	return new Promise((resolve, reject) => {
		fs.readFile(pdfPath, (error, data) => {
			if (error) {
				reject(error);
			} else {
				PDFParser(data).then((pdfData) => {
					resolve(pdfData.text);
				}).catch((err) => {
					reject(err);
				});
			}
		});
	});
}

// convert string to json
function convertTextToJSON(text) {
	const lines = text.split('\n');
	const json = {};

	let currentTitle = null;
	let currentParagraph = null;
	let startParsing = false; // Flag to indicate when to start parsing

	for (const line of lines) {
		if (line.trim() === '') {
			continue; // Skip empty lines
		}

		if (line.includes('Abstract')) {
			startParsing = true; // Set the flag to true when encountering "Abstract"
			currentTitle = 'Abstract';
			currentParagraph = '';
		} else if (startParsing) {
			if (line.match(/^\d+(\.\d+)*\./)) {
				// Assume it is a section title with numbers and dots
				if (currentTitle !== null && currentParagraph !== null) {
					json[currentTitle] = currentParagraph.trim();
				}
				currentTitle = line.trim();
				currentParagraph = '';
			} else {
				// Assume it is a paragraph
				currentParagraph += line.trim() + ' ';
			}
		}
	}

	if (currentTitle !== null && currentParagraph !== null) {
		json[currentTitle] = currentParagraph.trim();
	}

	return json;
}


async function convertPDFToJSON(pdfPath) {
	const pdfText = await convertPDFToString(pdfPath);
	const json = convertTextToJSON(pdfText);
	return json;
}

module.exports = { convertPDFToJSON };