// =============================
// CycleX Pro - speech.js
// =============================

// Voice settings
let voiceEnabled = true;
let lastSpokenKm = 0;

// =============================
// BASIC SPEECH ENGINE
// =============================

function speak(text) {

    if (!voiceEnabled) return;

    if (!("speechSynthesis" in window)) return;

    const msg = new SpeechSynthesisUtterance(text);

    msg.rate = 1;
    msg.pitch = 1;
    msg.volume = 1;

    // Optional: pick a female/male voice if available
    let voices = window.speechSynthesis.getVoices();

    if (voices.length > 0) {
        msg.voice = voices[0];
    }

    window.speechSynthesis.speak(msg);
}

// =============================
// RIDE START ANNOUNCEMENT
// =============================

function speakRideStart() {
    speak("Ride started. Have a safe ride.");
}

// =============================
// RIDE STOP ANNOUNCEMENT
// =============================

function speakRideStop(distanceKm, avgSpeed) {

    speak(
        `Ride completed. Total distance ${distanceKm.toFixed(1)} kilometers. ` +
        `Average speed ${avgSpeed.toFixed(1)} kilometers per hour.`
    );
}

// =============================
// KM UPDATE ANNOUNCEMENT
// =============================

function speakRideUpdate(currentKm, avgSpeed) {

    if (currentKm <= lastSpokenKm) return;

    lastSpokenKm = currentKm;

    speak(
        `You have completed ${currentKm} kilometers. ` +
        `Average speed ${avgSpeed.toFixed(1)} kilometers per hour.`
    );
}

// =============================
// TOGGLE VOICE
// =============================

function toggleVoice() {
    voiceEnabled = !voiceEnabled;
}

// =============================
// CLEAR VOICE QUEUE
// =============================

function stopSpeaking() {
    window.speechSynthesis.cancel();
}