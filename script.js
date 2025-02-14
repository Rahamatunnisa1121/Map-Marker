// Initialize Google Map
function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 15.9129, lng: 79.7400 }, 
        zoom: 10,
    });

    // Load Locations & Student Data
    Promise.all([
        fetch("locations.json").then(response => response.json()),
        fetch("students.json").then(response => response.json())
    ]).then(([locations, students]) => {
        console.log("Loaded Locations:", locations);
        console.log("Loaded Student Data:", students);

        const infoBox = document.getElementById("info-box");

        locations.forEach(place => {
            const studentData = students.find(s => s.name === place.name);
            if (!studentData) {
                console.warn("No student data for:", place.name);
                return;
            }

            const pendingStudents = studentData.total_students - studentData.completed_students;

            const position = { lat: parseFloat(place.latitude), lng: parseFloat(place.longitude) };

            try {
                // Advanced Marker
                const marker = new google.maps.marker.AdvancedMarkerElement({
                    position: position,
                    map: map,
                    title: place.name,
                });

                console.log("Added Advanced Marker:", place.name);

                marker.addListener("mouseover", (event) => {
                    infoBox.innerHTML = `
                        <strong>${place.name}</strong><br>
                        📌 Total Students: <b>${studentData.total_students}</b><br>
                        ✅ Completed: <b>${studentData.completed_students}</b><br>
                        ❌ Pending: <b>${pendingStudents}</b>
                    `;
                    infoBox.style.display = "block";
                    infoBox.style.left = event.domEvent.clientX + 15 + "px";
                    infoBox.style.top = event.domEvent.clientY + 15 + "px";
                });

                marker.addListener("mouseout", () => {
                    infoBox.style.display = "none";
                });

            } catch (error) {
                console.warn("AdvancedMarkerElement failed, using google.maps.Marker instead.", error);

                // Fallback to Standard Marker
                const fallbackMarker = new google.maps.Marker({
                    position: position,
                    map: map,
                    title: place.name,
                });

                console.log("Added Fallback Marker:", place.name);

                fallbackMarker.addListener("mouseover", (event) => {
                    infoBox.innerHTML = `
                        <strong>${place.name}</strong><br>
                        📌 Total Students: <b>${studentData.total_students}</b><br>
                        ✅ Completed: <b>${studentData.completed_students}</b><br>
                        ❌ Pending: <b>${pendingStudents}</b>
                    `;
                    infoBox.style.display = "block";
                    infoBox.style.left = event.domEvent.clientX + 15 + "px";
                    infoBox.style.top = event.domEvent.clientY + 15 + "px";
                });

                fallbackMarker.addListener("mouseout", () => {
                    infoBox.style.display = "none";
                });
            }
        });
    }).catch(error => console.error("Error loading JSON:", error));
}
