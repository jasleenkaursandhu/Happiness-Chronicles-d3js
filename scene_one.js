// Set up SVG and dimensions
var width = 960, height = 1000;

var svg = d3.select("#visualization")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var margin = { top: 50, right: 50, bottom: 50, left: 50 };

var projection = d3.geoNaturalEarth1()
    .scale(160)
    .translate([width / 2, height / 2]);

var path = d3.geoPath().projection(projection);

// Function to generate random shades of red based on score value
function getColor(score) {
    // Choose a shade of red based on the score.
    // Darker red shades for higher scores.
    var redScale = d3.scaleLinear()
        .domain([0, 10])
        .range(["#fee5d9", "#a50f15"]); // Light red to dark red

    return redScale(score);
}

// Load and process data
Promise.all([
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
    d3.csv("2019_mapped.csv")
]).then(function([geojson, data]) {
    var dataMap = new Map();
    data.forEach(function(d) {
        dataMap.set(d["Country or region"], +d.Score);
    });

    geojson.features.forEach(d => {
        d.properties.Score = dataMap.get(d.properties.name) || 0;
    });

    // Populate dropdown with country names
    var select = d3.select("#country-select");
    var countries = Array.from(new Set(data.map(d => d["Country or region"])));
    select.selectAll("option")
        .data(["All Countries"].concat(countries))
        .enter().append("option")
        .text(d => d);

    // Function to update map based on selected country
    function updateMap(selectedCountry) {
        svg.selectAll(".country")
            .attr("fill", d => {
                if (selectedCountry === "" || d.properties.name === selectedCountry) {
                    return getColor(d.properties.Score);
                } else {
                    return "#ccc"; // Gray for non-selected countries
                }
            });
    }

    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(geojson.features)
        .enter().append("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("fill", d => getColor(d.properties.Score))
        .on("mouseover", function(event, d) {
            const [x, y] = d3.pointer(event);
            const tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("left", `${x + 10}px`)
                .style("top", `${y + 10}px`)
                .html(`<strong>${d.properties.name}</strong><br>Score: ${d.properties.Score || 'N/A'}`);
        })
        .on("mousemove", function(event) {
            const [x, y] = d3.pointer(event);
            d3.select(".tooltip")
                .style("left", `${x + 10}px`)
                .style("top", `${y + 10}px`);
        })
        .on("mouseout", function() {
            d3.select(".tooltip").remove();
        });

    // Event listener for dropdown change
    select.on("change", function() {
        var country = d3.select(this).property("value");
        updateMap(country === "All Countries" ? "" : country);
    });

}).catch(error => {
    console.error("Error loading data:", error);
});
