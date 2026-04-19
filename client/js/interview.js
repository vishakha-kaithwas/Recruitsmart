// ================= USER =================
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
    alert("Session expired");
    window.location.href = "login.html";
}

// ================= STATE =================
let index = 0;
let score = 0;
let responses = [];
let timeLeft = 60;
let timer;

const job = (localStorage.getItem("job") || "").toLowerCase();

// ================= QUESTION BANK =================
// ================= QUESTION BANK (ADVANCED) =================

const questionBank = {

  frontend: [
    "What is the box model in CSS?",
    "Explain Flexbox and Grid differences",
    "What is DOM and how JS manipulates it?",
    "What is event delegation?",
    "Explain closures in JavaScript",
    "Difference between let, var, const",
    "What is async/await?",
    "What is React Virtual DOM?",
    "Explain useEffect hook",
    "What is debouncing and throttling?",
    "What is CORS?",
    "How does browser rendering work?",
    "Explain responsive design techniques",
    "Difference between localStorage and sessionStorage",
    "How do you optimize frontend performance?"
  ],

  backend: [
    "What is Node.js and how it works?",
    "Explain Express.js middleware",
    "What is REST API?",
    "Difference between GET, POST, PUT, DELETE",
    "What is JWT authentication?",
    "Explain MVC architecture",
    "What is database indexing?",
    "Difference between SQL and NoSQL",
    "What is event loop?",
    "How do you handle errors in backend?",
    "What is API security?",
    "What is rate limiting?",
    "Explain microservices architecture",
    "How do you scale backend systems?",
    "What is caching?"
  ],

  python: [
    "What are decorators in Python?",
    "What are generators?",
    "Difference between list and tuple",
    "What is lambda function?",
    "What is GIL (Global Interpreter Lock)?",
    "What are Python modules and packages?",
    "Explain OOP in Python",
    "What is __init__ method?",
    "What is exception handling?",
    "Difference between deep copy and shallow copy",
    "What is multithreading in Python?",
    "What is Flask/Django?",
    "What is virtual environment?",
    "Explain recursion with example",
    "What are Python data structures?"
  ],

  default: [
    "Tell me about yourself",
    "Explain your project",
    "What are your strengths?",
    "What are your weaknesses?",
    "Why should we hire you?",
    "Where do you see yourself in 5 years?",
    "Describe a challenge you faced",
    "How do you handle pressure?",
    "What motivates you?",
    "What is your biggest achievement?",
    "Explain a failure and lesson learned",
    "How do you manage time?",
    "How do you learn new skills?",
    "What are your career goals?",
    "Why this company?"
  ]
};

// ================= ROLE DETECTION =================

function detectRole(job) {
    if (job.includes("frontend")) return "frontend";
    if (job.includes("backend")) return "backend";
    if (job.includes("python")) return "python";
    return "default";
}

// ================= GET QUESTIONS =================

function generateQuestions(job) {
    const role = detectRole(job);
    let qs = questionBank[role];

    // shuffle questions for randomness
    qs = qs.sort(() => 0.5 - Math.random());

    // always return 15 questions
    return qs.slice(0, 15);
}

let questions = generateQuestions(job);

// ================= SPEECH =================
function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
}

// ================= TIMER =================
function startTimer() {
    clearInterval(timer);
    timeLeft = 60;

    timer = setInterval(() => {
        document.getElementById("timer").innerText = `⏱ ${timeLeft}s`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timer);
            nextQuestion();
        }
    }, 1000);
}

// ================= SHOW QUESTION =================
function showQuestion() {
    const q = questions[index];

    document.getElementById("question").innerHTML =
        `💬 <span class="text-blue-400">Interviewer:</span> ${q}`;

    document.getElementById("progressText").innerText =
        `Question ${index + 1} / ${questions.length}`;

    document.getElementById("progressBar").style.width =
        `${((index + 1) / questions.length) * 100}%`;

    speak(q);
    startTimer();
}

// ================= EVALUATE =================
function evaluate(ans) {
    if (!ans) return 0;

    let marks = 0;
    if (ans.length > 20) marks += 2;
    if (ans.split(" ").length > 5) marks += 2;
    if (/[a-zA-Z]/.test(ans)) marks += 1;

    return marks;
}

// ================= NEXT =================
function nextQuestion() {
    const ans = document.getElementById("answer").value;

    let marks = evaluate(ans);
    score += marks;

    responses.push({
        question: questions[index],
        answer: ans,
        marks
    });

    document.getElementById("answer").value = "";
    index++;

    if (index < questions.length) {
        showQuestion();
    } else {
        finish();
    }
}

// ================= SKIP =================
function skipQuestion() {
    index++;
    if (index < questions.length) {
        showQuestion();
    } else {
        finish();
    }
}

// ================= FINAL =================
async function finish() {
    clearInterval(timer);
    console.log("JOB ID FROM STORAGE:", localStorage.getItem("jobId"));

    let percent = Math.round((score / (questions.length * 5)) * 100);

    let status = percent >= 70 ? "selected"
                : percent >= 40 ? "review"
                : "rejected";

    console.log("🚀 SENDING:", {
        email: user.email,
        jobId: localStorage.getItem("jobId"),
        score,
        percent
    });

    try {
        await fetch("http://localhost:5000/api/applications/update-score", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userEmail: user.email,
                jobId: localStorage.getItem("jobId"), // ✅ FIXED
                score: score,
                percentage: percent,
                status: status
            })
        });
    } catch (err) {
        console.error(err);
    }

    alert(`🎉 Interview Completed!\nScore: ${percent}%`);

    window.location.href = "candidate.html";
}

// ================= CAMERA =================
function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            document.getElementById("camera").srcObject = stream;
        })
        .catch(err => console.log(err));
}

// ================= SPEECH INPUT =================
function startListening() {
    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Speech not supported");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onresult = function(event) {
        document.getElementById("answer").value =
            event.results[0][0].transcript;
    };

    recognition.start();
}

// ================= INIT =================
window.onload = () => {
    startCamera();

    setTimeout(() => {
        speak("Welcome to RecruitSmart AI Interview. Let's begin.");
        showQuestion();
    }, 1000);

    document.getElementById("nextBtn").onclick = nextQuestion;
    document.getElementById("skipBtn").onclick = skipQuestion;
    document.getElementById("speakBtn").onclick = startListening;
};