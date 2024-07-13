// Load the CSV data
d3.csv("2019.csv").then(function(data) {
    console.log(data); // Ensure data is loaded correctly

    const width = 960;
    const height = 600;

    // Create an SVG element
    const svg = d3.select("#chart")
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height);

    // Additional steps to create visualizations will go here
    // Example: Creating a bar chart

    // Extract necessary data for the bar chart
    const countries = data.map(d => d["Country or region"]);
    const scores = data.map(d => +d.Score);

    // Create scales for the bar chart
    const xScale = d3.scaleBand()
                     .domain(countries)
                     .range([0, width])
                     .padding(0.1);

    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(scores)])
                     .nice()
                     .range([height, 0]);

    // Create bars
    svg.selectAll(".bar")
       .data(data)
       .enter()
       .append("rect")
       .attr("class", "bar")
       .attr("x", d => xScale(d["Country or region"]))
       .attr("y", d => yScale(d.Score))
       .attr("width", xScale.bandwidth())
       .attr("height", d => height - yScale(d.Score))
       .attr("fill", "steelblue");

    // Add x-axis
    svg.append("g")
       .attr("class", "x-axis")
       .attr("transform", `translate(0,${height})`)
       .call(d3.axisBottom(xScale))
       .selectAll("text")
       .attr("transform", "rotate(-45)")
       .style("text-anchor", "end");

    // Add y-axis
    svg.append("g")
       .attr("class", "y-axis")
       .call(d3.axisLeft(yScale));

}).catch(function(error) {
    console.log(error);
});
