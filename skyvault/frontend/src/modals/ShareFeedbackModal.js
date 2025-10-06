import React, { useRef, useState } from 'react';
import { X } from 'lucide-react';
import '../styles/shareFeedbackModal.css';
import { getAxios, setCookieForEntity } from "../util/axios";
import { useNavigate } from 'react-router-dom';
import { getCookieForEntity } from "../util/axios";

function ShareFeedbackModal({ onClose }) {
    const modalRef = useRef();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        feedback: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const closeModal = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        let token = getCookieForEntity("token", "token");
        if (token?.startsWith("Bearer ")) {
            token = token.replace("Bearer ", "");
        }


        console.log("Token before request:", token); // Debugging step

        if (!token) {
            alert("Session expired. Please log in again.");
            navigate("/login-user");
            return;
        }

        try {
            const response = await getAxios().post(
                "http://localhost:5000/api/share-feedback",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Ensure it's in "Bearer" format
                        "Content-Type": "application/json"
                    }
                }
            );

            alert("Feedback shared successfully!");
            onClose();
        } catch (err) {
            console.error("Error:", err);
            alert(`Error: ${err.response?.data?.message || "Session expired. Please log in again."}`);
            if (err.response?.status === 401) {
                navigate("/login-user");
            }
        }
    };




    return (
        <div onClick={closeModal} className="modal-background">
            <div ref={modalRef} className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose}>
                    <X size={30} />
                </button>
                <h1 className='modal-heading'>Share your Feedback</h1>
                <form onSubmit={handleSubmit} className="change-password">
                    <label htmlFor="shareFeedback" className="change-pass-label">We are hearing !</label>
                    <textarea

                        rows="8" cols="50"
                        id="shareFeedback"
                        name="shareFeedback"
                        className="pass-input"
                        value={formData.shareFeedback}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit" className="change-button">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default ShareFeedbackModal;
