const express = require("express");
const router = express.Router();
const Interview = require("../models/Interview");

//get inverview
router.get("/:email", async (req, res) => {
    const email = req.params.email;

    const interviews = await Interview.find({ userEmail: email });

    res.json(interviews);
});

// SAVE INTERVIEW
router.post("/save", async (req, res) => {
    const { userEmail, jobTitle, responses } = req.body;

    const interview = new Interview({
        userEmail,
        jobTitle,
        responses
    });

    await interview.save();

    res.json({ message: "Interview saved" });
});

module.exports = router;