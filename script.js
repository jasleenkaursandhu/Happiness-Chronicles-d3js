// Load data
d3.csv("2019.csv").then(function(data) {
   // Convert numerical values from strings to numbers
   data.forEach(function(d) {
       d.Score = +d.Score; // Happiness score
       d.GDP_Per_Capita = +d.GDP_Per_Capita; // GDP per capita
       // Add more fields as needed for tooltips and annotations
   });

   // Set up SVG and dimensions
   var margin = { top: 20, right: 20, bottom: 50, left: 50 };
   var width = 800 - margin.left - margin.right;
   var height = 600 - margin.top - margin.bottom;

   var svg = d3.select("#visualization")
       .append("svg")
       .attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom)
       .append("g")
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   // Define scales
   var xScale = d3.scaleLinear()
       .domain(d3.extent(data, function(d) { return d.GDP_Per_Capita; })).nice()
       .range([0, width]);

   var yScale = d3.scaleLinear()
       .domain(d3.extent(data, function(d) { return d.Score; })).nice()
       .range([height, 0]);

   // Add axes
   var xAxis = d3.axisBottom(xScale);
   var yAxis = d3.axisLeft(yScale);

   svg.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis)
       .append("text")
       .attr("class", "label")
       .attr("x", width)
       .attr("y", -6)
       .style("text-anchor", "end")
       .text("GDP per Capita");

   svg.append("g")
       .attr("class", "y axis")
       .call(yAxis)
       .append("text")
       .attr("class", "label")
       .attr("transform", "rotate(-90)")
       .attr("y", 6)
       .attr("dy", ".71em")
       .style("text-anchor", "end")
       .text("Happiness Score");

   // Add dots for countries
   svg.selectAll(".dot")
       .data(data)
       .enter().append("circle")
       .attr("class", "dot")
       .attr("cx", function(d) { return xScale(d.GDP_Per_Capita); })
       .attr("cy", function(d) { return yScale(d.Score); })
       .attr("r", 5) // Adjust radius as needed
       .on("mouseover", function(d) {
           // Tooltip
           var tooltip = d3.select("#tooltip")
               .style("left", (d3.event.pageX + 10) + "px") // Adjust position offset as needed
               .style("top", (d3.event.pageY - 15) + "px") // Adjust position offset as needed
               .style("display", "inline-block")
               .html("<strong>Country:</strong> " + d.Country + "<br>" +
                     "<strong>Happiness Score:</strong> " + d.Score + "<br>" +
                     "<strong>GDP per Capita:</strong> " + d.GDP_Per_Capita);
       })
       .on("mousemove", function(d) {
           // Update tooltip position as mouse moves
           d3.select("#tooltip")
               .style("left", (d3.event.pageX + 10) + "px")
               .style("top", (d3.event.pageY - 15) + "px");
       })
       .on("mouseout", function(d) {
           // Hide tooltip
           d3.select("#tooltip").style("display", "none");
       });

   // Tooltip element
   d3.select("body").append("div")
       .attr("id", "tooltip")
       .style("position", "absolute")
       .style("z-index", "10")
       .style("background", "#fff")
       .style("padding", "10px")
       .style("display", "none")
       .style("border", "1px solid #aaa")
       .style("border-radius", "5px");
});
