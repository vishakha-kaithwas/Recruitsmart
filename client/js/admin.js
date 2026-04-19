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
    loadPerformance(); // 👈 ADD THIS
};

// ================= NAVIGATION =================
function showDashboard() {
    document.getElementById("dashboardSection").classList.remove("hidden");
    document.getElementById("applicationsSection").classList.add("hidden");
}

function showPerformance() {
    document.getElementById("dashboardSection").classList.add("hidden");
    document.getElementById("applicationsSection").classList.add("hidden");
    document.getElementById("performanceSection").classList.remove("hidden");
}

function showApplications() {
    document.getElementById("dashboardSection").classList.add("hidden");
    document.getElementById("applicationsSection").classList.remove("hidden");
}

// ================= LOAD DATA =================
async function loadApplications() {
    try {
        const res = await fetch("http://localhost:5000/api/applications");
        const apps = await res.json();

        console.log("Applications:", apps);

        if (!Array.isArray(apps)) {
            console.error("Invalid response:", apps);
            return;
        }

        renderStats(apps);
        renderTable(apps);

    } catch (err) {
        console.error("Error:", err);
    }
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

    if (!apps || apps.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center p-4 text-gray-400">
                    No applications found
                </td>
            </tr>
        `;
        return;
    }

    apps.forEach(app => {

        // ✅ STATUS COLOR (FIXED)
        let statusColor =
            app.status === "selected" ? "text-green-400" :
            app.status === "rejected" ? "text-red-400" :
            "text-yellow-400";

        // ================= ACTION =================
        let action = "";

        // Pending → Select / Reject
        if (app.status === "pending") {
            action = `
                <button onclick="updateStatus('${app._id}','selected')" 
                class="bg-green-500 px-3 py-1 rounded mr-2">
                Select
                </button>

                <button onclick="updateStatus('${app._id}','rejected')" 
                class="bg-red-500 px-3 py-1 rounded">
                Reject
                </button>
            `;
        }

        // Selected → Schedule
        else if (app.status === "selected" && !app.interviewDateTime) {
            action = `
                <button onclick="openSchedule('${app._id}')"
                class="bg-blue-500 px-3 py-1 rounded">
                Schedule
                </button>
            `;
        }

        // Scheduled → Locked
        else {
            action = `<span class="text-gray-500">Locked</span>`;
        }

        // ================= RESUME =================
        let resumeLink = app.resume
            ? `<a href="http://localhost:5000/uploads/${encodeURIComponent(app.resume)}"
                target="_blank"
                class="text-blue-400 underline">
                View
               </a>`
            : "-";

        // ================= INTERVIEW =================
        let interviewInfo = "-";

if (app.interviewDateTime) {
    const dt = new Date(app.interviewDateTime);

    interviewInfo = `
        <span class="text-green-400">
            ${dt.toLocaleDateString()} ${dt.toLocaleTimeString()}
        </span>
    `;
}
        // ================= ROW =================
        const tr = document.createElement("tr");

        tr.className = "border-b border-white/10 hover:bg-white/5 transition";

        tr.innerHTML = `
            <td class="p-3">${app.userEmail}</td>
            <td class="p-3">${app.jobTitle}</td>
            <td class="p-3">${resumeLink}</td>
            <td class="p-3">${interviewInfo}</td>

            <td class="p-3 ${statusColor} font-semibold capitalize">
                ${app.status}
            </td>

            <td class="p-3">${action}</td>
        `;

        tbody.appendChild(tr);
    });
}

// ================= SCHEDULE =================
let selectedAppId = null;

// OPEN MODAL

function openSchedule(id) {
    selectedAppId = id; // 🔥 MUST SET THIS
    document.getElementById("scheduleModal").classList.remove("hidden");
}

// CLOSE MODAL
function closeModal() {
    document.getElementById("scheduleModal").classList.add("hidden");
}

// CONFIRM
async function confirmSchedule() {

    const input = document.getElementById("date");
    const dateTime = input.value;

    console.log("RAW VALUE:", dateTime);

    if (!dateTime) {
        alert("Please select date and time");
        return;
    }

    console.log("Sending:", selectedAppId, dateTime);

    try {
        const res = await fetch("http://localhost:5000/api/applications/schedule", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: selectedAppId,
                dateTime: dateTime
            })
        });

        const data = await res.json();
        console.log("Response:", data);

        if (!res.ok) {
            alert(data.message || "Error");
            return;
        }

        alert("Interview Scheduled ✅");

        closeModal();
        loadApplications();

    } catch (err) {
        console.error("Schedule error:", err);
        alert("Scheduling failed ❌");
    }
}

// ================= LOAD PERFORMANCE =================
async function loadPerformance() {
    try {
        const res = await fetch("http://localhost:5000/api/applications");
        const data = await res.json();

        const table = document.getElementById("performanceTable");
        table.innerHTML = "";

        data.forEach(app => {

            // ✅ FIXED CONDITION
            if (app.percentage === undefined || app.percentage === null) return;

            const row = document.createElement("tr");

            row.className = "border-b border-white/10 hover:bg-white/5 transition";

            row.innerHTML = `
                <td class="p-3">${app.userEmail}</td>
                <td class="p-3">${app.jobTitle}</td>
                <td class="p-3">${app.score}</td>

                <!-- PERFORMANCE BAR -->
                <td class="p-3">
                    <div class="w-full bg-gray-700 h-2 rounded">
                        <div style="width:${app.percentage}%"
                        class="bg-green-500 h-2 rounded"></div>
                    </div>
                    <span class="text-sm">${app.percentage}%</span>
                </td>

                <!-- STATUS -->
                <td class="p-3 ${
                    app.status === "selected" ? "text-green-400" :
                    app.status === "rejected" ? "text-red-400" :
                    "text-yellow-400"
                } font-semibold capitalize">
                    ${app.status}
                </td>
            `;

            table.appendChild(row);
        });

    } catch (err) {
        console.error("Performance error:", err);
    }
}
function logoutAdmin() {

    // clear stored data
    localStorage.removeItem("user");

    // optional: clear everything
    localStorage.removeItem("job");
    localStorage.removeItem("jobId");

    alert("Logged out successfully 👋");

    window.location.href = "login.html";
}
// ================= UPDATE STATUS =================
async function updateStatus(id, status) {
    try {
        await fetch("http://localhost:5000/api/applications/update-status", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id, status })
        });

        loadApplications();

    } catch (err) {
        console.error(err);
    }
}