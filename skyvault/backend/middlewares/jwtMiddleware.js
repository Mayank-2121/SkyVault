const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Ensure User model is imported
const secretKey = "my-32-character-ultra-secure-and-ultra-long-secret";

const authenticateUser = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        console.log("Received token from client:", token); // Debugging log

        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }

        token = token.replace("Bearer ", ""); // Remove "Bearer " prefix if present

        const decoded = jwt.verify(token, secretKey);
        console.log("Decoded token:", decoded); // Log decoded user info

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user; // Attach user data to request
        next();
    } catch (error) {
        console.error("JWT Error:", error);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports = authenticateUser;
