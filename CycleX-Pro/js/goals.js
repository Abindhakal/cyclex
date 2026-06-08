// =============================
// CycleX Pro - goals.js
// =============================

const GOAL_STORAGE_KEY = "cyclex_goals";

// Default goals (you can change later in UI)
const DEFAULT_GOALS = {
    daily: 20,   // km
    weekly: 100  // km
};

// State
let goalData = {
    daily: 0,
    weekly: 0,
    lastReset: null
};

// =============================
// INIT GOALS
// =============================

function initGoals() {

    let saved = JSON.parse(
        localStorage.getItem(GOAL_STORAGE_KEY)
    );

    if (saved) {
        goalData = saved;
    }

    resetIfNeeded();

    updateGoalUI();
}

// =============================
// RESET LOGIC
// =============================

function resetIfNeeded() {

    const today = new Date().toDateString();

    if (goalData.lastReset !== today) {

        goalData.daily = 0;

        goalData.lastReset = today;

    }

    const weekKey = getWeekKey();

    if (!goalData.weekKey || goalData.weekKey !== weekKey) {

        goalData.weekly = 0;

        goalData.weekKey = weekKey;

    }

    saveGoals();
}

// =============================
// UPDATE GOALS (called from app.js)
// =============================

function updateGoals(distanceKm) {

    goalData.daily += distanceKm;
    goalData.weekly += distanceKm;

    saveGoals();
    updateGoalUI();
}

// =============================
// UI UPDATE
// =============================

function updateGoalUI() {

    // Daily
    let dailyPercent =
        Math.min(
            goalData.daily / DEFAULT_GOALS.daily,
            1
        );

    setGoalRing(
        "dailyGoalRing",
        dailyPercent,
        "dailyGoalText"
    );

    // Weekly
    let weeklyPercent =
        Math.min(
            goalData.weekly / DEFAULT_GOALS.weekly,
            1
        );

    setGoalRing(
        "weeklyGoalRing",
        weeklyPercent,
        "weeklyGoalText"
    );
}

// =============================
// CIRCLE RING UPDATE
// =============================

function setGoalRing(id, percent, textId) {

    const circle = document.getElementById(id);

    const radius = 50;

    const circumference = 2 * Math.PI * radius;

    circle.style.strokeDasharray = circumference;

    circle.style.strokeDashoffset =
        circumference - (percent * circumference);

    const text = document.getElementById(textId);

    if (text) {
        text.innerText =
            Math.round(percent * 100) + "%";
    }
}

// =============================
// SAVE GOALS
// =============================

function saveGoals() {

    localStorage.setItem(
        GOAL_STORAGE_KEY,
        JSON.stringify(goalData)
    );

}

// =============================
// WEEK KEY
// =============================

function getWeekKey() {

    const now = new Date();

    const year = now.getFullYear();

    const week = getWeekNumber(now);

    return `${year}-W${week}`;

}

// ISO week number
function getWeekNumber(d) {

    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));

    const dayNum = d.getUTCDay() || 7;

    d.setUTCDate(d.getUTCDate() + 4 - dayNum);

    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// =============================
// AUTO INIT
// =============================

window.addEventListener("load", initGoals);