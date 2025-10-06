const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const File = require('../models/fileMappingModel');
dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
});

const listFiles = async (req, res) => {
    const userId = req.user._id;
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const query = {
        userId,
        fileName: { $regex: search, $options: 'i' }
    };

    const totalFiles = await File.countDocuments(query);
    const userFiles = await File.find(query)
        .select('-__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const files = userFiles.map(file => ({
        name: file.fileName,
        key: file.key,
        location: file.location,
        createdAt: file.createdAt,
    }));

    res.status(200).json({
        files,
        totalFiles,
        totalPages: Math.ceil(totalFiles / limit),
        currentPage: page,
    });
};


// 2. Download a specific file
const downloadFile = async (req, res) => {
    const fileName = req.params.fileName;
    const userId = req.user._id;

    try {
        const file = await File.findOne({ fileName, userId });
        if (!file) return res.status(403).json({ error: 'Unauthorized access' });

        const params = {
            Bucket: process.env.BUCKET,
            Key: file.key,
        };

        const data = await s3.getObject(params).promise();
        res.setHeader('Content-Disposition', `attachment; filename="${file.fileName}"`);
        res.send(data.Body);
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ error: 'Failed to download file' });
    }
};

// 3. Delete a specific file
const deleteFile = async (req, res) => {
    const fileName = req.params.fileName;
    const userId = req.user._id;

    try {
        const file = await File.findOneAndDelete({ fileName, userId });
        if (!file) return res.status(403).json({ error: 'Unauthorized or not found' });

        const params = {
            Bucket: process.env.BUCKET,
            Key: file.key,
        };

        await s3.deleteObject(params).promise();
        res.json({ message: `${fileName} deleted successfully` });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: 'Failed to delete file' });
    }
};

module.exports = {
    listFiles,
    downloadFile,
    deleteFile,
};
