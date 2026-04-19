const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
    userEmail: String,
    jobTitle: String,
    responses: [
        {
            question: String,
            answer: String
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Interview", interviewSchema);