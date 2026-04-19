const Application = require("../models/Application");

// ================= GET ALL =================
exports.getApplications = async (req, res) => {
    const apps = await Application.find();
    res.json(apps);
};

// ================= UPDATE STATUS =================
exports.updateStatus = async (req, res) => {
    const { id, status } = req.body;

    await Application.findByIdAndUpdate(id, { status });

    res.json({ message: "Status updated" });
};

// ================= SCHEDULE INTERVIEW =================
exports.scheduleInterview = async (req, res) => {
    try {
        const { id, date, time } = req.body;

        console.log("Scheduling:", id, date, time);

        await Application.findByIdAndUpdate(id, {
            interviewDate: date,
            interviewTime: time
        });

        res.json({ message: "Interview scheduled" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to schedule" });
    }
};