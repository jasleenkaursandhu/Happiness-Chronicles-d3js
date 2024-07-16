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
    // Choose a shade of red based on the score .
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

// Load and process data
Promise.all([
    d3.csv("2016_mapped.csv"),
    d3.csv("2017_mapped.csv"),
    d3.csv("2018_mapped.csv"),
    d3.csv("2019_mapped.csv")
]).then(function([data2016, data2017, data2018, data2019]) {
    // Merge datasets
    var mergedData = mergeData(data2016, data2017, data2018, data2019);

    // Function to merge data based on country or region
    function mergeData(data2016, data2017, data2018, data2019) {
        var merged = [];
        data2016.forEach(d1 => {
            var match2017 = data2017.find(d2 => d2["Country or region"] === d1["Country or region"]);
            var match2018 = data2018.find(d3 => d3["Country or region"] === d1["Country or region"]);
            var match2019 = data2019.find(d4 => d4["Country or region"] === d1["Country or region"]);
            if (match2017 && match2018 && match2019) {
                var diff1716 = +match2017.Score - +d1.Score;
                var diff1816 = +match2018.Score - +d1.Score;
                var diff1916 = +match2019.Score - +d1.Score;
                merged.push({
                    "Country": d1["Country or region"],
                    "Score_2016": +d1.Score,
                    "Score_2017": +match2017.Score,
                    "Score_2018": +match2018.Score,
                    "Score_2019": +match2019.Score,
                    "Score_Difference_2017": diff1716,
                    "Score_Difference_2018": diff1816,
                    "Score_Difference_2019": diff1916
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

        var margin = { top: 50, right: 50, bottom: 50, left: 80 };
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

        x.domain(["2016", "2017", "2018", "2019"]);
        y.domain([0, d3.max([selectedData.Score_2016, selectedData.Score_2017, selectedData.Score_2018, selectedData.Score_2019])]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));

        // Define the div for the tooltip
        var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        svg.selectAll(".bar")
            .data([
                { year: "2016", score: selectedData.Score_2016 },
                { year: "2017", score: selectedData.Score_2017 },
                { year: "2018", score: selectedData.Score_2018 },
                { year: "2019", score: selectedData.Score_2019 }
            ])
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.year))
            .attr("y", d => y(d.score))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.score))
            .style("fill", function(d, i) { return i === 0 ? "#fee5d9" : i === 1 ? "#fcae91" : i === 2 ? "#fb6a4a" : "#cb181d"; }) // Different shades of red for bars
            .on("mouseover", function(event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html("Year: " + d.year + "<br/>Score: " + d.score)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text("Happiness Score Comparison (2016 - 2019) for " + country);
    }

    // Initial call to update bar chart with default selected country
    updateBarChart(selectedCountry);

    // Event listener for dropdown change
    select.on("change", function() {
        var country = d3.select(this).property("value");
        updateBarChart(country);
    });

}).catch(error => {
    console.error("Error loading data:", error);
});


