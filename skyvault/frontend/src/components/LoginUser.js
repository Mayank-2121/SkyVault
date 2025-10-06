// LoginUser.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import logo from '../images/logo.jpg';
import '../styles/loginPage.css';
import { getAxios, setCookieForEntity } from "../util/axios";


function LoginUser() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        getAxios().post('http://localhost:5000/api/login-user', formData)
            .then(({ data, headers }) => {
                const token = headers.authorization;
                setCookieForEntity("token", "token", token, 3);
                if (data.success) {
                    dispatch(setUser({ username: data.username, userId: data.userId })); // Set user in Redux
                    navigate('/homepage-user');
                } else {
                    // Handle failure if response is successful but login failed
                    alert(`Error: ${data.message}`);
                }
            })
            .catch((err) => {
                alert(`Error: ${err.response.data.message}`);
                navigate('/register-user');
            });

    };


    return (
        <div className="login-container">

            <div className="login-card">
                <div className="login-header">
                    <img src={logo} alt="Logo" className="login-logo" />
                    <h2>Welcome Back</h2>
                    <p>Login to access your secure cloud storage</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
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
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group checkbox-group">
                        <label className="checkbox-container">
                            <input type="checkbox" required />
                            I agree to the Terms of Service and Privacy Policy
                        </label>
                    </div>

                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>

                <div className="auth-alternatives">
                    <div className="signup-link">
                        Don't have an account?{' '}
                        <button onClick={() => navigate('/register-user')}>
                            Sign up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginUser;