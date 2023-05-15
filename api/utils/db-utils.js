const mongoose = require('mongoose');
const TextData = require('../schemas/TextData');


// function to create a new collection of text data
const insertDocument = async (collectionName, data) => {
	try {
		const Paper = mongoose.model(collectionName, TextData);
		const result = await Paper.create({
			_id: data.section,
			originalText: data.originalText,
			summary: data.summary,
			domain: data.domain,
		});
		return result;
	} catch (err) {
		console.error("Error", err);
	}
}

// function to read all documents from a collection
const readDocuments = async (collectionName) => {
	try {
		const Paper = mongoose.model(collectionName, TextData);
		const result = await Paper.find();
		return result;
	} catch (err) {
		console.error(err);
	}
}

// function to read a document from a collection by id
const readDocumentById = async (collectionName, id) => {
	try {
		const Paper = mongoose.model(collectionName, TextData);
		const result = await Paper.findById(id);
		return result;
	} catch (err) {
		console.error(err);
	}
}

// function to update a document from a collection by id
const updateDocumentById = async (collectionName, id, data) => {
	try {
		const Paper = mongoose.model(collectionName, TextData);
		const result = await Paper.findByIdAndUpdate(id, {
			originalText: data.originalText,
			summary: data.summary,
			feedback: data.feedback,
			domain: data.domain,
		});
		return result;

	} catch (err) {
		console.error(err);
	}
}

// function to delete a document from a collection by id
const deleteDocumentById = async (collectionName, id) => {
	try {
		const Paper = mongoose.model(collectionName, TextData);
		const result = await Paper.findByIdAndDelete(id);
		return result;
	} catch (err) {
		console.error(err);
	}
}




module.exports = {
	insertDocument,
	readDocuments,
	readDocumentById,
	updateDocumentById,
	deleteDocumentById,
}