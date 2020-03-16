// @TODO: YOUR CODE HERE!

// The code for the chart is wrapped inside a function that
// automatically resizes the chart

 function makeResponsive() {

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // Define SVG area dimensions
  var svgWidth = window.innerWidth;
  var svgHeight = 600;

  // Define the chart's margins as an object
  var margin = {
    top: 50,
    right: 120,
    bottom: 100,
    left: 50
  };

  // Define dimensions of the chart area
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  // Select body, append SVG area to it, and set its dimensions
  // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
  var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
  
  // Append a group area, then set its margins
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Import Data
  d3.csv("assets/data/data.csv").then(function(healthData) {

    // Print the forceData
    console.log(healthData);
    
    
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    healthData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(healthData, d => d.poverty)])
      .range([0, width]).nice();

    var yLinearScale = d3.scaleLinear()
      .domain([4, d3.max(healthData, d => d.healthcare)])
      .range([height, 0]).nice();
      

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale).ticks(9);
    var leftAxis = d3.axisLeft(yLinearScale).ticks(14);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 6: Create circles & Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>In Poverty %: ${d.poverty}<br>Lacks Healthcare %: ${d.healthcare}`);
    });
    
    var labels = healthData.map(d => d.abbr); 

    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()

     circlesGroup 
      .append("circle")
      .attr("cx", (d, i) => xLinearScale(d.poverty, labels[i]))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "10")
      .attr("fill", "lightblue")
      .attr("opacity", "90") 
     

    circlesGroup.append("text").text(function(d) {
      return d.abbr
    }).attr("dx", (d, i) => {
      return xLinearScale(d.poverty, labels[i])
    }).attr("dy", d => {
      return yLinearScale(d.healthcare)+10/2.5})
      .attr("font-size", 10).attr("class", "stateText")
    
    // onmousever event
      .on("mouseover", function (d) {
        toolTip.show(d, this);
      })
        
   // onmouseout event
   .on("mouseout", function(data, index) {
    toolTip.hide(data);
  })

    // Step 7: Create tooltip in the chart
    // ==============================
     chartGroup.call(toolTip);

    // Create axes labels
    chartGroup.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 30)
      .attr("x", 0 - (height / 2))
      .attr("dy", "-1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
      .attr("text-anchor", "middle")
      .attr("class", "axisText")
      .text("In Poverty (%)");
  }).catch(function(error) {
    console.log(error);
  });
 }

// When the browser loads, makeResponsive() is called.
 makeResponsive();

// When the browser window is resized, makeResponsive() is called.
 d3.select(window).on("resize.updatesvg", makeResponsive);