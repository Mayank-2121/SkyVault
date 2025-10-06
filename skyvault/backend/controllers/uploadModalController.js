// Import S3 client and multer
const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const dotenv = require('dotenv');
const { FetchHttpHandler } = require("@smithy/fetch-http-handler");
const fetch = require("node-fetch");
const File = require('../models/fileMappingModel');

dotenv.config();

const s3 = new S3Client({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
    requestHandler: new FetchHttpHandler({
        requestTimeout: 300000, // 5 minutes
    }),
    runtime: "node", // Needed for node-fetch
});

// Multer S3 storage configuration
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.BUCKET,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, `uploads/${Date.now()}_${file.originalname}`);
        },

    }),
    limits: { fileSize: 10 * 1024 * 1024 }, // 1 MB limit
});

// Middleware for single file upload
const singleFileUpload = upload.single('file');

// Controller for single file upload
const uploadSingleFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const userId = req.user._id;

        const newFile = new File({
            userId: req.user._id,
            fileName: req.file.originalname,
            key: req.file.key,
            location: req.file.location,
        });
        await newFile.save();
        console.log('File Uploaded:', newFile);

        return res.status(200).json({
            message: 'File uploaded successfully',
            file: newFile,
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Error uploading file', error: error.message });
    }
};

module.exports = {
    singleFileUpload,
    uploadSingleFile,
};
