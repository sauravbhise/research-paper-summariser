import React, { useState,} from "react";
import '../styles/upload.css';
import { domain } from '../utils/domain';

const Fileupload = ({onFileUpload}) => {

    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setisFilePicked] = useState(false);
    const [checkedState, setCheckedState] = useState(
        new Array(domain.length).fill(false)
    );

    const handleOnChange = (position) => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );
        setCheckedState(updatedCheckedState);
    }

    const changeHandler = (event) => {
        event.preventDefault();
        setisFilePicked(true);
        setSelectedFile(event.target.files[0]);
    }

    const handleSubmission = async () => {
        
        if(selectedFile){
            onFileUpload(selectedFile);
        }
        let selectedDomains = "";
        for (let i = 0; i <= domain.length; i++) {
            if (checkedState[i] === true) {
                selectedDomains += domain[i].name + ",";
            }
        }
        console.log(selectedFile)
        const formdata = new FormData();
        formdata.append('file', selectedFile);
        formdata.append('Domains', selectedDomains);
        console.log(formdata);
        try {
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formdata
            });
            const output = await response.json();
            console.log(output);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <section className="fileUpload">
                <label className="uploadTitle">Please Upload Your Research Paper</label>
                <input className="fileInput" type="file" name="file" onChange={changeHandler} />
                <h3>Please Select Domain of your Research Paper</h3>
                {domain.map((item) => {
                    return (
                        <div>
                            <input
                                type="checkbox"
                                id={item.domainID}
                                name={item.name}
                                value={item.name}
                                checked={checkedState[item.domainID]}
                                onChange={() => handleOnChange(item.domainID)}

                            />
                            <label for={item.domainID} >{item.name}</label>
                        </div>


                    )
                })}
                <div className="submit">
                    <button type="submit" onClick={handleSubmission}>Submit</button>
                </div>
            </section>


        </>
    )
}

export default Fileupload;
