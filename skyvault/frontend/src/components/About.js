import React from 'react';
import logo from '../images/logo.jpg';
import flow from '../images/flow.png';
import '../styles/about.css';

function About() {
    return (
        <>
            <div class="about-container">
                <header>
                    <div className="logo-container">
                        <img src={logo} alt="Logo" className="logo" />
                        <span className="logo-text">About System - SkyVault</span>
                    </div>
                    <img src={flow} alt="SkyVault Logo or System Illustration" class="system-image" />
                </header>

                <section>
                    <h2><u>🔍 Overview</u></h2>
                    <p>SkyVault is a modern cloud storage solution that enables users to securely upload, manage, and retrieve their files from anywhere. It offers seamless integration with AWS S3, real-time feedback collection, JWT-based authentication, and a clean UI support.</p>
                </section>

                <section>
                    <h2><u>🚀 Key Features</u></h2>
                    <ul>
                        <li><strong>User Authentication:</strong> Register/Login with secure JWT tokens and cookie handling.</li>
                        <li><strong>Secure File Uploads:</strong> Upload files directly to AWS S3 with real-time tracking.</li>
                        <li><strong>My Files Modal:</strong> View and manage uploaded files linked to individual users.</li>
                        <li><strong>Feedback System:</strong> Authenticated users can submit feedback, stored with unique IDs.</li>
                        <li><strong>Light/Dark Mode:</strong> Easily toggle between themes from the homepage.</li>
                        <li><strong>Responsive Design:</strong> Fully adaptive layout for all screen sizes.</li>
                    </ul>
                </section>

                <section>
                    <h2><u>🛠️ Tech Stack</u></h2>
                    <div class="tech-stack">
                        <div><strong>Frontend:</strong> React, React Router, Lucide Icons, CSS</div>
                        <div><strong>Backend:</strong> Node.js, Express.js, AWS SDK, Multer</div>
                        <div><strong>Database:</strong> MongoDB Atlas with Mongoose</div>
                    </div>
                </section>

                <section>
                    <h2><u>🔐 Security</u></h2>
                    <ul>
                        <li>JWT-based access control</li>
                        <li>File size limits & MIME type validation</li>
                        <li>Authorization checks on feedback and file access</li>
                        <li>CORS protection for backend routes</li>
                    </ul>
                </section>

                <section>
                    <h2><u>📁 User Flow</u></h2>
                    <ol>
                        <li>User signs up or logs in</li>
                        <li>Uploads files via modal (stored in S3)</li>
                        <li>Views files in “My Files” section</li>
                        <li>Submits feedback through secured form</li>
                        <li>Uses theme toggle for dark/light mode</li>
                    </ol>
                </section>

                <footer>
                    <p>&copy; <strong>2025 SkyVault. All rights reserved.</strong></p>
                </footer>
            </div>
        </>
    );
}

export default About;