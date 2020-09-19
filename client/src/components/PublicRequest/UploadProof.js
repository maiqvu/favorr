import React, { Component } from "react";
import axios from 'axios';

import Button from 'react-bootstrap/Button';

export default class UploadProof extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedFile: null
        }

        this.onFileChange = this.onFileChange.bind(this);
    }

    onFileChange(event) {
        this.setState({ selectedFile: event.target.files[0] }, () => {
            console.log(this.state.selectedFile)
        })
    }

    uploadImage(imageFile, requestId) {
        const formData = new FormData();
    
        formData.append(
            "myFile",
            imageFile,
            imageFile.name
        );
    
        axios.post(`/api/publicRequests/${requestId}/uploadimage`, formData);
    }

    render() {
        return (
            <div>
                <h6 className="text-left font-weight-bold">Upload an image as proof to resolve this request</h6>
                <div className="input-group">
                    <div className="custom-file">
                        <input type="file" className="custom-file-input" id="inputGroupFile04" 
                            name="selectedFile" onChange={this.onFileChange}/>
                        <label className="custom-file-label text-left" htmlFor="inputGroupFile04" >
                            {this.state.selectedFile ? 
                                this.state.selectedFile.name : 
                                "Choose file"}
                        </label>
                    </div>
                    <div className="input-group-append">
                        <Button className="outline-primary" 
                            onClick={() => this.uploadImage(this.state.selectedFile, 'dummyId')}>Upload</Button>
                    </div>
                </div>
            </div>
        )
    }
}