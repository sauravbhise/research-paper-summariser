import React, { useState,useEffect } from "react";
import { Document, Page } from "react-pdf";

import '../styles/pdf.css';
import {output} from './output'; 
export default function AllPages(props) {

	
	
	console.log(props);
	const result = Object.keys(output).map(key => ({ [key]: output[key] }));
	const summary = result.map((item)=>{
		return(
			<>
				<h3>{Object.keys(item)}</h3>
				<p>{Object.values(item)}</p>
			</>
		)
	})
	console.log(summary);

	const [numPages, setNumPages] = useState(null);
	const [pageNumber, setPageNumber] = useState(1);
	const [summarizedText, setSummarizedText] = useState('');

	const onDocumentLoadSuccess = ({ numPages }) => {
		setNumPages(numPages);
	};

	const goToPrevPage = () =>
		setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);

	const goToNextPage = () =>
		setPageNumber(
			pageNumber + 1 >= numPages ? numPages : pageNumber + 1,
		);

	return (
		<div className="main">
			
			<div className="pdf">
				<div className="section1">
					<nav>
						<button onClick={goToPrevPage}>Prev</button>
						<button onClick={goToNextPage}>Next</button>
						<p>
							Page {pageNumber} of {numPages}
						</p>
					</nav>

					<Document
						file={props.pdfFile}
						onLoadSuccess={onDocumentLoadSuccess}
					>
						<Page pageNumber={pageNumber} wrap={false} />
					</Document>
				</div>
				<div className="section2">
					<h2>Summarized Text</h2>
					<div className="scrollable-text">{summary}</div>
				</div>
			</div>
		</div>
	);
}