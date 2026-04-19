const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const path = require("path");
const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== ROUTES =====
const jobRoutes = require("./routes/jobRoutes");
const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const interviewRoutes = require("./routes/interviewRoutes");

app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/interview", interviewRoutes);

// ===== DB =====
mongoose.connect("mongodb+srv://vishakha:test123@cluster0.mdtbazz.mongodb.net/test")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log(err));

// test route
app.get("/", (req, res) => {
    res.send("API WORKING");
});

app.listen(5000, () => {
    console.log("🚀 Server running on port 5000");
});