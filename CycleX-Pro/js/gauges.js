// =============================
// CycleX Pro - gauges.js
// =============================

// Circle configuration
const GAUGE_MAX_SPEED = 60; // km/h max scale
const GAUGE_MAX_HR = 200;   // bpm max scale
const GAUGE_MAX_CADENCE = 120; // rpm max scale

// Circle circumference (r = 85 from SVG)
const CIRCUMFERENCE = 2 * Math.PI * 85;

// =============================
// INIT GAUGES
// =============================

function initGauges() {

    setRingProgress("speedRing", 0);
    setRingProgress("hrRing", 0);
    setRingProgress("cadenceRing", 0);

}

// =============================
// SPEED GAUGE UPDATE
// =============================

function updateSpeedGauge(speedKmh) {

    let percent = Math.min(speedKmh / GAUGE_MAX_SPEED, 1);

    let offset = CIRCUMFERENCE - (percent * CIRCUMFERENCE);

    setRingProgress("speedRing", offset);

}

// =============================
// HEART RATE GAUGE (future BLE)
// =============================

function updateHRGauge(bpm) {

    if (!bpm) bpm = 0;

    let percent = Math.min(bpm / GAUGE_MAX_HR, 1);

    let offset = CIRCUMFERENCE - (percent * CIRCUMFERENCE);

    setRingProgress("hrRing", offset);

    document.getElementById("hrValue").innerText =
        bpm > 0 ? Math.round(bpm) : "--";
}

// =============================
// CADENCE GAUGE (future sensor)
// =============================

function updateCadenceGauge(rpm) {

    if (!rpm) rpm = 0;

    let percent = Math.min(rpm / GAUGE_MAX_CADENCE, 1);

    let offset = CIRCUMFERENCE - (percent * CIRCUMFERENCE);

    setRingProgress("cadenceRing", offset);

    document.getElementById("cadenceValue").innerText =
        rpm > 0 ? Math.round(rpm) : "--";
}

// =============================
// CORE RING ANIMATION
// =============================

function setRingProgress(id, offset) {

    const el = document.getElementById(id);

    if (!el) return;

    el.style.strokeDasharray = CIRCUMFERENCE;
    el.style.strokeDashoffset = offset;

}

// =============================
// SMOOTH ANIMATION LOOP
// =============================

let lastSpeed = 0;

function animateGauges() {

    // Smooth speed transition
    lastSpeed += (RideState.currentSpeed - lastSpeed) * 0.15;

    updateSpeedGauge(lastSpeed);

    requestAnimationFrame(animateGauges);
}

// =============================
// AUTO INIT
// =============================

window.addEventListener("load", () => {

    initGauges();

    animateGauges();

});