// ================= USER =================
const user = JSON.parse(localStorage.getItem("user"));

if (!user || user.role !== "admin") {
    alert("Unauthorized access ❌");
    window.location.href = "login.html";
}

document.getElementById("welcome").innerText =
    `Welcome ${user.name} 👋`;

// ================= INIT =================
window.onload = () => {
    showApplications();
    loadApplications();
    loadPerformance();
};

// ================= NAV =================
function showDashboard() {
    document.getElementById("dashboardSection").classList.remove("hidden");
    document.getElementById("applicationsSection").classList.add("hidden");
    document.getElementById("performanceSection").classList.add("hidden");
}

function showApplications() {
    document.getElementById("dashboardSection").classList.add("hidden");
    document.getElementById("applicationsSection").classList.remove("hidden");
    document.getElementById("performanceSection").classList.add("hidden");
}

function showPerformance() {
    document.getElementById("dashboardSection").classList.add("hidden");
    document.getElementById("applicationsSection").classList.add("hidden");
    document.getElementById("performanceSection").classList.remove("hidden");
}

// ================= LOAD =================
async function loadApplications() {
    const res = await fetch("https://recruitsmart-backend.onrender.com/api/applications");
    const apps = await res.json();

    renderStats(apps);
    renderTable(apps);
}

// ================= STATS =================
function renderStats(apps) {
    document.getElementById("totalCount").innerText = apps.length;

    document.getElementById("selectedCount").innerText =
        apps.filter(a => a.status === "selected").length;

    document.getElementById("rejectedCount").innerText =
        apps.filter(a => a.status === "rejected").length;
}

// ================= TABLE =================
function renderTable(apps) {
    const tbody = document.getElementById("applications");
    tbody.innerHTML = "";

    apps.forEach(app => {

        // STATUS COLOR
        let statusColor =
            app.status === "selected" ? "text-green-400" :
            app.status === "rejected" ? "text-red-400" :
            "text-yellow-400";

        // ACTION
        let action = "";

        if (app.status === "pending") {
            action = `
                <button onclick="updateStatus('${app._id}','selected')" 
                class="bg-green-500 px-3 py-1 rounded mr-2">Select</button>

                <button onclick="updateStatus('${app._id}','rejected')" 
                class="bg-red-500 px-3 py-1 rounded">Reject</button>
            `;
        } 
        else if (app.status === "selected" && !app.interviewDateTime) {
            action = `
                <button onclick="openSchedule('${app._id}')"
                class="bg-blue-500 px-3 py-1 rounded">Schedule</button>
            `;
        } 
        else {
            action = `<span class="text-gray-500">Locked</span>`;
        }

        // RESUME
        let resumeLink = app.resume
            ? `<a href="https://recruitsmart-backend.onrender.com/uploads/${app.resume}" target="_blank" class="text-blue-400 underline">View</a>`
            : "-";

        // ✅ FIXED INTERVIEW TIME
        let interviewTime = "-";

        if (app.interviewDateTime) {
            interviewTime = new Date(app.interviewDateTime).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                dateStyle: "short",
                timeStyle: "short"
            });
        }

        // ROW
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td class="p-3">${app.userEmail}</td>
            <td class="p-3">${app.jobTitle}</td>
            <td class="p-3">${resumeLink}</td>

            <td class="p-3 text-green-400">
                ${interviewTime}
            </td>

            <td class="p-3 ${statusColor} font-semibold">
                ${app.status}
            </td>

            <td class="p-3">${action}</td>
        `;

        tbody.appendChild(tr);
    });
}

// ================= SCHEDULE =================
let selectedAppId = null;

function openSchedule(id) {
    selectedAppId = id;
    document.getElementById("scheduleModal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("scheduleModal").classList.add("hidden");
}

async function confirmSchedule() {

    const dateTime = document.getElementById("date").value;

    if (!dateTime) {
        alert("Select date/time");
        return;
    }

    const res = await fetch("https://recruitsmart-backend.onrender.com/api/applications/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedAppId, dateTime })
    });

    alert("Scheduled ✅");

    closeModal();
    loadApplications();
}

// ================= PERFORMANCE =================
async function loadPerformance() {
    const res = await fetch("https://recruitsmart-backend.onrender.com/api/applications");
    const data = await res.json();

    const table = document.getElementById("performanceTable");
    table.innerHTML = "";

    data.forEach(app => {

        if (app.percentage === undefined) return;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td class="p-3">${app.userEmail}</td>
            <td class="p-3">${app.jobTitle}</td>
            <td class="p-3">${app.score}</td>

            <td class="p-3">
                <div class="w-full bg-gray-700 h-2 rounded">
                    <div style="width:${app.percentage}%" class="bg-green-500 h-2 rounded"></div>
                </div>
                ${app.percentage}%
            </td>

            <td class="p-3 ${
                app.status === "selected" ? "text-green-400" :
                app.status === "rejected" ? "text-red-400" :
                "text-yellow-400"
            }">${app.status}</td>
        `;

        table.appendChild(row);
    });
}

// ================= LOGOUT =================
function logoutAdmin() {
    localStorage.clear();
    window.location.href = "login.html";
}

// ================= STATUS =================
async function updateStatus(id, status) {
    await fetch("https://recruitsmart-backend.onrender.com/api/applications/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
    });

    loadApplications();
}