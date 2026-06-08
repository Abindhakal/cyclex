// =============================
// CycleX Pro - weather.js
// =============================

// Default location (Kathmandu fallback)
let weatherLat = 27.7172;
let weatherLng = 85.3240;

// =============================
// INIT WEATHER
// =============================

window.addEventListener("load", () => {

    getUserLocation();

    setInterval(fetchWeather, 5 * 60 * 1000); // update every 5 min

});

// =============================
// GET USER LOCATION
// =============================

function getUserLocation() {

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
        (pos) => {

            weatherLat = pos.coords.latitude;
            weatherLng = pos.coords.longitude;

            fetchWeather();

        },
        (err) => {

            console.log("Weather location error:", err);

            fetchWeather(); // fallback

        }
    );

}

// =============================
// FETCH WEATHER
// =============================

async function fetchWeather() {

    try {

        const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${weatherLat}` +
        `&longitude=${weatherLng}` +
        `&current_weather=true`;

        const res = await fetch(url);

        const data = await res.json();

        const weather = data.current_weather;

        updateWeatherUI(weather);

    } catch (err) {

        console.log("Weather error:", err);

    }

}

// =============================
// UPDATE UI
// =============================

function updateWeatherUI(weather) {

    if (!weather) return;

    const temp = weather.temperature;
    const wind = weather.windspeed;
    const code = weather.weathercode;

    document.getElementById("temp").innerText =
        temp + "°C";

    document.getElementById("wind").innerText =
        wind + " km/h";

    document.getElementById("conditions").innerText =
        getConditionText(code);

    updateCyclingAdvice(temp, wind, code);

}

// =============================
// WEATHER CONDITIONS
// =============================

function getConditionText(code) {

    if (code === 0) return "Clear";
    if (code <= 3) return "Cloudy";
    if (code <= 48) return "Fog";
    if (code <= 67) return "Rain";
    if (code <= 77) return "Snow";
    if (code <= 82) return "Shower";
    return "Extreme";
}

// =============================
// CYCLING ADVICE
// =============================

function updateCyclingAdvice(temp, wind, code) {

    let advice = "";

    if (code >= 60) {
        advice = "⚠ Rainy ride - reduce speed";
    }
    else if (wind > 25) {
        advice = "💨 Strong wind - expect resistance";
    }
    else if (temp < 10) {
        advice = "🧊 Cold - warm-up recommended";
    }
    else if (temp > 35) {
        advice = "🔥 Hot weather - hydrate well";
    }
    else {
        advice = "✅ Ideal cycling conditions";
    }

    // optional: speak advice
    if (typeof speak === "function") {
        speak(advice);
    }

    console.log("Weather advice:", advice);
}