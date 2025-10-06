// RegisterUser.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.jpg';
import '../styles/registerPage.css';

function RegisterUser() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!window.confirm("Do you want to continue?")) return;

        try {
            const response = await fetch('http://localhost:5000/api/register-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("Registration Successful");
                navigate('/login-user');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Registration Error:', error);
            alert('Something went wrong. Please try again.');
        }
    }

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <img src={logo} alt="Logo" className="register-logo" />
                    <h2>Create Your Account</h2>
                    <p>Join SkyVault and experience secure cloud storage</p>
                </div>

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <div className="input-container">
                            <i className="fas fa-user input-icon"></i>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <div className="input-container">
                            <i className="fas fa-envelope input-icon"></i>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-container">
                            <i className="fas fa-lock input-icon"></i>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group checkbox-group">
                        <label className="checkbox-container">
                            <input
                                type="checkbox"
                                required
                            />
                            I agree to the Terms of Service and Privacy Policy
                        </label>
                    </div>

                    <button type="submit" className="register-button">
                        Create Account
                    </button>
                </form>

                <div className="auth-alternatives">
                    <div className="login-link">
                        Already have an account?{' '}
                        <button onClick={() => navigate('/login-user')}>
                            Sign in
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterUser;