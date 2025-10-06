const user = require("../models/userModel")
const bcrypt = require("bcrypt");

const getRegisterUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new user({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({
            userId: newUser.userId,
            username: newUser.username
        });
    }
    catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};



module.exports = getRegisterUser;