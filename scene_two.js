// Set up SVG and dimensions
var width = 960, height = 600;

// Load and process data
Promise.all([
    d3.csv("cleanedData/2016_mapped.csv"),
    d3.csv("cleanedData/2017_mapped.csv"),
    d3.csv("cleanedData/2018_mapped.csv"),
    d3.csv("cleanedData/2019_mapped.csv")
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
                merged.push({
                    "Country": d1["Country or region"],
                    "Score_2016": +d1.Score,
                    "Score_2017": +match2017.Score,
                    "Score_2018": +match2018.Score,
                    "Score_2019": +match2019.Score
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

    // Function to update line chart based on selected country
    function updateLineChart(country) {
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

        var x = d3.scalePoint()
            .domain(["2016", "2017", "2018", "2019"])
            .range([0, width]);

        var y = d3.scaleLinear()
            .domain([
                d3.min([selectedData.Score_2016, selectedData.Score_2017, selectedData.Score_2018, selectedData.Score_2019]) - 0.1,
                d3.max([selectedData.Score_2016, selectedData.Score_2017, selectedData.Score_2018, selectedData.Score_2019]) + 0.1
            ])
            .range([height, 0]);

        var line = d3.line()
            .x(d => x(d.year))
            .y(d => y(d.score));

        var data = [
            { year: "2016", score: selectedData.Score_2016 },
            { year: "2017", score: selectedData.Score_2017 },
            { year: "2018", score: selectedData.Score_2018 },
            { year: "2019", score: selectedData.Score_2019 }
        ];

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));

        // Define the div for the tooltip
        var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#F4C2C2")  // Set line color to red
            .attr("stroke-width", 2)
            .attr("d", line);

        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => x(d.year))
            .attr("cy", d => y(d.score))
            .attr("r", 5)
            .attr("fill", "maroon")  // Set dot color to red
            .on("mouseover", function(event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html("Year: " + d.year + "<br/>Score: " + d.score.toFixed(3))
                    .style("left", (event.pageX - 60) + "px")  // Center the tooltip
                    .style("top", (event.pageY - 70) + "px");  // Position above the point
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

    // Initial call to update line chart with default selected country
    updateLineChart(selectedCountry);

    // Event listener for dropdown change
    select.on("change", function() {
        var country = d3.select(this).property("value");
        updateLineChart(country);
    });

}).catch(error => {
    console.error("Error loading data:", error);
});