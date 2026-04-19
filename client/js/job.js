const job = JSON.parse(localStorage.getItem("selectedJob"));

document.getElementById("title").innerText = job.title;
document.getElementById("desc").innerText = job.description;
document.getElementById("exp").innerText = job.experience || "Not specified";
document.getElementById("salary").innerText = job.salary || "Not specified";
document.getElementById("location").innerText = job.location || "Not specified";

function goToApply() {
    window.location.href = "apply.html";
}
async function apply() {
    const resume = document.getElementById("resume").value;

    await fetch("http://localhost:5000/api/applications/apply", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userEmail: JSON.parse(localStorage.getItem("user")).email,
            jobTitle: job.title,
            jobId: job._id,
            resume
        })
    });

    alert("Applied!");
}