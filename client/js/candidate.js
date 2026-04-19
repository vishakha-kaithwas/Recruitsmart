// ================= USER =================
const user = JSON.parse(localStorage.getItem("user"));
if (!user) window.location.href = "login.html";

let allJobs = [];
let applications = {};

// ================= LOAD APPLICATIONS =================
async function loadApplications() {
    try {
        const res = await fetch(`https://recruitsmart-backend.onrender.com/api/applications/${user.email}`);
        const apps = await res.json();

        applications = {};

        apps.forEach(app => {
            applications[String(app.jobId)] = app;
        });

        console.log("📦 Applications Loaded:", applications);

    } catch (err) {
        console.error("Applications error:", err);
    }
}

// ================= LOAD JOBS =================
async function loadJobs() {
    try {
        const res = await fetch("https://recruitsmart-backend.onrender.com/api/jobs");
        const jobs = await res.json();

        if (!Array.isArray(jobs)) return;

        allJobs = jobs;

        await loadApplications();

        renderJobs(jobs);

    } catch (err) {
        console.error("Jobs error:", err);
    }
}

// ================= INTERVIEW STATUS =================
function getInterviewStatus(app) {
    if (!app.interviewDateTime) return "not_scheduled";

    const now = new Date();
    const start = new Date(app.interviewDateTime);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    if (now < start) return "not_started";
    if (now > end) return "expired";
    return "active";
}

// ================= RENDER JOBS =================
function renderJobs(jobs) {
    const container = document.getElementById("content");
    container.innerHTML = "";

    jobs.forEach(job => {

        const app = applications[String(job._id)];
        let buttonHTML = "";

        if (app) {

            if (app.status === "selected") {

                const status = getInterviewStatus(app);

                if (status === "active") {
                    buttonHTML = `
                        <button onclick="startInterview('${job._id}', '${job.title}')"
                        class="bg-green-600 text-white px-4 py-1 rounded-full text-sm">
                        Take Interview
                        </button>`;
                } else {
                    buttonHTML = `<span class="text-green-500 font-semibold">Selected</span>`;
                }

            } 
            else if (app.status === "pending") {
                buttonHTML = `<span class="text-yellow-500 font-semibold">Applied</span>`;
            } 
            else {
                buttonHTML = `<span class="text-red-500 font-semibold">Rejected</span>`;
            }

        } else {
            buttonHTML = `
                <button onclick="goToApply('${job._id}')"
                class="bg-black text-white px-4 py-1 rounded-full text-sm">
                Apply
                </button>`;
        }

        const div = document.createElement("div");

        div.innerHTML = `
        <div class="bg-white/5 p-5 rounded-xl border border-white/10 mb-4 card-hover">
            <p class="text-xs text-gray-400">${job.company || "Company"}</p>
            <h2 class="text-lg font-semibold">${job.title}</h2>
            <div class="mt-2 text-sm">💰 ${job.salary || "N/A"}</div>

            <div class="mt-4 flex justify-between items-center">
                ${buttonHTML}

                <button onclick="openDetails('${job._id}')"
                class="bg-black text-white px-4 py-1 rounded-full text-sm">
                Details
                </button>
            </div>
        </div>
        `;

        container.appendChild(div);
    });
}

// ================= APPLY =================
function goToApply(jobId) {
    const job = allJobs.find(j => String(j._id) === String(jobId));

    localStorage.setItem("selectedJob", JSON.stringify(job));
    window.location.href = "apply.html";
}

// ================= START INTERVIEW =================
function startInterview(jobId, jobTitle) {
    localStorage.setItem("jobId", jobId);
    localStorage.setItem("job", jobTitle);

    window.location.href = "setup.html";
}

// ================= PROFILE =================
function showProfile() {
    document.getElementById("jobsSection").classList.add("hidden");
    document.getElementById("profileSection").classList.remove("hidden");

    document.getElementById("profileName").innerText = user.name;
    document.getElementById("profileEmail").innerText = user.email;

    // avatar
    const firstLetter = user.name.charAt(0).toUpperCase();
    document.getElementById("avatar").innerText = firstLetter;
}

// ================= SHOW JOBS =================
function showJobs() {
    document.getElementById("jobsSection").classList.remove("hidden");
    document.getElementById("profileSection").classList.add("hidden");
}

// ================= LOGOUT =================
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

// ================= DETAILS =================
function openDetails(jobId) {
    const job = allJobs.find(j => String(j._id) === String(jobId));
    if (!job) return;

    const modal = document.getElementById("jobModal");
    const applyBtn = document.getElementById("modalApply");

    modal.classList.remove("hidden");

    document.getElementById("modalTitle").innerText = job.title;
    document.getElementById("modalDesc").innerText = job.description;
    document.getElementById("modalSalary").innerText = job.salary || "N/A";
    document.getElementById("modalExp").innerText = job.experience || "N/A";

    const app = applications[String(job._id)];

    if (app) {

        if (app.status === "pending") {
            applyBtn.innerText = "Applied";
            applyBtn.disabled = true;
            applyBtn.className = "bg-yellow-500 text-white px-4 py-1 rounded";
        }

        else if (app.status === "selected") {
            applyBtn.innerText = "Selected";
            applyBtn.disabled = true;
            applyBtn.className = "bg-green-600 text-white px-4 py-1 rounded";
        }

        else {
            applyBtn.innerText = "Rejected";
            applyBtn.disabled = true;
            applyBtn.className = "bg-red-600 text-white px-4 py-1 rounded";
        }

    } else {
        applyBtn.innerText = "Apply";
        applyBtn.disabled = false;
        applyBtn.className = "bg-black text-white px-4 py-1 rounded";

        applyBtn.onclick = () => goToApply(job._id);
    }
}

// ================= INIT =================
window.onload = () => {
    loadJobs();
};