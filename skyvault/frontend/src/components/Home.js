// Home.js
import React from 'react';
import '../styles/home.css';
import logo from '../images/logo.jpg';
import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
    const navLinkRef = useRef(null);
    const footerLinkRef = useRef(null);
    const featuresSectionRef = useRef(null);
    useEffect(() => {
        const scrollToFeatures = () => {
            featuresSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };

        if (navLinkRef.current) {
            navLinkRef.current.addEventListener('click', (e) => {
                e.preventDefault();
                scrollToFeatures(); // Scroll down (or default scroll)
            });
        }

        if (footerLinkRef.current) {
            footerLinkRef.current.addEventListener('click', (e) => {
                e.preventDefault();
                scrollToFeatures(); // Scroll up
            });
        }

        return () => {
            if (navLinkRef.current) navLinkRef.current.removeEventListener('click', scrollToFeatures);
            if (footerLinkRef.current) footerLinkRef.current.removeEventListener('click', scrollToFeatures);
        };
    }, []);


    return (
        <div className="homepage">
            <header className="header">
                <div className="header-content">
                    <div className="logo-container">
                        <img src={logo} alt="Logo" className="logo" />
                        <span className="logo-text">SkyVault</span>
                    </div>
                    <nav className="nav-menu">
                        <a href="#features" id="navFeaturesLink" ref={navLinkRef}>Features</a>
                        <Link to='/about'>About</Link>
                        <Link to="/contact">Contact</Link>
                        <div className="auth-buttons">
                            <a href="/login-user" className="login-btn">Login</a>
                            <a href="/register-user" className="signup-btn" style={{ color: 'white' }}>Sign Up</a>
                        </div>
                    </nav>
                </div>
            </header>

            <main>
                <section className="hero-section">
                    <div className="hero-content">
                        <h1>Secure Cloud Storage for the Modern Era</h1>
                        <p className='black'>Experience unlimited possibilities with our distributed cloud storage solution</p>
                        <div className="hero-buttons">
                            <a href="/register-user" className="primary-btn">Get Started</a>
                            <Link to="/about" className="secondary-btn">Learn More</Link>
                        </div>
                        <div className="stats-container">
                            <div className="stat-item">
                                <h3>10M+</h3>
                                <p>Users</p>
                            </div>
                            <div className="stat-item">
                                <h3>99.9%</h3>
                                <p>Uptime</p>
                            </div>

                        </div>
                    </div>
                </section>

                <section className="features-section" id="features" ref={featuresSectionRef}>
                    <h2>Why Choose SkyVault?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <i className="feature-icon">🔒</i>
                            <h3>Secure Storage</h3>
                            <p>End-to-end encryption for maximum security</p>
                        </div>
                        <div className="feature-card">
                            <i className="feature-icon">⚡</i>
                            <h3>Lightning Fast</h3>
                            <p>Quick access to your files anywhere</p>
                        </div>
                        <div className="feature-card">
                            <i className="feature-icon">🔄</i>
                            <h3>Auto Sync</h3>
                            <p>Real-time synchronization across devices</p>
                        </div>
                    </div>
                </section>

                <section className="contact-section" id="contact">
                    <div className="contact-content">
                        <h2 className='white'>Ready to Get Started?</h2>
                        <p>Join thousands of satisfied users today</p>
                        <a href="/register-user" className="contact-btn">Start Free Trial</a>
                    </div>
                </section>
                <hr color='white' />
                <footer className="contact-section">
                    <div className="contact-content">
                        <div className="footer-top">
                            <div className="footer-brand">
                                <h3>SkyVault</h3>
                                <p>Your trusted cloud storage solution</p>
                            </div>
                            <div className="footer-links">
                                <div>
                                    <h4>Quick Links</h4>
                                    <a href="#features" id=" footerFeaturesLink" ref={footerLinkRef}>Features</a>
                                    <Link to='/about'>About</Link>
                                    <Link to="/contact">Contact</Link>
                                </div>
                                <div>
                                    <h4>Contact</h4>
                                    <p>Email: support@skyvault.com</p>
                                </div>
                            </div>
                        </div>
                        <div className="footer-bottom">
                            <p className='white'>Made with ❤️ by Kartik Sharma</p>
                            <p>&copy; 2025 SkyVault. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </main>



        </div>
    );
}

export default Home;