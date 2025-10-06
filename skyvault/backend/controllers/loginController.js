const user = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "my-32-character-ultra-secure-and-ultra-long-secret";

const getLoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const checkUser = await user.findOne({ email });
        if (!checkUser) {
            return res.status(404).json({ message: "User not found with this email" });
        }
        console.log("checkUser", checkUser);
        const isMatch = await bcrypt.compare(password, checkUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: checkUser._id, username: checkUser.username },
            secretKey,
            { expiresIn: "5h" }
        );

        const options = {
            // httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days

        };

        res.status(200)
            // .cookie("token", token, options)
            .header("Authorization", `Bearer ${token}`)
            .set('Authorization', `Bearer ${token}`)
            .setHeader('Access-Control-Expose-Headers', 'Set-Cookie, Authorization')
            .json({
                success: true,
                message: "Login successful",
                userId: checkUser._id,
                username: checkUser.username,
                email: checkUser.email,
                apap: "papa",
                userType: checkUser.userType
            });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Error logging in user", error: error.message });
    }
};

module.exports = getLoginUser;
