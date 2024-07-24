// Set up SVG and dimensions
var width = 600, height = 400;

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
                    "Score_2016": (+d1.Score).toFixed(2),
                    "Score_2017": (+match2017.Score).toFixed(2),
                    "Score_2018": (+match2018.Score).toFixed(2),
                    "Score_2019": (+match2019.Score).toFixed(2),
                    "Factors_2016": {
                        "GDP per capita": (+d1["GDP per capita"]).toFixed(2),
                        "Social support": (+d1["Social support"]).toFixed(2),
                        "Healthy life expectancy": (+d1["Healthy life expectancy"]).toFixed(2),
                        "Freedom to make life choices": (+d1["Freedom to make life choices"]).toFixed(2),
                        "Generosity": (+d1["Generosity"]).toFixed(2),
                        "Perceptions of corruption": (+d1["Perceptions of corruption"]).toFixed(2)
                    },
                    "Factors_2017": {
                        "GDP per capita": (+match2017["GDP per capita"]).toFixed(2),
                        "Social support": (+match2017["Social support"]).toFixed(2),
                        "Healthy life expectancy": (+match2017["Healthy life expectancy"]).toFixed(2),
                        "Freedom to make life choices": (+match2017["Freedom to make life choices"]).toFixed(2),
                        "Generosity": (+match2017["Generosity"]).toFixed(2),
                        "Perceptions of corruption": (+match2017["Perceptions of corruption"]).toFixed(2)
                    },
                    "Factors_2018": {
                        "GDP per capita": (+match2018["GDP per capita"]).toFixed(2),
                        "Social support": (+match2018["Social support"]).toFixed(2),
                        "Healthy life expectancy": (+match2018["Healthy life expectancy"]).toFixed(2),
                        "Freedom to make life choices": (+match2018["Freedom to make life choices"]).toFixed(2),
                        "Generosity": (+match2018["Generosity"]).toFixed(2),
                        "Perceptions of corruption": (+match2018["Perceptions of corruption"]).toFixed(2)
                    },
                    "Factors_2019": {
                        "GDP per capita": (+match2019["GDP per capita"]).toFixed(2),
                        "Social support": (+match2019["Social support"]).toFixed(2),
                        "Healthy life expectancy": (+match2019["Healthy life expectancy"]).toFixed(2),
                        "Freedom to make life choices": (+match2019["Freedom to make life choices"]).toFixed(2),
                        "Generosity": (+match2019["Generosity"]).toFixed(2),
                        "Perceptions of corruption": (+match2019["Perceptions of corruption"]).toFixed(2)
                    }
                });
            }
        });
        return merged;
    }

    // Scene Three: Populate dropdowns and update factors visualization
    function initSceneThree() {
        var yearSelect = d3.select("#year-select");
        var countrySelectScene3 = d3.select("#country-select-scene3");

        var years = ["2016", "2017", "2018", "2019"];
        var countries = mergedData.map(d => d.Country);

        yearSelect.selectAll("option")
            .data(years)
            .enter().append("option")
            .text(d => d);

        countrySelectScene3.selectAll("option")
            .data(countries)
            .enter().append("option")
            .text(d => d);

        // Default selections
        var selectedYear = years[0];
        var selectedCountry = countries[0];
        var selectedFactors = Array.from(document.querySelectorAll('.factor-checkbox:checked')).map(cb => cb.value);

        function updateFactorsChart(year, country, factorsToShow) {
            var selectedData = mergedData.find(d => d.Country === country);
            var factors = selectedData["Factors_" + year];
            var score = selectedData["Score_" + year];

            // Filter factors based on selected checkboxes
            var filteredFactors = Object.entries(factors).filter(([key]) => factorsToShow.includes(key));

            // Clear previous chart
            d3.select("#factors-chart").html("");

            var width = 400, height = 400; // Adjusted width and height

            var margin = { top: 50, right: 50, bottom: 100, left: 100 }; // Adjusted margins

            var svg = d3.select("#factors-chart")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // Add happiness score above the chart
            svg.append("text")
                .attr("x", (width / 2))
                .attr("y", -20)
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .style("font-weight", "bold")
                .text(`Happiness Score for ${country} in ${year}: ${score}`);

            var x = d3.scaleBand()
                .range([0, width])
                .padding(0.2) // Adjusted padding
                .domain(filteredFactors.map(d => d[0]));

            var y = d3.scaleLinear()
                .range([height, 0])
                .domain([0, d3.max(filteredFactors.map(d => +d[1])) + 0.2]); // Adjusted domain for y-scale

            // Define color scale
            var colorScale = d3.scaleLinear()
            .domain([0, d3.max(filteredFactors.map(d => +d[1]))])
            .range(["lightcoral", "darkred"]);

            // Add color scale legend
            var legend = svg.append("g")
                .attr("class", "legend")
                .attr("transform", `translate(${width + 20}, 20)`);

            var legendScale = d3.scaleLinear()
                .domain([d3.max(Object.values(filteredFactors).map(d => +d)), 0])
                .range([0, 100]);

            var legendAxis = d3.axisRight(legendScale)
                .ticks(5);

            legend.append("g")
                .attr("class", "legend-axis")
                .call(legendAxis);

            var gradient = svg.append("defs")
                .append("linearGradient")
                .attr("id", "gradient")
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "0%")
                .attr("y2", "100%");

            gradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", "darkred")
                .attr("stop-opacity", 1);

            gradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", "lightcoral")
                .attr("stop-opacity", 1);

            legend.append("rect")
                .attr("width", 20)
                .attr("height", 100)
                .style("fill", "url(#gradient)");

            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "rotate(-45)") // Rotate x-axis labels
                .style("text-anchor", "end")
                .attr("dx", "0.2em")
                .attr("dy", "0.5em");

            svg.append("g")
                .call(d3.axisLeft(y));

            // Tooltip for showing data values on hover
            var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

            svg.selectAll(".bar")
                .data(filteredFactors)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", d => x(d[0]))
                .attr("y", d => y(+d[1]))
                .attr("width", x.bandwidth())
                .attr("height", d => height - y(+d[1]))
                .style("fill", d => colorScale(+d[1])) // Adjusted fill color
                .on("mouseover", function(event, d) {
                    d3.select(this)
                        .style("fill", "steelblue");
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html(`Year: ${year}<br>Country: ${country}<br>${d[0]}: ${d[1]}`)
                        .style("left", (event.pageX + 5) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function(event, d) {
                    d3.select(this)
                        .style("fill", colorScale(+d[1])); // Access the correct data value
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
        }

        updateFactorsChart(selectedYear, selectedCountry, selectedFactors);

        yearSelect.on("change", function() {
            selectedYear = this.value;
            updateFactorsChart(selectedYear, selectedCountry, selectedFactors);
        });

        countrySelectScene3.on("change", function() {
            selectedCountry = this.value;
            updateFactorsChart(selectedYear, selectedCountry, selectedFactors);
        });

        d3.selectAll('.factor-checkbox').on("change", function() {
            selectedFactors = Array.from(document.querySelectorAll('.factor-checkbox:checked')).map(cb => cb.value);
            updateFactorsChart(selectedYear, selectedCountry, selectedFactors);
        });
    }

    initSceneThree();
}).catch(function(error) {
    console.log(error);
});




