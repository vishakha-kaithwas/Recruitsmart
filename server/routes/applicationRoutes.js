const express = require("express");
const router = express.Router();
const multer = require("multer");
const Application = require("../models/Application");

// ===============================
// 📁 MULTER CONFIG
// ===============================
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

// ===============================
// ✅ APPLY JOB (FIXED)
// ===============================
router.post("/apply", upload.single("resume"), async (req, res) => {
    try {
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        const { userEmail, jobId, jobTitle } = req.body;

        if (!userEmail || !jobId || !jobTitle) {
            return res.status(400).json({ message: "Missing fields" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Resume required" });
        }

        // prevent duplicate
        const existing = await Application.findOne({ userEmail, jobId });
        if (existing) {
            return res.status(400).json({ message: "Already applied" });
        }

        const newApp = new Application({
            userEmail,
            jobId,
            jobTitle,
            resume: req.file.filename,
            status: "pending"
        });

        await newApp.save();

        res.json({ message: "Application submitted successfully ✅" });

    } catch (err) {
        console.error("❌ APPLY ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// ===============================
// 📤 GET ALL APPLICATIONS
// ===============================
router.get("/", async (req, res) => {
    try {
        const apps = await Application.find();
        res.json(apps);
    } catch (err) {
        res.status(500).json({ message: "Error fetching applications" });
    }
});

// ===============================
// 🔄 UPDATE STATUS
// ===============================
router.post("/update-status", async (req, res) => {
    try {
        const { id, status } = req.body;

        if (!id || !status) {
            return res.status(400).json({ message: "Missing data" });
        }

        await Application.findByIdAndUpdate(id, { status });

        res.json({ message: "Status updated ✅" });

    } catch (err) {
        res.status(500).json({ message: "Error updating status" });
    }
});

router.post("/update-score", async (req, res) => {
    try {
        const { userEmail, jobId, score, percentage, status } = req.body;

        console.log("👉 UPDATE SCORE:", userEmail, jobId);

        const app = await Application.findOne({
            userEmail: userEmail,
            jobId: String(jobId) // 🔥 FORCE MATCH
        });

        if (!app) {
            console.log("❌ NOT FOUND");
            return res.status(404).json({ message: "Application not found" });
        }

        app.score = score;
        app.percentage = percentage;
        app.status = status;

        await app.save();

        console.log("✅ UPDATED");

        res.json({ message: "Updated" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// ===============================
// 📅 SCHEDULE INTERVIEW (FIXED)
// ===============================
router.post("/schedule", async (req, res) => {
    try {
        const { id, dateTime } = req.body;

        console.log("👉 RECEIVED:", id, dateTime);

        if (!id || !dateTime) {
            return res.status(400).json({ message: "Missing data" });
        }

        const interviewDateTime = new Date(dateTime);

        if (isNaN(interviewDateTime)) {
            return res.status(400).json({ message: "Invalid date" });
        }

        await Application.findByIdAndUpdate(id, {
            status: "selected",
            interviewDateTime
        });

        res.json({ message: "Interview scheduled ✅" });

    } catch (err) {
        console.error("❌ ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// ===============================
// 📤 GET USER APPLICATIONS
// ===============================
router.get("/:email", async (req, res) => {
    try {
        const apps = await Application.find({ userEmail: req.params.email });
        res.json(apps);
    } catch (err) {
        res.status(500).json({ message: "Error fetching user apps" });
    }
});

module.exports = router;