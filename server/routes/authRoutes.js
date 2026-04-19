const express = require("express");
const router = express.Router();
const User = require("../models/User");

// SIGNUP
router.post("/signup", async (req, res) => {
    const { name, email, password, role="candidate" } = req.body;
    
    const user = new User({ name, email, password, role });
    await user.save();

    res.json({ message: "User registered successfully" });
});

// LOGIN
// LOGIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (user.password !== password) {
            return res.status(400).json({ message: "Wrong password" });
        }

        res.json({
            message: "Login successful",
            user
        });

    } catch (err) {
        console.error("LOGIN ERROR:", err); // 👈 IMPORTANT
        res.status(500).json({ message: "Server error" });
    }
});
module.exports = router;