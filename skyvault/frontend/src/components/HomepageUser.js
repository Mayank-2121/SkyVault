import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import mainLogo from '../images/mainLogo.png';
import account from '../images/account.png';
import '../styles/homepageUser.css';
import { deleteCookieForEntity, getAxios } from '../util/axios';
import { clearUser, setUser } from '../redux/userSlice';
import UploadModal from '../modals/UploadModal';
import GetModal from '../modals/GetModal';
import ChangePasswordModal from '../modals/ChangePasswordModal';
import ShareFeedbackModal from '../modals/ShareFeedbackModal';
import AboutSystemModal from '../modals/AboutSystemModal';
import UserModal from '../modals/UserModal';
import ShareModal from '../modals/ShareFilesModal';

function HomepageUser() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const username = useSelector((state) => state.user.username);
    const userType = useSelector((state) => state.user.userType);

    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [redirectToLogin, setRedirectionToLogin] = useState(false);
    const [showModal, setShowModal] = useState(false); //POST
    const [getModal, setGetModal] = useState(false); //GET
    const [showShareFilesModal, setShowShareFilesModal] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false); //CHANGE PASS
    const [showShareFeedbackModal, setShowShareFeedbackModal] = useState(false);
    const [showAboutSystemModal, setShowAboutSystemModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [totalFiles, setTotalFiles] = useState(0);
    const [totalSizeMB, setTotalSizeMB] = useState(0);

    useEffect(() => {
        // Fetch homepage data and update Redux store
        getAxios(true)
            .get('http://localhost:5000/api/homepage-user')
            .then(({ data }) => {
                if (data.success) {
                    console.log("Authentication Successful");
                    dispatch(setUser({
                        username: data.username, userId: data.userId,
                        email: data.email,
                        userType: data.userType
                    })); // Update Redux store with username
                    setTotalFiles(data.totalFiles || 0);
                    setTotalSizeMB(data.totalSizeMB || 0);
                } else {
                    console.log("Authentication declined");
                    setRedirectionToLogin(true);
                }
            })
            .catch((err) => {
                console.error('Login Error:', err.response?.data || err.message);
                setRedirectionToLogin(true);
            });
    }, [dispatch]);

    useEffect(() => {
        if (redirectToLogin) {
            dispatch(clearUser()); // Clear user data from Redux on logout or redirect
            navigate('/login-user');
        }
    }, [redirectToLogin, dispatch, navigate]);

    const logOutUser = () => {
        deleteCookieForEntity('token', 'token');
        dispatch(clearUser()); // Clear user data from Redux
        navigate('/login-user'); // Redirect to login page
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                {/* Sidebar content */}
                <div className="sidebar-header">
                    <img src={mainLogo} alt="Logo" className="sidebar-logo" />
                    <h2>SkyVault</h2>
                </div>
                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <i className="fas fa-home"></i> Dashboard
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'files' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveTab('files');
                            setGetModal(true);
                        }}
                    >
                        <i className="fas fa-file"></i> My Files
                        {getModal && <GetModal onClose={() => setGetModal(false)} />}
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'shared' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveTab('share-files');
                            setShowShareFilesModal(true);
                        }}
                    >
                        <i className="fas fa-share-alt"></i> Share Files
                        {showShareFilesModal && <ShareModal onClose={() => setShowShareFilesModal(false)} />}
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'change-password' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveTab('change-password');
                            setShowChangePasswordModal(true);
                        }}
                    >
                        <i className="fas fa-key"></i> Change Password
                        {showChangePasswordModal && <ChangePasswordModal onClose={() => setShowChangePasswordModal(false)} />}
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'send-feedback' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveTab('send-feedback');
                            setShowShareFeedbackModal(true);
                        }}
                    >
                        <i className="fas fa-comment-alt"></i> Share Feedback
                        {showShareFeedbackModal && <ShareFeedbackModal onClose={() => setShowShareFeedbackModal(false)} />}
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'about-system' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveTab('about-system');
                            setShowAboutSystemModal(true);
                        }}
                    >
                        <i className="fas fa-info-circle"></i> About System
                        {showAboutSystemModal && <AboutSystemModal onClose={() => setShowAboutSystemModal(false)} />}
                    </button>
                    {userType === "admin" && (
                        <button
                            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('users');
                                setShowUserModal(true);
                            }}
                        >
                            <i className="fas fa-users"></i> All Users
                            {showUserModal && <UserModal onClose={() => setShowUserModal(false)} />}
                        </button>
                    )}
                </nav>
            </aside>
            <main className="main-content">
                <header className="dashboard-header">
    <div style={{ flex: 1 }}></div>

    <div className="header-right">
        <button className="upload-btn" onClick={() => setShowModal(true)}>
            <i className="fas fa-upload"></i> Upload
            {showModal && <UploadModal onClose={() => setShowModal(false)} />}
        </button>

        <div className="profile-dropdown">
            <button className="profile-btn" onClick={() => setIsOpen(!isOpen)}>
                <img src={account} alt="Profile" className="profile-pic" />
                <span className="username">{username}</span>
                <i className="fas fa-chevron-down"></i>
            </button>

            {isOpen && (
                <div className="dropdown-menu">
                    <a href="homepage-user" className='profile'>
                        <i className="fas fa-user"></i> Profile
                    </a>
                    <a href="/login-user" className="logout" onClick={logOutUser}>
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </a>
                </div>
            )}
        </div>
    </div>
</header>

                <div className="dashboard-content">
                    <div className="welcome-banner">
                        <h1>
                            Welcome back, <span className="highlight">{username}</span>!
                        </h1>
                        <p id='subhead'>Manage your files and storage with ease</p>
                    </div>
                    {/* Other content */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <i className="fas fa-hdd"></i>
                            <div className="stat-info">
                                <h3>Storage Used</h3>
                                <p>{totalSizeMB} MB / 100 GB</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <i className="fas fa-file"></i>
                            <div className="stat-info">
                                <h3>Total Files</h3>
                                <p>{totalFiles}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
}

export default HomepageUser;
