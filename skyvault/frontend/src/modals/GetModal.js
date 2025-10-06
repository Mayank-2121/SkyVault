import React, { useEffect, useRef, useState } from 'react';
import { X, Download, Trash2 } from 'lucide-react';
import '../styles/getModal.css';
import { getCookieForEntity } from "../util/axios";

function GetModal({ onClose }) {
    const modalRef = useRef();
    const [files, setFiles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    //pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
    const fetchFiles = async () => {
    let token = getCookieForEntity("token", "token");
    if (token?.startsWith("Bearer ")) token = token.replace("Bearer ", "");

    try {
        const response = await fetch(`http://localhost:5000/api/uploads?page=${page}&limit=5&search=${searchTerm}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (Array.isArray(data.files)) {
            setFiles(data.files);
            setTotalPages(data.totalPages || 1);
        } else {
            setFiles([]);
        }
    } catch (err) {
        console.error('Fetch error', err);
    }
};

    fetchFiles();
}, [page, searchTerm]);



    const closeModal = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    const handleDownload = async (fileName) => {
        let token = getCookieForEntity("token", "token");
        if (token?.startsWith("Bearer ")) token = token.replace("Bearer ", "");

        try {
            const response = await fetch(`http://localhost:5000/api/uploads/download/${fileName}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
            alert('Download failed');
        }
    };


    const handleDelete = async (fileName) => {
        if (!window.confirm(`Delete ${fileName}?`)) return;

        let token = getCookieForEntity("token", "token");
        if (token?.startsWith("Bearer ")) token = token.replace("Bearer ", "");

        try {
            const response = await fetch(`http://localhost:5000/api/uploads/${fileName}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                setFiles(files.filter(file => file.name !== fileName));
            } else {
                alert('Delete failed');
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };


    const filteredFiles = files.filter(file =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div onClick={closeModal} className="modal-background">
            <div ref={modalRef} className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose}>
                    <X size={30} />
                </button>
                <h1 className="modal-heading">Uploaded Files</h1>
                <input
                    type="text"
                    placeholder="Search files..."
                    className="search-box"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <table className="file-table">
                    <thead>
                        <tr>
                            <th>File Name</th>
                            <th>Created Date</th>
                            <th>Created Time</th>
                            <th>Download</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFiles.map((file, index) => {
                            const created = new Date(file.createdAt);
                            return (
                                <tr key={index}>
                                    <td>{file.name}</td>
                                    <td>{created.toLocaleDateString()}</td>
                                    <td>{created.toLocaleTimeString()}</td>
                                    <td>
                                        <button
                                            className="download-button"
                                            onClick={() => handleDownload(file.name)}

                                        >
                                            <Download size={16} />
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDelete(file.name)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                

<div className="pagination-controls">
    <button
        className="pagination-button"
        disabled={page === 1}
        onClick={() => setPage(prev => Math.max(prev - 1, 1))}
    >
        Prev
    </button>

    <span className="page-info">Page {page} of {totalPages}</span>

    <button
        className="pagination-button"
        disabled={page === totalPages}
        onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
    >
        Next
    </button>
</div>



            </div>
        </div>
    );
}

export default GetModal;
