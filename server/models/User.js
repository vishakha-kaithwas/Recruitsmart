const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: {
        type: String,
    default: "candidate"
    }
});

module.exports = mongoose.model("User", userSchema);