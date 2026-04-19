const User = require("../models/User");

// LOGIN
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.json({
            message: "Login successful",
            user: {
                email: user.email,
                role: user.role,
                name: user.name
            }
        });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};