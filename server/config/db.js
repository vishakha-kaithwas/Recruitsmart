const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin:12345@cluster0.mdtbazz.mongodb.net/?appName=Cluster0")
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.log("DB Error:", err));