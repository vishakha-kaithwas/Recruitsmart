const user = JSON.parse(localStorage.getItem("user"));
const job = JSON.parse(localStorage.getItem("selectedJob"));

window.onload = () => {
    loadJobs();
};

if (!user || !job) {
    alert("Session expired");
    window.location.href = "candidate.html?applied=true";
}

document.getElementById("name").innerText = user.name;
document.getElementById("email").innerText = user.email;

async function apply() {
    const file = document.getElementById("resume").files[0];

    if (!file) {
        alert("Upload resume");
        return;
    }

    const formData = new FormData();
    formData.append("userEmail", user.email);
    formData.append("jobTitle", job.title);
    formData.append("jobId", job._id);
    formData.append("resume", file);

    try {
        const res = await fetch("http://localhost:5000/api/applications/apply", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        console.log("RESPONSE:", data);

        if (!res.ok) {
            alert(data.message || "Error applying");
            return;
        }

        alert("Applied successfully ✅");
        window.location.href = "candidate.html?applied=true";

    } catch (err) {
        console.error("Apply error:", err);
        alert("Server error");
    }
}