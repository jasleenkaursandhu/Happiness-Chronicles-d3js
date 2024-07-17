// Set up SVG and dimensions
var width = 960, height = 600;

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
                    .style("left", (event.pageX - 60) + "px")  // Center the tooltip
                    .style("top", (event.pageY - 70) + "px");  // Position above the bar
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
                merged.push({
                    "Country": d1["Country or region"],
                    "Score_2016": +d1.Score,
                    "Score_2017": +match2017.Score,
                    "Score_2018": +match2018.Score,
                    "Score_2019": +match2019.Score,
                    "Factors_2016": {
                        "GDP per capita": +d1["GDP per capita"],
                        "Social support": +d1["Social support"],
                        "Healthy life expectancy": +d1["Healthy life expectancy"],
                        "Freedom to make life choices": +d1["Freedom to make life choices"],
                        "Generosity": +d1["Generosity"],
                        "Perceptions of corruption": +d1["Perceptions of corruption"]
                    },
                    "Factors_2017": {
                        "GDP per capita": +match2017["GDP per capita"],
                        "Social support": +match2017["Social support"],
                        "Healthy life expectancy": +match2017["Healthy life expectancy"],
                        "Freedom to make life choices": +match2017["Freedom to make life choices"],
                        "Generosity": +match2017["Generosity"],
                        "Perceptions of corruption": +match2017["Perceptions of corruption"]
                    },
                    "Factors_2018": {
                        "GDP per capita": +match2018["GDP per capita"],
                        "Social support": +match2018["Social support"],
                        "Healthy life expectancy": +match2018["Healthy life expectancy"],
                        "Freedom to make life choices": +match2018["Freedom to make life choices"],
                        "Generosity": +match2018["Generosity"],
                        "Perceptions of corruption": +match2018["Perceptions of corruption"]
                    },
                    "Factors_2019": {
                        "GDP per capita": +match2019["GDP per capita"],
                        "Social support": +match2019["Social support"],
                        "Healthy life expectancy": +match2019["Healthy life expectancy"],
                        "Freedom to make life choices": +match2019["Freedom to make life choices"],
                        "Generosity": +match2019["Generosity"],
                        "Perceptions of corruption": +match2019["Perceptions of corruption"]
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

        function updateFactorsChart(year, country) {
            var selectedData = mergedData.find(d => d.Country === country);
            var factors = selectedData["Factors_" + year];

            // Clear previous chart
            d3.select("#factors-chart").html("");

            var margin = { top: 50, right: 50, bottom: 50, left: 80 };
            var width = 600 - margin.left - margin.right;
            var height = 400 - margin.top - margin.bottom;

            var svg = d3.select("#factors-chart")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var x = d3.scaleBand()
                .range([0, width])
                .padding(0.1)
                .domain(Object.keys(factors));

            var y = d3.scaleLinear()
                .range([height, 0])
                .domain([0, d3.max(Object.values(factors))]);

            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            svg.append("g")
                .call(d3.axisLeft(y));

            svg.selectAll(".bar")
                .data(Object.entries(factors))
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", d => x(d[0]))
                .attr("y", d => y(d[1]))
                .attr("width", x.bandwidth())
                .attr("height", d => height - y(d[1]))
                .style("fill", "#69b3a2");

            svg.selectAll(".bar-label")
                .data(Object.entries(factors))
                .enter().append("text")
                .attr("class", "bar-label")
                .attr("x", d => x(d[0]) + x.bandwidth() / 2)
                .attr("y", d => y(d[1]) - 5)
                .attr("text-anchor", "middle")
                .text(d => d[1]);

            svg.append("text")
                .attr("x", (width / 2))
                .attr("y", 0 - (margin.top / 2))
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .style("text-decoration", "underline")
                .text("Factors Contributing to Happiness Score in " + year + " for " + country);
        }

        // Initial call to update factors chart with default selections
        updateFactorsChart(selectedYear, selectedCountry);

        // Event listeners for dropdown changes
        yearSelect.on("change", function() {
            selectedYear = d3.select(this).property("value");
            updateFactorsChart(selectedYear, selectedCountry);
        });

        countrySelectScene3.on("change", function() {
            selectedCountry = d3.select(this).property("value");
            updateFactorsChart(selectedYear, selectedCountry);
        });
    }

    // Initialize scene three if the corresponding elements are present
    if (document.querySelector("#scene3")) {
        initSceneThree();
    }

}).catch(error => {
    console.error("Error loading data:", error);
});


