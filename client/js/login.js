let selectedRole = "";

function selectRole(role) {
    selectedRole = role;

    document.getElementById("adminCard").classList.remove("bg-indigo-100");
    document.getElementById("candidateCard").classList.remove("bg-indigo-100");

    if (role === "admin") {
        document.getElementById("adminCard").classList.add("bg-indigo-100");
    } else {
        document.getElementById("candidateCard").classList.add("bg-indigo-100");
    }
}

async function loginUser() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password || !selectedRole) {
        alert("Please fill all fields and select role");
        return;
    }

    try {
        const res = await fetch("https://recruitsmart-backend.onrender.com/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Login failed");
            return;
        }

        // ✅ SAVE USER
        localStorage.setItem("user", JSON.stringify(data.user));

        // 🔥 IMPORTANT LOGIC
        let backendRole = data.user.role === "applicant" ? "candidate" : data.user.role;

if (backendRole !== selectedRole) {
    alert("⚠️ You selected wrong role!");
    return;
}

        // ✅ CORRECT REDIRECT
        if (data.user.role === "admin") {
            window.location.href = "admin.html";
        } else {
            window.location.href = "candidate.html";
        }

    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}