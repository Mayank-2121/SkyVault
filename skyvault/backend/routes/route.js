const express = require("express");
const authenticateUser = require('../middlewares/jwtMiddleware')
const router = express.Router();
const getRegisterUser = require('../controllers/registerController');
const getLoginUser = require('../controllers/loginController');
const homepageController = require('../controllers/homepageController');
const { singleFileUpload, uploadSingleFile } = require('../controllers/uploadModalController');
const changePassword = require('../controllers/passwordChangeModalController');
const shareFeedback = require('../controllers/shareFeedbackModalController');
const getModalController = require('../controllers/getModalController');
const adminController = require('../controllers/adminController');
const shareFilesModalController = require('../controllers/shareFilesModalController');


// hamesha sare routes me authenticateUser bhi dalna padega vrna unauthorized access dega
const isAdmin = (req, res, next) => {
    if (req.user.userType === "admin") return next();
    return res.status(403).json({ message: "Admin access only" });
};



router.post('/register-user', getRegisterUser, (req, res) => {
    return res.status(200).json({ message: 'You have access to this protected route' });
});
router.post('/login-user', getLoginUser, (req, res, next) => {
    return res.status(200).json({ message: 'You have access to this protected route' });
});
router.get('/homepage-user', authenticateUser, homepageController, (req, res, next) => {
    console.log(authenticateUser);
    return res.status(200).json({ message: 'You have access to this protected route' });
});

// Single file upload route
router.post('/uploads', authenticateUser, singleFileUpload, uploadSingleFile);

router.post('/change-password', authenticateUser, changePassword);

router.post('/share-feedback', authenticateUser, shareFeedback);

router.get('/uploads', authenticateUser, getModalController.listFiles);
router.get('/uploads/download/:fileName', authenticateUser, getModalController.downloadFile);
router.delete('/uploads/:fileName', authenticateUser, getModalController.deleteFile);

router.get('/admin/users', authenticateUser, isAdmin, adminController.getAllUsers);
router.get('/admin/user-files/:userId', authenticateUser, isAdmin, adminController.getUserFiles);
router.get('/admin/user-files/download/:fileKey', authenticateUser, isAdmin, adminController.downloadFile);
router.delete('/uploads/key/:fileKey', authenticateUser, isAdmin, adminController.deleteFile);

router.get('/admin/user-feedbacks', authenticateUser, isAdmin, adminController.getUsersWithFeedback);

router.route('/');

module.exports = router;

