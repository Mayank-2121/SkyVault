import React, { useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Upload } from 'lucide-react';
import '../styles/uploadModal.css';
import axios from 'axios';
import { getCookieForEntity } from "../util/axios";






function UploadModal({ onClose }) {
    const modalRef = useRef();
    const [uploadProgress, setUploadProgress] = useState(0);
    const [file, setFile] = useState(null);
    const [isDragActive, setIsDragActive] = useState(false);

    const closeModal = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            console.log('File selected:', selectedFile.name);
            setFile(selectedFile);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            console.log('File dropped:', droppedFile.name);
            setFile(droppedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert('No file selected!');
            return;
        }

        let token = getCookieForEntity("token", "token");
        if (token?.startsWith("Bearer ")) {
            token = token.replace("Bearer ", "");
        }

        if (!token) {
            alert("Session expired. Please log in again.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/api/uploads', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percent);
                }
            });

            if (response.status === 200) {
                alert('File uploaded successfully!');
                setUploadProgress(0); // reset after success
                onClose();
            } else {
                alert('File upload failed: ' + (response.data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('An error occurred during file upload.');
            setUploadProgress(0);
        }
    };



    return (
        <div onClick={closeModal} className="modal-background">
            <div ref={modalRef} className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose}>
                    <X size={30} />
                </button>
                <h1 className="modal-heading">Upload Your File</h1>
                <div
                    className={`upload-step ${isDragActive ? 'drag-active' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <form className="upload-form">
                        <label htmlFor="file-upload" className="file-upload-label">
                            <Upload size={40} />
                            <p>Click or Drag to Upload</p>
                            <input
                                id="file-upload"
                                type="file"
                                className="file-input"
                                onChange={handleFileChange}
                            />
                        </label>
                        {file && <p className="file-title">Selected File: {file.name}</p>}
                    </form>
                </div>
                <div className="details-step">
                    <form onSubmit={handleSubmit} className="details-form">

                        <div className="form-buttons">
                            <button type="submit" className="submit-button" disabled={!file}>
                                Upload
                            </button>
                            {uploadProgress > 0 && (
                                <div className="progress-bar">
                                    <div className="progress" style={{ width: `${uploadProgress}%` }} />
                                    <p>{uploadProgress}%</p>
                                </div>
                            )}

                        </div>
                    </form>
                    <div className="progress-bar">
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UploadModal;
