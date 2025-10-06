const Feedback = require("../models/shareFeedbackModel"); // You need to create this model
const { v4: uuidv4 } = require("uuid"); // Optional if you want to use custom UUID instead of Mongo _id

const shareFeedback = async (req, res) => {
    try {
        const { shareFeedback } = req.body;

        // Validate presence of feedback message
        if (!shareFeedback || typeof shareFeedback !== "string") {
            return res.status(400).json({ message: "Feedback message is required" });
        }

        // Ensure user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        // Create and save feedback
        const newFeedback = new Feedback({
            user: req.user.id,
            message: shareFeedback
        });

        await newFeedback.save();

        res.status(201).json({
            message: "Feedback submitted successfully",
            feedbackId: newFeedback._id,
            userId: newFeedback.user
        });
    } catch (error) {
        console.error("Error saving feedback:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = shareFeedback;
