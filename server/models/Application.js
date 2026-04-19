const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    userEmail: String,
    jobId: String,
    jobTitle: String,
    resume: String,

    status: {
        type: String,
        default: "pending"
    },

    interviewDateTime: Date,
    score: Number,
    percentage: Number
});

module.exports = mongoose.model("Application", applicationSchema);