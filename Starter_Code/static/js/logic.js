// store the json as a variable named geourl 
var geourl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson";

// create the map 
var myMap = L.map("map", {
    center: [48.44, 18.55],
    zoom: 2
});

//add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//function to determine color based on the earthquakes depth
function mapColor(depth) {
    if (depth <=10) {
        return 'lightgreen';
     } else if (depth <= 30) {
        return 'yellowgreen';
     } else if (depth <=50) {
        return 'yellow';
     } else if (depth <= 70) {
        return 'orange';
     } else if (depth <= 90) {
        return 'darkorange';
     } else {
        return 'red';
     }
}

//function to show radius based on earthquakes magnitude 
function mapRadius(magnitude) {
    const baseRadius = 3;
    const scaleFactor = 3;
    return baseRadius + (magnitude * scaleFactor);
}

//function to style the map features 
function mapStyle(feature) {
    return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: mapColor(feature.geometry.coordinates[2]),
        color: "black",
        radius: mapRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
    };
}
// fetch and plot the earthquakes 
d3.json(geourl).then(function(data) {
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            var earthquakeMarker = L.circleMarker(latlng, mapStyle(feature));

            // Creating a pop-up with relevant information
            earthquakeMarker.bindPopup(
                `<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]} km<br>Date: ${new Date(feature.properties.time)}</p>`
            );

            return earthquakeMarker;
        }
    }).addTo(myMap);
}).catch(function(error) {
    console.log(error);
});

// add a legend to the map
var legend = L.control({ position: "bottomright" });

legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "info legend"),
        depths = [0, 10, 30, 50, 70, 90],
        colors = ["lightgreen", "yellowgreen", "yellow", "orange", "darkorange", "red"],
        labels = [];

    // loop through depth intervals and generate a label with a colored square for each interval
    for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
    }

    return div;
};

legend.addTo(myMap);