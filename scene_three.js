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

            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");

            svg.append("g")
                .call(d3.axisLeft(y));

            svg.selectAll(".bar")
                .data(filteredFactors)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", d => x(d[0]))
                .attr("width", x.bandwidth())
                .attr("y", d => y(+d[1]))
                .attr("height", d => height - y(+d[1]))
                .attr("fill", d => colorScale(+d[1]));
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
