// set the dimensions and margins of the graph
//const margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

//Read the data
d3.csv("pres_trend.csv").then( function(data) {

  // group the data: I want to draw one line per group
  //const sumstat = d3.group(data, d => d.name); // nest function allows to group the calculation per level of a factor

  // Add X axis --> it is a date format
  
                            
  const x = d3.scaleOrdinal()//d3.scaleLinear()2001,2021//d3.scaleBand()
    
    .domain([2001,2006,2011,2016,2021])
    .range([  width-400, width-300, width-200, width-100, width ]);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([ height, 0 ]);

  svg.append("g")
  .attr("transform", `translate(${width-400},0)`)
    .call(d3.axisLeft(y).tickSize(-width-400));

  // color palette
  const color = d3.scaleOrdinal()
    .range(['#e41a1c','#377eb8',])

  
 // Initialize line with group a
 var line = svg
 .append('g')
 .append("path")
   .datum(data)
   .attr("d", d3.line()
     .x(function(d) { return x(+d.year) })
     .y(function(d) { return y(+d.museveni) })
   )
   .attr("stroke", "yellow")
   .style("stroke-width", 4)
   .style("fill", "none")

// Initialize dots with group a
var dot = svg
 .selectAll('circle')
 .data(data)
 .enter()
 .append('circle')
   .attr("cx", function(d) { return x(+d.year) })
   .attr("cy", function(d) { return y(+d.museveni) })
   .attr("r", 7)
   .style("fill", "yellow")


   var line1 = svg
   .append('g')
   .append("path")
     .datum(data)
     .attr("d", d3.line()
       .x(function(d) { return x(+d.year) })
       .y(function(d) { return y(+d.runnerup) })
     )
     .attr("stroke", "blue")
     .style("stroke-width", 2)
     .style("fill", "none")
  
  // Initialize dots with group a
  var dott1 = svg
   .selectAll('dot')
   .data(data)
   .enter()
   .append('circle')
     .attr("cx", function(d) { return x(+d.year) })
     .attr("cy", function(d) { return y(+d.runnerup) })
     .attr("r", 7)
     .style("fill", "blue")



     svg.append("circle").attr("cx",width-70).attr("cy",30).attr("r", 6).style("fill", "yellow")
    svg.append("circle").attr("cx",width-70).attr("cy",60).attr("r", 6).style("fill", "blue")
    svg.append("text").attr("x", width-50).attr("y", 30).text("Museveni").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", width-50).attr("y", 60).text("Runner up").style("font-size", "15px").attr("alignment-baseline","middle")   
    
    // Add X axis label:
    svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width/2 + margin.left-30)
    .attr("y", height + margin.top +20)
    .text("Year");

    // Y axis label:
    svg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 15)
    .attr("x", -margin.top - height/2 + 110)
    .text("Percentage of votes %")

})
