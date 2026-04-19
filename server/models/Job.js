const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: String,
    description: String,
    salary: String
});

module.exports = mongoose.model("Job", jobSchema);