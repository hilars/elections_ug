// set the dimensions and margins of the graph
/*const margin1 = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin1.left - margin1.right,
    height = 400 - margin1.top - margin1.bottom;*/

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          `translate(${margin.left}, ${margin.top})`);

//Read the data
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv").then( function(data) {

  // Add X axis
  const x = d3.scaleLinear()
    .domain([0, 100])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Color scale: give me a specie name, I return a color
  let colorScale = d3.scaleOrdinal()
                        .domain(data.map(d => d.Winner))
                        .range(["yellow","gray", "teal", "cyan", "blue", "purple","orange" ,"#99ee55","#3355aa","#22ffee","#aa22ff"])
  
   const color = d3.scaleOrdinal()
    .domain(["setosa", "versicolor", "virginica" ])
    .range([ "#440154ff", "#21908dff", "#fde725ff"])


  // Highlight the specie that is hovered
  const highlight = function(event,d){

    selected_specie = d.Winner

    d3.selectAll(".dot")
      .transition()
      .duration(200)
      .style("fill", "lightgrey")
      .attr("r", 3)

    d3.selectAll("." + selected_specie)
      .transition()
      .duration(200)
      .style("fill", color(selected_specie))
      .attr("r", 7)
  }

  // Highlight the specie that is hovered
  const doNotHighlight = function(event,d){
    d3.selectAll(".dot")
      .transition()
      .duration(200)
      .style("fill", d => color(d.Winner))
      .attr("r", 5 )
  }

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", function (d) { return "dot " + d.Winner } )
      .attr("cx", function (d) { return x(d.winning_percent); } )
      .attr("cy", function (d) { return y(d.voter_turnup); } )
      .attr("r", 5)
      .style("fill", function (d) { return color(d.Winner) } )
    .on("mouseover", highlight)
    .on("mouseleave", doNotHighlight )

})