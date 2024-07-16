// Set up SVG and dimensions
var width = 960, height = 600;

var svg = d3.select("#visualization")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var projection = d3.geoNaturalEarth1()
    .scale(160)
    .translate([width / 2, height / 2]);

var path = d3.geoPath().projection(projection);

// Function to generate random shades of red based on score value
function getRandomColor(score) {
    // Choose a shade of red based on the score (assuming score is between 0 and 10)
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

// Load and process data
Promise.all([
    d3.csv("2018_mapped.csv"),
    d3.csv("2019_mapped.csv")
]).then(function([data2018, data2019]) {
    // Merge datasets
    var mergedData = mergeData(data2018, data2019);

    // Function to merge data based on country or region
    function mergeData(data2018, data2019) {
        var merged = [];
        data2018.forEach(d1 => {
            var match = data2019.find(d2 => d2["Country or region"] === d1["Country or region"]);
            if (match) {
                var diff = +match.Score - +d1.Score;
                merged.push({
                    "Country": d1["Country or region"],
                    "Score_2018": +d1.Score,
                    "Score_2019": +match.Score,
                    "Score_Difference": diff
                });
            }
        });
        return merged;
    }

    // Populate dropdown with country names
    var select = d3.select("#country-select");
    var countries = mergedData.map(d => d.Country);

    select.selectAll("option")
        .data(countries)
        .enter().append("option")
        .text(d => d);

    // Default selected country (first in the list)
    var selectedCountry = countries[0];

    // Function to update bar chart based on selected country
    function updateBarChart(country) {
        var selectedData = mergedData.find(d => d.Country === country);

        // Clear previous chart
        d3.select("#chart").html("");

        var margin = { top: 20, right: 20, bottom: 50, left: 80 };
        var width = 600 - margin.left - margin.right;
        var height = 400 - margin.top - margin.bottom;

        var svg = d3.select("#chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleBand()
            .range([0, width])
            .padding(0.1);

        var y = d3.scaleLinear()
            .range([height, 0]);

        x.domain(["2018", "2019"]);
        y.domain([0, d3.max([selectedData.Score_2018, selectedData.Score_2019])]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.selectAll(".bar")
            .data([selectedData.Score_2018, selectedData.Score_2019])
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d, i) { return x(i === 0 ? "2018" : "2019"); })
            .attr("y", function(d) { return y(d); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height - y(d); });

        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text("Happiness Score Comparison (2018 vs 2019) for " + country);
    }

    // Initial chart render
    updateBarChart(selectedCountry);

    // Handle dropdown change
    select.on("change", function() {
        selectedCountry = d3.select(this).property("value");
        updateBarChart(selectedCountry);
    });

}).catch(error => {
    console.error("Error loading data:", error);
});
