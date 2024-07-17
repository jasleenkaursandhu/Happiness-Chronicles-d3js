// Set up SVG and dimensions
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
function getRandomColor(score) {
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

    // Assign colors to each country based on score
    geojson.features.forEach(d => {
        d.properties.fill = getRandomColor(d.properties.Score);
    });

    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(geojson.features)
        .enter().append("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("fill", d => d.properties.fill)
        .on("mouseover", function(event, d) {
            const [x, y] = d3.pointer(event);
            const tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("left", `${x + 10}px`)
                .style("top", `${y + 10}px`)
                .html(`<strong>${d.properties.name}</strong><br>Happiness Score: ${d.properties.Score || 'N/A'}`);
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

    // Create a list of countries displayed beside the map
    var countryList = d3.select("#country-list");

    countryList.select("#country-list-title")
        .text("Country List")
        .style("color", "#8B0000") // Dark red color for the title
        .style("font-weight", "bold") // Bold font for the title
        .style("text-align", "center"); // Center-align the title

    geojson.features.forEach(d => {
        countryList.append("div")
            .classed("country-item", true)
            .text(d.properties.name)
            .style("color", d.properties.fill) // Use country color for text color
            .style("font-weight", "bold") // Make the country names bold for better visibility
            .on("click", function() {
                svg.selectAll(".country")
                    .attr("fill", "#ccc"); // Reset all countries to gray

                d3.select(this)
                    .style("background-color", "lightblue"); // Highlight clicked country in the list

                svg.selectAll(".country")
                    .filter(function(f) { return f.properties.name === d.properties.name; })
                    .attr("fill", d.properties.fill); // Highlight clicked country on the map
            });
    });

}).catch(error => {
    console.error("Error loading data:", error);
});
