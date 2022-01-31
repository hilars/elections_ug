// set the dimensions and margins of the graph
/*const margin = {top: 20, right: 20, bottom: 50, left: 70},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;
*/
var width1 = 850,
    height1 = 650,
    margin1 = 20;
// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
const radius = Math.min(width1, height1) / 2 - margin1

// append the svg object to the div called 'my_dataviz'
const svg1 = d3.select("#polling-data")
  .append("svg")
    .attr("width", width1)
    .attr("height", height1)
  .append("g")
    .attr("transform", "translate(" + width1 / 2 + "," + height1 / 2 + ")");

    /*const COLORS = {
        colors:{"YMuseveni":"#ffdf00",
            "NMao":"green",
            "KyagulanyiSsentamuRobert":"#990000",
            "MugishaMuntuGregg":"purple",
            "MwesigyeFred":"gray",
            "MayambalaWilly":"cyan",
            "TumukundeHenryKakurugu":"orange",
            "AmuriatOboiPatrick":"#0096FF",
            "KalembeNancyLinda":"pink",
            "KatumbaJohn":"indigo",
            "KabuletaKiizaJoseph":"violet"
        },
        get(label){
            const color=this.colors[label];
            return color==undefined?'#808080':color;
        }
    };*/

    
    d3.csv("pres_pollingno.csv").then( (data) =>  {

        var selecta = d3.select("#pollinst").property("value")
        clients = d3.group(data, d => d.LocationName);
        dut = clients.get(selecta)
        piech(dut)
        
        $("#pollinst").on("change", (e) => {
            del_it1();
            //const val = data.find(el => el. == stations.get(e.target.value));
            clients = d3.group(data, d => d.District);
            var selecta1 = d3.select("#districtmp").property("value")
            
            piech(district1.get(d3.select("#pollinst").property("value")));
        })
        
        

    })
    
    
    const candi = ["YMuseveni",
                    "NMao",
                    "KyagulanyiSsentamuRobert",
                    "MugishaMuntuGregg",
                    "MwesigyeFred",
                    "MayambalaWilly",
                    "TumukundeHenryKakurugu",
                    "AmuriatOboiPatrick",
                    "KalembeNancyLinda",
                    "KatumbaJohn",
                    "KabuletaKiizaJoseph"]

    // Create dummy data
//var data = {a: 9, b: 20, c:30, d:8, e:12}

function piech(data1){
    
    var elems = {};
        
    console.log("Radius: "+width1)
        
        data1.forEach(d => {
            //console.log(Object.keys(d));
            x = Object.keys(d)
            for (i=4;i<=14;i++){
                elems[x[i]]= +d[x[i]];
                //console.log(x[i])
            }
            
                    
        });
        console.log(Object.entries(data1))//elems)


                // set the color scale
            const color = d3.scaleOrdinal()
            .domain(candi)
            .range(d3.schemeDark2);

           // Compute the position of each group on the pie:
            const pie = d3.pie()
            .sort(null) // Do not sort group by size
            .value(d => d[1])
            const data_ready = pie(Object.entries(elems))

            // The arc generator
            const arc = d3.arc()
            .innerRadius(radius * 0.5)         // This is the size of the donut hole
            .outerRadius(radius * 0.8)

            // Another arc that won't be drawn. Just for labels positioning
            const outerArc = d3.arc()
            .innerRadius(radius * 0.9)
            .outerRadius(radius * 0.9)

            // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
            svg1
            .selectAll('allSlices')
            .data(data_ready)
            .join('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data[1]))
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)


            var legendItemSize = 15
            var legendSpacing = 4

        console.log("cani:"+ color.domain())
            var legend = svg1
            .selectAll('.legend')
            .data(data_ready)
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', (d, i) => {
                var height11 = legendItemSize + legendSpacing
                var offset = height11 * color.domain().length / 3
                var x = legendItemSize * -5;
                var y = (i * height11) - offset
                return `translate(${x}, ${y})`
            })

            legend
            .append('rect')
            .data(data_ready)
            .attr('width', legendItemSize)
            .attr('height', legendItemSize)
            .style('fill', d =>color(d.data[1]));

            legend
            .append('text')
            .data(data_ready)
            .attr('x', legendItemSize + legendSpacing)
            .attr('y', legendItemSize - legendSpacing)
            .text((d) => d.data[0])


            // Add the polylines between chart and labels:
            /*svg
            .selectAll('allPolylines')
            .data(data_ready)
            .join('polyline')
            .attr("stroke", "black")
            .style("fill", "none")
            .attr("stroke-width", 1)
            .attr('points', function(d) {
                const posA = arc.centroid(d) // line insertion in the slice
                const posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
                const posC = outerArc.centroid(d); // Label position = almost the same as posB
                const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
                posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                return [posA, posB, posC]
            })

            // Add the polylines between chart and labels:
            svg
            .selectAll('allLabels')
            .data(data_ready)
            .join('text')
            .text(d => d.data[0])
            .attr('transform', function(d) {
                const pos = outerArc.centroid(d);
                const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                return `translate(${pos})`;
            })
            .style('text-anchor', function(d) {
                const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                return (midangle < Math.PI ? 'start' : 'end')
            })*/



}
/*
// set the color scale
var color = d3.scaleOrdinal()
  .domain(data)
  .range(d3.schemeSet2);

// Compute the position of each group on the pie:
var pie = d3.pie()
  .value(function(d) {return d.value; })
var data_ready = pie(d3.entries(data))
// Now I know that group A goes from 0 degrees to x degrees and so on.

// shape helper to build arcs:
var arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(radius)

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg
  .selectAll('mySlices')
  .data(data_ready)
  .enter()
  .append('path')
    .attr('d', arcGenerator)
    .attr('fill', function(d){ return(color(d.data.key)) })
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)

// Now add the annotation. Use the centroid method to get the best coordinates
svg
  .selectAll('mySlices')
  .data(data_ready)
  .enter()
  .append('text')
  .text(function(d){ return "grp " + d.data.key})
  .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
  .style("text-anchor", "middle")
  .style("font-size", 17)
  */

 function del_it1(){
        svg1.selectAll("allSlices").remove()
    }
