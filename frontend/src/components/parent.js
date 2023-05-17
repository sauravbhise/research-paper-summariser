import React, { useState } from 'react';
import Fileupload from './uplaod';
import AllPages from './allpageview';
import Header from './header';


const View = ()=>{
    const [pdfFile, setPdfFile] = useState(null);
    const [next,setNext] = useState(false);
    const handleFileUpload = (file) => {
        setPdfFile(file);
        setNext(true);
    };

    return (
        <div>
          <Header/>
          {
            next ? (<AllPages pdfFile={pdfFile} />):(<Fileupload onFileUpload={handleFileUpload} />) 
          }
          
        </div>
      );
}


          

export default View;

