// =============================
// CycleX Pro - app.js
// =============================

const RideState = {

    tracking: false,
    paused: false,

    watchId: null,

    startTime: null,
    elapsedSeconds: 0,
    movingSeconds: 0,

    timerInterval: null,

    currentSpeed: 0,
    avgSpeed: 0,
    maxSpeed: 0,

    distanceKm: 0,

    calories: 0,

    currentElevation: 0,
    totalAscent: 0,
    totalDescent: 0,

    lastElevation: null,

    route: [],

    lastAnnouncementKm: 0
};

// =============================
// DOM
// =============================

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const stopBtn = document.getElementById("stopBtn");

// =============================
// START RIDE
// =============================

function startRide(){

    if(RideState.tracking) return;

    RideState.tracking = true;
    RideState.paused = false;

    RideState.startTime = Date.now();

    RideState.timerInterval = setInterval(updateTimers,1000);

    if(typeof startGPS === "function"){
        startGPS();
    }

    updateStatus("Tracking");

    console.log("Ride Started");
}

// =============================
// PAUSE
// =============================

function pauseRide(){

    if(!RideState.tracking) return;

    RideState.paused = !RideState.paused;

    if(RideState.paused){

        updateStatus("Paused");

        pauseBtn.innerText = "▶ Resume";

    }else{

        updateStatus("Tracking");

        pauseBtn.innerText = "⏸ Pause";

    }

}

// =============================
// STOP
// =============================

function stopRide(){

    RideState.tracking = false;
    RideState.paused = false;

    clearInterval(RideState.timerInterval);

    if(typeof stopGPS === "function"){
        stopGPS();
    }

    saveRide();

    updateStatus("Ride Saved");

    pauseBtn.innerText = "⏸ Pause";

    console.log("Ride Stopped");
}

// =============================
// TIMERS
// =============================

function updateTimers(){

    if(!RideState.tracking) return;

    RideState.elapsedSeconds++;

    if(!RideState.paused){

        RideState.movingSeconds++;

    }

    document.getElementById("elapsedTime")
        .innerText =
        formatTime(RideState.elapsedSeconds);

    document.getElementById("movingTime")
        .innerText =
        formatTime(RideState.movingSeconds);
}

function formatTime(seconds){

    let hrs =
        Math.floor(seconds / 3600);

    let mins =
        Math.floor((seconds % 3600) / 60);

    let secs =
        seconds % 60;

    return (
        String(hrs).padStart(2,'0') + ":" +
        String(mins).padStart(2,'0') + ":" +
        String(secs).padStart(2,'0')
    );
}

// =============================
// AUTO PAUSE
// =============================

function autoPauseCheck(speed){

    if(!RideState.tracking) return;

    if(speed < 2){

        RideState.paused = true;

        updateStatus("Auto Paused");

    }
    else{

        RideState.paused = false;

        updateStatus("Tracking");

    }

}

// =============================
// UPDATE SPEED
// =============================

function updateSpeed(speed){

    RideState.currentSpeed = speed;

    if(speed > RideState.maxSpeed){

        RideState.maxSpeed = speed;

    }

    document.getElementById("speedValue")
        .innerText = Math.round(speed);

    document.getElementById("currentSpeed")
        .innerText =
        speed.toFixed(1) + " km/h";

    document.getElementById("maxSpeed")
        .innerText =
        RideState.maxSpeed.toFixed(1)
        + " km/h";

    autoPauseCheck(speed);

    updateSpeedGauge(speed);
}

// =============================
// DISTANCE
// =============================

function updateDistance(distanceKm){

    RideState.distanceKm = distanceKm;

    document.getElementById("distance")
        .innerText =
        distanceKm.toFixed(2) + " km";

    calculateAverageSpeed();

    calculateCalories();

    updateGoals(distanceKm);

    announceDistance();
}

// =============================
// AVG SPEED
// =============================

function calculateAverageSpeed(){

    let hours =
        RideState.movingSeconds / 3600;

    if(hours <= 0) return;

    RideState.avgSpeed =
        RideState.distanceKm / hours;

    document.getElementById("avgSpeed")
        .innerText =
        RideState.avgSpeed.toFixed(1)
        + " km/h";
}

// =============================
// CALORIES
// =============================

function calculateCalories(){

    RideState.calories =
        Math.round(
            RideState.distanceKm * 35
        );

    document.getElementById("calories")
        .innerText =
        RideState.calories;
}

// =============================
// ELEVATION
// =============================

function updateElevation(elevation){

    RideState.currentElevation =
        elevation;

    document.getElementById("elevation")
        .innerText =
        Math.round(elevation) + " m";

    if(RideState.lastElevation !== null){

        let diff =
            elevation -
            RideState.lastElevation;

        if(diff > 0){

            RideState.totalAscent += diff;

        }
        else{

            RideState.totalDescent +=
                Math.abs(diff);

        }

    }

    RideState.lastElevation =
        elevation;

    document.getElementById("ascent")
        .innerText =
        Math.round(
            RideState.totalAscent
        ) + " m";

    document.getElementById("descent")
        .innerText =
        Math.round(
            RideState.totalDescent
        ) + " m";
}

// =============================
// STATUS
// =============================

function updateStatus(text){

    const el =
        document.getElementById(
            "gpsStatus"
        );

    if(el){

        el.innerText = text;

    }

}

// =============================
// SAVE RIDE
// =============================

function saveRide(){

    if(typeof saveRideToStorage
        === "function"){

        saveRideToStorage(
            RideState
        );

    }

}

// =============================
// VOICE
// =============================

function announceDistance(){

    let currentKm =
        Math.floor(
            RideState.distanceKm
        );

    if(
        currentKm >
        RideState.lastAnnouncementKm
    ){

        RideState.lastAnnouncementKm =
            currentKm;

        if(
            typeof speakRideUpdate
            === "function"
        ){

            speakRideUpdate(
                currentKm,
                RideState.avgSpeed
            );

        }

    }

}

// =============================
// RESET
// =============================

function resetRide(){

    RideState.currentSpeed = 0;
    RideState.avgSpeed = 0;
    RideState.maxSpeed = 0;

    RideState.distanceKm = 0;

    RideState.calories = 0;

    RideState.elapsedSeconds = 0;
    RideState.movingSeconds = 0;

    RideState.route = [];

    RideState.totalAscent = 0;
    RideState.totalDescent = 0;

    RideState.lastElevation = null;

}

// =============================
// BUTTONS
// =============================

startBtn.addEventListener(
    "click",
    startRide
);

pauseBtn.addEventListener(
    "click",
    pauseRide
);

stopBtn.addEventListener(
    "click",
    stopRide
);

// =============================
// LOAD LAST RIDE
// =============================

window.addEventListener(
    "load",
    () => {

        if(
            typeof loadLastRide
            === "function"
        ){

            loadLastRide();

        }

    }
);