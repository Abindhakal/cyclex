// =============================
// CycleX Pro - storage.js
// =============================

const STORAGE_KEY = "cyclex_rides";

// =============================
// SAVE RIDE
// =============================

function saveRideToStorage(rideData) {

    try {

        let rides = JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        ) || [];

        const summary = {

            id: Date.now(),

            distance: rideData.distanceKm || 0,

            calories: rideData.calories || 0,

            avgSpeed: rideData.avgSpeed || 0,

            maxSpeed: rideData.maxSpeed || 0,

            ascent: rideData.totalAscent || 0,

            descent: rideData.totalDescent || 0,

            elapsed: rideData.elapsedSeconds || 0,

            route: rideData.route || [],

            date: new Date().toISOString()
        };

        rides.push(summary);

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(rides)
        );

        showLastRide(summary);

    } catch (err) {

        console.log("Save error:", err);

    }
}

// =============================
// LOAD LAST RIDE
// =============================

function loadLastRide() {

    try {

        let rides = JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        ) || [];

        if (rides.length === 0) {

            document.getElementById("lastRide")
                .innerText = "No ride found";

            return;

        }

        const last = rides[rides.length - 1];

        showLastRide(last);

    } catch (err) {

        console.log("Load error:", err);

    }
}

// =============================
// DISPLAY LAST RIDE
// =============================

function showLastRide(ride) {

    const el = document.getElementById("lastRide");

    if (!el) return;

    el.innerHTML = `
        🚴 Distance: ${ride.distance.toFixed(2)} km<br>
        🔥 Calories: ${Math.round(ride.calories)} kcal<br>
        ⚡ Avg Speed: ${ride.avgSpeed.toFixed(1)} km/h<br>
        🚀 Max Speed: ${ride.maxSpeed.toFixed(1)} km/h<br>
        ⛰️ Ascent: ${Math.round(ride.ascent)} m<br>
        📉 Descent: ${Math.round(ride.descent)} m<br>
        🕒 Time: ${formatTime(ride.elapsed)}<br>
        📅 Date: ${new Date(ride.date).toLocaleString()}
    `;
}

// =============================
// CLEAR ALL DATA
// =============================

function clearAllRides() {

    localStorage.removeItem(STORAGE_KEY);

    document.getElementById("lastRide")
        .innerText = "No ride found";
}

// =============================
// EXPORT ALL RIDES
// =============================

function exportAllRides() {

    let rides = JSON.parse(
        localStorage.getItem(STORAGE_KEY)
    ) || [];

    const blob = new Blob(
        [JSON.stringify(rides, null, 2)],
        { type: "application/json" }
    );

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);

    a.download = "cyclex_rides.json";

    a.click();
}