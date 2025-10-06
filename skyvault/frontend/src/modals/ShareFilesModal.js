import React, { useEffect, useRef, useState } from 'react';
import { X, Share2 } from 'lucide-react';
import '../styles/shareFilesModal.css';
import { getCookieForEntity } from "../util/axios";

function ShareModal({ onClose }) {
    const modalRef = useRef();
    const [files, setFiles] = useState([]);
    //pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showShareOptions, setShowShareOptions] = useState(null); // store fileName to toggle

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

    const getFileURL = (fileName) => {
        return `http://localhost:5000/api/uploads/download/${encodeURIComponent(fileName)}`;
    };

    const shareLinks = (platform, fileUrl) => {
        switch (platform) {
            case 'mail':
                return `mailto:?subject=Shared File&body=Check this out: ${fileUrl}`;
            case 'whatsapp':
                return `https://wa.me/?text=${encodeURIComponent("Check this file: " + fileUrl)}`;
            case 'telegram':
                return `https://t.me/share/url?url=${encodeURIComponent(fileUrl)}&text=Check this out`;
            case 'facebook':
                return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fileUrl)}`;
            case 'instagram':
                alert("Instagram does not support direct file sharing via link.");
                return null;
            default:
                return '';
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
                <h1 className="modal-heading">Share Your Files</h1>
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
                            <th>Share</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFiles.map((file, index) => {
                            const created = new Date(file.createdAt);
                            const fileUrl = getFileURL(file.name);

                            return (
                                <tr key={index}>
                                    <td>{file.name}</td>
                                    <td>{created.toLocaleDateString()}</td>
                                    <td>{created.toLocaleTimeString()}</td>
                                    <td>
                                        <button
                                            className="share-button"
                                            onClick={() => setShowShareOptions(showShareOptions === file.name ? null : file.name)}
                                        >
                                            <Share2 size={16} />
                                        </button>
                                        {showShareOptions === file.name && (
                                            <div className="share-options">
                                                <a href={shareLinks('mail', fileUrl)} target="_blank" rel="noopener noreferrer">Mail</a>
                                                <a href={shareLinks('whatsapp', fileUrl)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                                                <a href="#" onClick={() => shareLinks('instagram', fileUrl)}>Instagram</a>
                                                <a href={shareLinks('telegram', fileUrl)} target="_blank" rel="noopener noreferrer">Telegram</a>
                                                <a href={shareLinks('facebook', fileUrl)} target="_blank" rel="noopener noreferrer">Facebook</a>
                                            </div>
                                        )}
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

export default ShareModal;
