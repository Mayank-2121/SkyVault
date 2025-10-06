const User = require("../models/userModel");  // Ensure correct path
const bcrypt = require("bcrypt");

const changePassword = async (req, res) => {
    try {
        const { changeCurrpass, changeNewpass, changeConfirmpass } = req.body;

        if (!changeCurrpass || !changeNewpass || !changeConfirmpass) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (changeNewpass !== changeConfirmpass) {
            return res.status(400).json({ message: "New passwords do not match" });
        }

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        // Find user from DB
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if current password matches
        const isMatch = await bcrypt.compare(changeCurrpass, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        // Hash the new password and save it
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(changeNewpass, salt);
        await user.save();

        res.json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = changePassword;
