import React, { useRef, useState } from 'react';
import { X } from 'lucide-react';
import '../styles/changePasswordModal.css';
import { getAxios, setCookieForEntity } from "../util/axios";
import { useNavigate } from 'react-router-dom';
import { getCookieForEntity } from "../util/axios";

function ChangePasswordModal({ onClose }) {
    const modalRef = useRef();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        changeCurrpass: '',
        changeNewpass: '',
        changeConfirmpass: ''
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


        console.log("Token before request:", token); // ✅ Debugging step

        if (!token) {
            alert("Session expired. Please log in again.");
            navigate("/login-user");
            return;
        }

        try {
            const response = await getAxios().post(
                "http://localhost:5000/api/change-password",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // ✅ Ensure it's in "Bearer" format
                        "Content-Type": "application/json"
                    }
                }
            );

            alert("Password changed successfully!");
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
                <h1 className='modal-heading'>Update Your Password</h1>
                <form onSubmit={handleSubmit} className="change-password">
                    <label htmlFor="changeCurrpass" className="change-pass-label">Current Password</label>
                    <input
                        id="changeCurrpass"
                        name="changeCurrpass"
                        type="password"
                        className="pass-input"
                        value={formData.changeCurrpass}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="changeNewpass" className="change-pass-label">New Password</label>
                    <input
                        id="changeNewpass"
                        name="changeNewpass"
                        type="password"
                        className="pass-input"
                        value={formData.changeNewpass}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="changeConfirmpass" className="change-pass-label">Confirm New Password</label>
                    <input
                        id="changeConfirmpass"
                        name="changeConfirmpass"
                        type="password"
                        className="pass-input"
                        value={formData.changeConfirmpass}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit" className="change-button">Change Password</button>
                </form>
            </div>
        </div>
    );
}

export default ChangePasswordModal;
