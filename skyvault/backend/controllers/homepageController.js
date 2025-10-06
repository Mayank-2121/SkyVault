const user = require("../models/userModel");
const File = require("../models/fileMappingModel");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
});

const homepageController = async (req, res) => {
    try {
        const { username, _id: userId, userType } = req.user;

        // Get all files belonging to this user
        const userFiles = await File.find({ userId });

        let totalSizeBytes = 0;

        // Fetch size for each file from S3
        for (const file of userFiles) {
            const params = {
                Bucket: process.env.BUCKET,
                Key: file.key,
            };
            try {
                const headData = await s3.headObject(params).promise();
                totalSizeBytes += headData.ContentLength; // in bytes
            } catch (err) {
                console.warn(`Failed to fetch size for ${file.key}:`, err.message);
            }
        }

        const totalFiles = userFiles.length;
        const totalSizeMB = (totalSizeBytes / (1024 ** 2)).toFixed(2); // Convert bytes to MB

        res.status(200).json({
            success: true,
            username,
            totalFiles,
            totalSizeMB,
            userType,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching homepage data",
            error: error.message,
        });

    }
}

module.exports = homepageController;