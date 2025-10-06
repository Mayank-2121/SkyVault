const AWS = require("aws-sdk");
const File = require("../models/fileMappingModel");
const Feedback = require('../models/shareFeedbackModel');
const User = require('../models/userModel');

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
});


// Fetch all users
const getAllUsers = async (req, res) => {
    try {
        console.log("Fetching all users...");
        const users = await User.find({}, 'username email');
        console.log("Users found:", users);
        res.json({ success: true, users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};


// Fetch files uploaded by a specific user
const getUserFiles = async (req, res) => {
    const userId = req.params.userId;

    try {
        const files = await File.find({ userId });
        res.json({ success: true, files });
    } catch (error) {
        console.error('Error fetching user files:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// Download file by S3 key
const downloadFile = async (req, res) => {
    const fileKey = req.params.fileKey;

    try {
        const file = await File.findOne({ key: fileKey });
        if (!file) return res.status(404).json({ error: 'File not found' });

        const params = {
            Bucket: process.env.BUCKET,
            Key: file.key,
        };

        const data = await s3.getObject(params).promise();
        res.setHeader('Content-Disposition', `attachment; filename="${file.originalname}"`);
        res.send(data.Body);
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ error: 'Failed to download file' });
    }
};

// Delete file by S3 key
const deleteFile = async (req, res) => {
    const fileKey = req.params.fileKey;

    try {
        const file = await File.findOneAndDelete({ key: fileKey });
        if (!file) return res.status(404).json({ error: 'File not found or unauthorized' });

        await s3.deleteObject({
            Bucket: process.env.BUCKET,
            Key: file.key
        }).promise();

        res.json({ message: `${file.originalname} deleted successfully` });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: 'Failed to delete file' });
    }
};

const getUsersWithFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find(); // No populate here

        const results = await Promise.all(
            feedbacks.map(async (entry) => {
                const user = await User.findById(entry.user).select('username email');
                if (!user) return null;

                return {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    feedback: entry.message,
                    submittedAt: entry.createdAt
                };
            })
        );

        // Filter out any nulls (in case a user was not found)
        const filteredResults = results.filter(entry => entry !== null);

        res.json({ success: true, feedbacks: filteredResults });
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};



module.exports = {
    getAllUsers,
    getUserFiles,
    downloadFile,
    deleteFile,
    getUsersWithFeedback
};