// Define color scale
var colorScale = d3.scaleLinear()
    .domain([0, d3.max(filteredFactors.map(d => +d[1]))])
    .range(["lightcoral", "darkred"]);

// Draw the legend
var legend = svg.append("g")
    .attr("transform", `translate(${width + 20}, 20)`);

legend.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .style("font-size", "12px")
    .text("Factor Value");

var legendScale = d3.scaleLinear()
    .domain(colorScale.domain())
    .range([0, 100]);

var legendAxis = d3.axisRight(legendScale)
    .ticks(5)
    .tickFormat(d3.format(".2f"));

legend.append("g")
    .attr("transform", "translate(30, 0)")
    .call(legendAxis);

legend.selectAll(".legend-rect")
    .data(d3.range(0, 1.01, 0.1))
    .enter().append("rect")
    .attr("x", 0)
    .attr("y", d => legendScale(d * d3.max(filteredFactors.map(d => +d[1]))))
    .attr("width", 20)
    .attr("height", 10)
    .attr("fill", d => colorScale(d * d3.max(filteredFactors.map(d => +d[1]))));

// // Tooltip for showing data values on hover
// var tooltip = d3.select("body").append("div")
//     .attr("class", "tooltip")
//     .style("opacity", 0);

// svg.selectAll(".bar")
//     .on("mouseover", function(event, d) {
//         tooltip.transition()
//             .duration(200)
//             .style("opacity", .9);
//         tooltip.html(d[0] + "<br/>" + d[1])
//             .style("left", (event.pageX) + "px")
//             .style("top", (event.pageY - 28) + "px");
//     })
//     .on("mouseout", function(d) {
//         tooltip.transition()
//             .duration(500)
//             .style("opacity", 0);
//     });
