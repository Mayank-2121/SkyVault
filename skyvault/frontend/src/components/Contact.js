import React from 'react';
import '../styles/contact.css';

function Contact() {
    return (
        <div className="contact-container">
            <h2>Contact Us</h2>
            <p><strong>Email:</strong> support@skyvault.com</p>
            <p><strong>Call:</strong>+91 9810698274</p>
            <p>
                For full source code or to report any bug/issue, visit: <br />
                <a href="https://github.com/dartpixel" target="_blank" rel="noopener noreferrer">
                    https://github.com/dartpixel
                </a>
            </p>
            <footer>&copy; <strong>2025 SkyVault. All rights reserved.</strong></footer>
        </div>
    );
}

export default Contact;
