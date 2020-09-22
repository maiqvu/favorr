import React, { useState } from "react";
import axios from 'axios';
import Button from 'react-bootstrap/Button';

const UploadProof = (props) => {
    const [ selectedFile, setSelectedFile ] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    }

    const uploadImage = async (imageFile, requestId) => {
        const formData = new FormData();
    
        formData.append(
            "myFile",
            imageFile,
            imageFile.name
        );
    
        await axios.post(`/api/publicRequests/${requestId}/uploadimage`, formData);
    }

    return (
        <div>
            <h6 className="text-left font-weight-bold">Upload an image as proof to resolve this request</h6>
            <div className="input-group">
                <div className="custom-file">
                    <input type="file" className="custom-file-input" id="inputGroupFile04" 
                        name="selectedFile" onChange={handleFileChange}/>
                    <label className="custom-file-label text-left" htmlFor="inputGroupFile04" >
                        {selectedFile ? 
                            selectedFile.name : 
                            "Choose file"}
                    </label>
                </div>
                <div className="input-group-append">
                    <Button className="outline-primary" 
                        onClick={() => uploadImage(selectedFile, 'dummyId')}>Upload</Button>
                </div>
            </div>
        </div>
    )
}

export default UploadProof;
