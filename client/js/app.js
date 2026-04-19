// ✅ Load jobs
async function loadJobs() {
    console.log("Fetching jobs...");

    try {
        const res = await fetch("http://localhost:5000/api/jobs");
        const jobs = await res.json();

        console.log("Jobs received:", jobs);

        const container = document.getElementById("jobs");
        container.innerHTML = "";

        if (jobs.length === 0) {
            container.innerHTML = "<p>No jobs available</p>";
            return;
        }

        jobs.forEach(job => {
            const div = document.createElement("div");

            div.className = "bg-white p-4 rounded shadow";

            div.innerHTML = `
                <h2 class="text-xl font-bold">${job.title}</h2>
                <p>${job.description}</p>
                <button onclick="applyJob('${job.title}')" 
                    class="bg-indigo-600 text-white px-4 py-2 mt-2 rounded">
                    Apply
                </button>
            `;

            container.appendChild(div);
        });

    } catch (error) {
        console.error("Error fetching jobs:", error);
    }
}

// ✅ Apply function (your code — unchanged)
async function applyJob(jobTitle) {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    try {
        await fetch("http://localhost:5000/api/applications/apply", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userEmail: user.email,
                jobTitle: jobTitle
            })
        });

        alert("Applied successfully!");

    } catch (err) {
        console.error("Apply error:", err);
    }
}

// ✅ IMPORTANT: call function
loadJobs();