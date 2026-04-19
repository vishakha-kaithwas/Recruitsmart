// ================= CAMERA =================
function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            document.getElementById("camera").srcObject = stream;
        })
        .catch(err => {
            alert("Camera/Mic access denied");
            console.error(err);
        });
}

// ================= MIC TEST =================
function testMic() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Speech recognition not supported");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onresult = function(event) {
        document.getElementById("micStatus").innerText =
            "🎤 Heard: " + event.results[0][0].transcript;
    };

    recognition.start();
}

// ================= START =================
function startInterview() {
    window.location.href = "interview.html";
}

// ================= INIT =================
window.onload = () => {
    startCamera();
};