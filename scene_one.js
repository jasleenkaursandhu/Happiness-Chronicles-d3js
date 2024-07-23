// scene_one.js
var width = 960, height = 600;

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
    var redScale = d3.scaleLinear()
        .domain([0, 10])
        .range(["#fee5d9", "#a50f15"]);

    return redScale(score);
}

// Zoom behavior
var zoom = d3.zoom()
    .scaleExtent([1, 8]) // Min and max zoom levels
    .on("zoom", function(event) {
        svg.selectAll("path").attr("transform", event.transform);
    });

svg.call(zoom);

// Load and process data
Promise.all([
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
    d3.csv("cleanedData/2016_mapped.csv"),
    d3.csv("cleanedData/2017_mapped.csv"),
    d3.csv("cleanedData/2018_mapped.csv"),
    d3.csv("cleanedData/2019_mapped.csv")
]).then(function([geojson, data2016, data2017, data2018, data2019]) {

    // Map data for each year
    var dataByYear = {
        2016: data2016,
        2017: data2017,
        2018: data2018,
        2019: data2019
    };

    var yearSelect = d3.select("#year-select");
    var yearOptions = ["2016", "2017", "2018", "2019"];
    yearSelect.selectAll("option")
        .data(yearOptions)
        .enter().append("option")
        .attr("value", d => d)
        .text(d => d);

    var countrySelect = d3.select("#country-select");
    var countries = [];

    function updateMap(year) {
        var data = dataByYear[year];
        var dataMap = new Map();
        data.forEach(function(d) {
            dataMap.set(d["Country or region"], +d.Score);
        });

        geojson.features.forEach(d => {
            d.properties.Score = dataMap.get(d.properties.name) || 0;
        });

        // Populate country dropdown
        countries = Array.from(new Set(data.map(d => d["Country or region"])));
        countrySelect.selectAll("option")
            .data(["All Countries"].concat(countries))
            .enter().append("option")
            .attr("value", d => d)
            .text(d => d);

        // Update the map
        svg.selectAll(".country").remove(); // Clear previous map

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
            })
            .on("click", function(event, d) {
                // Zoom into selected country
                var bounds = path.bounds(d);
                var zoomScale = Math.min(
                    width / (bounds[1][0] - bounds[0][0]),
                    height / (bounds[1][1] - bounds[0][1])
                );
                var x = (width - zoomScale * (bounds[1][0] + bounds[0][0])) / 2;
                var y = (height - zoomScale * (bounds[1][1] + bounds[0][1])) / 2;
    
                svg.transition()
                    .duration(750)
                    .call(zoom.transform, d3.zoomIdentity.translate(x, y).scale(zoomScale));
            });

        // Update color scale legend
        var legend = svg.select(".legend");
        if (legend.empty()) {
            legend = svg.append("g")
                .attr("class", "legend")
                .attr("transform", `translate(${width - 100}, 20)`);
        }

        var legendScale = d3.scaleLinear()
            .domain([10, 0])
            .range([0, 100]);

        var legendAxis = d3.axisRight(legendScale)
            .ticks(5);

        legend.select(".legend-axis").remove();
        legend.append("g")
            .attr("class", "legend-axis")
            .call(legendAxis);

        var gradient = svg.select("#gradient");
        if (gradient.empty()) {
            gradient = svg.append("defs")
                .append("linearGradient")
                .attr("id", "gradient")
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "0%")
                .attr("y2", "100%");

            gradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", "#a50f15")
                .attr("stop-opacity", 1);

            gradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", "#fee5d9")
                .attr("stop-opacity", 1);
        }

        legend.select("rect").remove();
        legend.append("rect")
            .attr("width", 7)
            .attr("height", 100)
            .style("fill", "url(#gradient)");
    }

    // Initialize with the first year
    updateMap("2019");

    // Event listener for year dropdown change
    yearSelect.on("change", function() {
        var year = d3.select(this).property("value");
        updateMap(year);
    });

    // Event listener for country dropdown change
    countrySelect.on("change", function() {
        var country = d3.select(this).property("value");
        svg.selectAll(".country")
            .attr("fill", d => {
                if (country === "All Countries" || d.properties.name === country) {
                    return getColor(d.properties.Score);
                } else {
                    return "#ccc"; // Gray for non-selected countries
                }
            });
    });

}).catch(error => {
    console.error("Error loading data:", error);
});
