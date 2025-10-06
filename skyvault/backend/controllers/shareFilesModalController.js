const Upload = require('../models/userModel'); // adjust if your path is different

// @desc   Get files uploaded by the logged-in user
// @route  GET /share-files
// @access Private
const getUserFiles = async (req, res) => {
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

module.exports = {
    getUserFiles
};
