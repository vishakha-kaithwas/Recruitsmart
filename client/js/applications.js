const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location.href = "login.html";
}

async function loadApplications() {
    const res = await fetch(`https://recruitsmart-backend.onrender.com/api/applications/${user.email}`);
    const apps = await res.json();

    const container = document.getElementById("applications");
    container.innerHTML = "";

    if (apps.length === 0) {
        container.innerHTML = "<p>No applications found</p>";
        return;
    }

    apps.forEach(app => {
        const div = document.createElement("div");
        div.className = "bg-white p-4 mb-4 rounded shadow";

        // 🎯 Status color
        let statusColor =
            app.status === "selected" ? "text-green-600" :
            app.status === "rejected" ? "text-red-600" :
            "text-yellow-600";

        // 🎯 Resume link
        let resumeLink = app.resume
            ? `<a href="https://recruitsmart-backend.onrender.com/uploads/${app.resume}" target="_blank" class="text-blue-600 underline">View Resume</a>`
            : `<span class="text-gray-500">No resume</span>`;

        // 🎯 Interview button
        let interviewSection = "";

        if (app.status === "selected") {
            interviewSection = `
                <button onclick="startInterview('${app.jobTitle}')"
                class="bg-green-600 text-white px-3 py-1 mt-2 rounded">
                Take Interview
                </button>
            `;
        } else if (app.status === "pending") {
            interviewSection = `<p class="text-yellow-600 mt-2">Awaiting selection</p>`;
        } else {
            interviewSection = `<p class="text-red-600 mt-2">Not eligible</p>`;
        }

        div.innerHTML = `
            <h2 class="text-lg font-bold">${app.jobTitle}</h2>

            <p>Status: 
                <span class="${statusColor} font-semibold">
                    ${app.status}
                </span>
            </p>

            <p class="mt-2"><b>Resume:</b> ${resumeLink}</p>

            ${interviewSection}
        `;

        container.appendChild(div);
    });
}

// 🎤 interview redirect
function startInterview(jobTitle) {
    localStorage.setItem("job", jobTitle);
    window.location.href = "interview.html";
}

loadApplications();