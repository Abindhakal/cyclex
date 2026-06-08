// =============================
// CycleX Pro - gpx.js
// =============================

// =============================
// EXPORT GPX
// =============================

function exportGPX() {

    const route = getRouteData ? getRouteData() : [];

    if (!route || route.length === 0) {
        alert("No route data to export");
        return;
    }

    let gpx =
`<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="CycleX Pro">
<trk>
<name>Cycle Ride</name>
<trkseg>
`;

    route.forEach(point => {

        const lat = point[0];
        const lng = point[1];

        gpx += `<trkpt lat="${lat}" lon="${lng}"></trkpt>\n`;

    });

    gpx += `
</trkseg>
</trk>
</gpx>`;

    const blob = new Blob([gpx], {
        type: "application/gpx+xml"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = `cyclex_ride_${Date.now()}.gpx`;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);
}

// =============================
// IMPORT GPX
// =============================

function importGPX(file) {

    const reader = new FileReader();

    reader.onload = function (e) {

        const parser = new DOMParser();

        const xml = parser.parseFromString(
            e.target.result,
            "text/xml"
        );

        const points = xml.getElementsByTagName("trkpt");

        const importedRoute = [];

        for (let i = 0; i < points.length; i++) {

            const lat = parseFloat(points[i].getAttribute("lat"));
            const lon = parseFloat(points[i].getAttribute("lon"));

            importedRoute.push([lat, lon]);

        }

        drawImportedRoute(importedRoute);

    };

    reader.readAsText(file);
}

// =============================
// DRAW IMPORTED ROUTE
// =============================

function drawImportedRoute(route) {

    if (!route || route.length === 0) return;

    // Clear existing if map exists
    if (typeof routeLine !== "undefined") {
        routeLine.setLatLngs(route);
    }

    if (typeof map !== "undefined") {
        map.fitBounds(routeLine.getBounds());
    }

    console.log("GPX imported route loaded:", route.length, "points");
}

// =============================
// FILE INPUT HOOK
// =============================

window.addEventListener("load", () => {

    const importInput = document.getElementById("gpxImport");

    const importBtn = document.getElementById("importBtn");

    if (importBtn && importInput) {

        importBtn.addEventListener("click", () => {
            importInput.click();
        });

        importInput.addEventListener("change", (e) => {

            const file = e.target.files[0];

            if (file) {
                importGPX(file);
            }

        });

    }

    const exportBtn = document.getElementById("exportBtn");

    if (exportBtn) {

        exportBtn.addEventListener("click", exportGPX);

    }

});