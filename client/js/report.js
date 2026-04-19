const data = JSON.parse(localStorage.getItem("result"));

const container = document.getElementById("report");

if (!data) {
    container.innerHTML = "<p>No data found</p>";
} else {

let percent = Math.round((data.score / data.total) * 100);

let strengths = [];
let weak = [];

data.responses.forEach(r => {
    if (r.marks >= 3) strengths.push(r.question);
    else weak.push(r.question);
});

container.innerHTML = `

<!-- SCORE CARD -->
<div class="bg-white p-6 rounded-xl shadow">
<h2 class="text-lg font-semibold mb-2">Score</h2>
<p class="text-3xl font-bold">${data.score}/${data.total}</p>
</div>

<!-- PERCENTAGE -->
<div class="bg-white p-6 rounded-xl shadow">
<h2 class="text-lg font-semibold mb-2">Percentage</h2>
<p class="text-3xl font-bold">${percent}%</p>
</div>

<!-- RESULT -->
<div class="bg-white p-6 rounded-xl shadow">
<h2 class="text-lg font-semibold mb-2">Result</h2>
<p class="text-xl font-bold ${
    percent > 70 ? "text-green-600" : 
    percent > 40 ? "text-yellow-600" : "text-red-600"
}">
${percent > 70 ? "Excellent" : percent > 40 ? "Good" : "Needs Improvement"}
</p>
</div>

<!-- STRENGTHS -->
<div class="bg-green-100 p-6 rounded-xl shadow col-span-2">
<h3 class="text-lg font-semibold mb-2">💪 Strengths</h3>
<ul>
${strengths.map(s => `<li>✔ ${s}</li>`).join("")}
</ul>
</div>

<!-- IMPROVEMENTS -->
<div class="bg-red-100 p-6 rounded-xl shadow col-span-1">
<h3 class="text-lg font-semibold mb-2">⚠ Improve</h3>
<ul>
${weak.map(s => `<li>${s}</li>`).join("")}
</ul>
</div>

`;
}

function goDashboard() {
    window.location.href = "candidate.html";
}