// =============================
// CycleX Pro - gps.js
// =============================

// Map setup (OpenStreetMap)
let map = L.map("map").setView([27.7172, 85.3240], 15);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap"
}).addTo(map);

// Route polyline
let routeLine = L.polyline([], {
    color: "#fc4c02",
    weight: 5,
    opacity: 0.9
}).addTo(map);

// GPS state
let gpsWatchId = null;

let lastPosition = null;

// =============================
// START GPS TRACKING
// =============================

function startGPS() {

    if (!navigator.geolocation) {
        alert("GPS not supported");
        return;
    }

    gpsWatchId = navigator.geolocation.watchPosition(
        onGPSUpdate,
        onGPSError,
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000
        }
    );

    console.log("GPS tracking started");
}

// =============================
// STOP GPS
// =============================

function stopGPS() {

    if (gpsWatchId !== null) {
        navigator.geolocation.clearWatch(gpsWatchId);
        gpsWatchId = null;
    }

    lastPosition = null;

    console.log("GPS stopped");
}

// =============================
// GPS UPDATE HANDLER
// =============================

async function onGPSUpdate(pos) {

    if (!RideState.tracking || RideState.paused) {
        return;
    }

    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    const speedMs = pos.coords.speed || 0;
    const speedKmh = speedMs * 3.6;

    // Feed speed into app.js
    updateSpeed(speedKmh);

    // Route array (for GPX export)
    RideState.route.push([lat, lng]);

    // Draw route
    routeLine.addLatLng([lat, lng]);

    // Auto center map
    map.setView([lat, lng], 16);

    // Distance calculation
    if (lastPosition) {

        let d = haversineDistance(
            lastPosition.lat,
            lastPosition.lng,
            lat,
            lng
        );

        RideState.distanceKm += d;

        updateDistance(RideState.distanceKm);
    }

    lastPosition = { lat, lng };

    // Elevation fetch (light throttling)
    if (RideState.route.length % 5 === 0) {
        fetchElevation(lat, lng);
    }

    // Heading (direction)
    if (pos.coords.heading !== null) {
        updateCompass(pos.coords.heading);
    }

    // Store last position for compass fallback
    RideState.lastLat = lat;
    RideState.lastLng = lng;
}

// =============================
// GPS ERROR
// =============================

function onGPSError(err) {
    console.log("GPS Error:", err.message);
    updateStatus("GPS Error");
}

// =============================
// DISTANCE (Haversine formula)
// =============================

function haversineDistance(lat1, lon1, lat2, lon2) {

    const R = 6371; // km

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

// =============================
// ELEVATION API
// =============================

async function fetchElevation(lat, lng) {

    try {

        let res = await fetch(
            `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`
        );

        let data = await res.json();

        let elevation = data.results[0].elevation;

        updateElevation(elevation);

    } catch (err) {
        console.log("Elevation error", err);
    }
}

// =============================
// COMPASS UPDATE
// =============================

function updateCompass(heading) {

    let direction = "N";

    if (heading >= 337.5 || heading < 22.5) direction = "N";
    else if (heading < 67.5) direction = "NE";
    else if (heading < 112.5) direction = "E";
    else if (heading < 157.5) direction = "SE";
    else if (heading < 202.5) direction = "S";
    else if (heading < 247.5) direction = "SW";
    else if (heading < 292.5) direction = "W";
    else direction = "NW";

    document.getElementById("heading").innerText = direction;
}

// =============================
// EXPORT DATA ACCESS
// =============================

// used by gpx.js
function getRouteData() {
    return RideState.route;
}