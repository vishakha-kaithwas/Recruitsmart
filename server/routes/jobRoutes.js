const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

// GET all jobs
router.get("/", async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// SEED DATA (IMPORTANT FOR TESTING)
router.get("/seed", async (req, res) => {
    try {
        await Job.deleteMany();

        await Job.insertMany([
            {
                title: "Frontend Developer",
                description: "React + Tailwind CSS",
                salary: "₹4-6 LPA"
            },
            {
                title: "Backend Developer",
                description: "Node.js + MongoDB",
                salary: "₹5-8 LPA"
            },
            {
                title: "Full Stack Developer",
                description: "MERN Stack",
                salary: "₹6-10 LPA"
            }
        ]);

        res.send("✅ Jobs Seeded");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;