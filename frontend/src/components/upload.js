import React, { useState } from "react";

const Fileupload = () => {

	const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setisFilePicked] = useState(false);


	const changeHandler = (event) => {
		event.preventDefault();
		setisFilePicked(true);
		setSelectedFile(event.target.files[0]);

	}

	const handleSubmission = async () => {
		const formdata = new FormData();
		formdata.append('file', selectedFile);

		try {
			const response = await fetch('http://localhost:5000/api/convert', {
				method: 'POST',
				body: formdata
			});
			console.log(response);
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<section className="fileUpload">
			<label className="uploadTitle">Please Upload Your Research Paper</label>
			<input className="fileInput" type="file" name="file" onChange={changeHandler} />
			<div>
				<button type="submit" onClick={handleSubmission}>Submit</button>
			</div>
		</section>
	)
}

export default Fileupload;