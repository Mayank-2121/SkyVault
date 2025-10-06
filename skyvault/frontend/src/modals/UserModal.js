import React, { useEffect, useRef, useState } from 'react';
import { X, Download, Trash2 } from 'lucide-react';
import '../styles/userModal.css';
import { getCookieForEntity } from "../util/axios";
import { getAxios } from '../util/axios';

function UserModal({ onClose }) {
    const modalRef = useRef();
    const [users, setUsers] = useState([]);
    const [selectedUserFiles, setSelectedUserFiles] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [feedbackUsers, setFeedbackUsers] = useState([]);
    const [selectedFeedback, setSelectedFeedback] = useState(null);

    useEffect(() => {
        fetchFiles();
        fetchFeedbackUsers();
    }, []);

    const fetchFiles = async () => {
        getAxios(true)
            .get('http://localhost:5000/api/admin/users')
            .then(({ data }) => {
                if (data.success) {
                    setUsers(data.users);
                }
            })
            .catch((err) => {
                console.error('Error fetching users:', err);
            });
    };
    const fetchFeedbackUsers = async () => {
        getAxios(true)
            .get('http://localhost:5000/api/admin/user-feedbacks')
            .then(({ data }) => {
                if (data.success) {
                    setFeedbackUsers(data.feedbacks);
                }
            })
            .catch((err) => {
                console.error('Error fetching feedbacks:', err);
            });
    };

    const handleShowFiles = (userId) => {
        setSelectedUserId(userId);
        getAxios(true)
            .get(`http://localhost:5000/api/admin/user-files/${userId}`)
            .then(({ data }) => {
                if (data.success) {
                    setSelectedUserFiles(data.files);
                }
            })
            .catch((err) => {
                console.error('Error fetching files:', err);
            });
    };



    const closeModal = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    const handleDownload = async (fileName) => {
        let token = getCookieForEntity("token", "token");
        if (token?.startsWith("Bearer ")) token = token.replace("Bearer ", "");

        try {
            const response = await fetch(`http://localhost:5000/api/admin/user-files/download/${fileName}`, {
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
    console.log("UserModal rendered");

    const handleDelete = async (fileKey) => {
        if (!window.confirm(`Delete ${fileKey}?`)) return;

        let token = getCookieForEntity("token", "token");
        if (token?.startsWith("Bearer ")) token = token.replace("Bearer ", "");

        try {
            const response = await fetch(`http://localhost:5000/api/uploads/key/${encodeURIComponent(fileKey)}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert(`${fileKey} deleted successfully.`);
                setSelectedUserFiles(prevFiles => prevFiles.filter(file => file.key !== fileKey));
            } else {
                alert('Delete failed');
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    return (
        <div onClick={closeModal} className="modal-background">
            <div ref={modalRef} className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose}>
                    <X size={30} />
                </button>
                <h2>All Registered Users</h2>
                <table className="modal-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button onClick={() => handleShowFiles(user._id)}>
                                        Show Files
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {selectedUserId && (
                    <>
                        <br />
                        <h3>Files Uploaded by Selected User</h3>

                        {selectedUserFiles.length > 0 ? (
                            <table className="modal-table">
                                <thead>
                                    <tr>
                                        <th>Key</th>
                                        <th>Uploaded At</th>
                                        <th colSpan={2}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedUserFiles.map(file => (
                                        <tr key={file._id}>
                                            <td>{file.key}</td>
                                            <td>{new Date(file.createdAt).toLocaleString()}</td>
                                            <td>
                                                <button id='download'
                                                    className="download-button"
                                                    onClick={() => handleDownload(file.key)}
                                                >
                                                    <Download size={16} />
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    className="delete-button"
                                                    id='delete'
                                                    onClick={() => handleDelete(file.key)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No files found for this user.</p>
                        )}
                    </>
                )}
                <hr color='#bbb9b9' width='880 %' />
                <br />
                <h2>Users Who Submitted Feedback</h2>
                <table className="modal-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbackUsers.map(user => (
                            <tr key={user._id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button onClick={() => setSelectedFeedback(user)}>
                                        Show Feedback
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {selectedFeedback && (
                    <div className="feedback-box">
                        <h3>Feedback from {selectedFeedback.username}</h3>
                        <p><strong>Submitted at:</strong> {new Date(selectedFeedback.submittedAt).toLocaleString()}</p>
                        <p>{selectedFeedback.feedback}</p>
                        <button onClick={() => setSelectedFeedback(null)}>Close</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserModal;
