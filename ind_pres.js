var margin = {top: 20, right: 20, bottom: 50, left: 70},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;


let container1= d3.select("#pres_cor").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");
                                        


                   /* .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");*/
                    
function add_polling(pid, pname) {
       const tmp = `<option value="${pname}"></option>`;
        stations.set(pname,pid);
        $("#pollinst").append(tmp);
                            
                        }


d3.csv("pres_pollingno.csv", ({LocationName,LocationID,Winner,district,winner_votes,Registered_Voters,Invalid_Ballots,winning_percent,voter_turnup,Valid_Ballots,Total_Ballots}) =>
({LocationName:LocationName,LocationID:LocationID,district:district,Winner:Winner,winner_votes:+winner_votes,winning_percent:+winning_percent,voter_turnup:+voter_turnup,Registered_Voters:+Registered_Voters,Invalid_Ballots:+Invalid_Ballots,Valid_Ballots:+Valid_Ballots,Total_Ballots:+Total_Ballots})
).then( (data) =>  {

    /*data.map(el => add_polling(el.LocationID, el.LocationName));
            const info = data.find(el => el.LocationID === "2-106-1-049-02");
            drawBar(info);
            $("#pollinst").on("change", (e) => {
                const val = data.find(el => el.LocationID == stations.get(e.target.value));
                drawBar(val);
            })*/

    

    let data1 =new Set( d3.map(data, (d) => {
        return d.district
    })
    )

    //Add constituency to drop down 
    /*d3.select("#districtcorr").selectAll("option")
    .data(d3.map(data1, (d) => {
        return d}))
    .enter()
    .append("option")
    .text(function(d){return d;})
    .attr("value", function(d){return d;})
     console.log(data1)*/

    
    console.log(d3.select("#districtcorr").property("value"))
        scatter(data)
        // A function that update the chart
    /*$("#pollinst").on("change", (e) => {
        station = d3.group(clients, d => d.LocationName);
        var selecti = d3.select("#pollinst").property("value")
              //write(selecti)
              district1.get(selecti)
            const val = data.find(el => el.LocationName == station.get(selecti));
            drawBaz(val);
        })*/

    
        console.log("hello")

   })

   function scatter(clients){

    dist = d3.group(clients, d => d.district);
    let distfilt = dist.get(d3.select("#districtcorr").property("value"))
    let maxcx = d3.max(distfilt, function(d) { return d.Registered_Voters; } );
    let sumcx = d3.sum(distfilt, function(d) { return d.winner_votes; } );
    let maxcy = d3.max(distfilt, function(d) { return d.Valid_Ballots; } );
    let sumcy = d3.sum(distfilt, function(d) { return d.Valid_Ballots; } );
    console.log(width+ " Hello: "+(((height-30)/2)+100))
    let yScale = d3.scaleLinear()
                    .range([0,300])
                    .domain([100, 0])//((maxcx+(maxcx/4))), 0])
    
    let xScale = d3.scaleLinear()
                    .range([0,300])
                    .domain([0, 100])//(maxcy+(maxcy/4))])

    

    let colorScale = d3.scaleOrdinal()
                        .domain(distfilt.map(d => d.Winner))
                        .range(["blue","gray", "teal", "cyan", "yellow", "purple","orange" ,"#99ee55","#3355aa","#22ffee","#aa22ff"])  

    let join = container1.append("g").selectAll("circle").data(distfilt)

    
    const corr = join.enter()
    .append("circle")
    .filter(function(d) { return d.Winner != "#N/A" })
        .attr("cx", function (d) { return xScale(d.winning_percent); } )
        .attr("cy", function (d) { return yScale(d.voter_turnup); } )
        .attr("r", 3)
        .style("fill", function (d) { return colorScale(d.Winner)} )//function (d) { return color(d.Species) } )

    // Add X axis label:
    container1.append("text")
    .attr("text-anchor", "end")
    .attr("x", width/2 + margin.left-10)
    .attr("y", height + margin.top -10)
    .text("WINNING PERCENTAGE %");

    // Y axis label:
    container1.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 30)
    .attr("x", -margin.top - height/2 + 110)
    .text("VOTER TURN OUT %")
    
    let xAxis = d3.axisBottom(xScale)
                    .ticks(5)
                    .tickFormat(d => d )
        container1.append("g")
            .attr("transform", "translate(0," + (((height-30)/2)+150) + ")")
            .call(xAxis)
    let yAxis = d3.axisLeft(yScale)
                .ticks(5)
                .tickFormat(d => d )
        container1.append("g")
            //.attr("transform", "translate(0,"+height-height+")")
            .call(yAxis)
    
            // Add one dot in the legend for each name.
    winner = d3.group(distfilt, d => d.Winner);
    for (let client of winner){
        console.log(client[1])
    }

    function update(selectedGroup) {

        // Create new data with the selection?
        //const dataFilter = data.map(function(d){return {time: d.time, value:d[selectedGroup]} })
        
        
        //var dataFilter = dat.filter(function(d){return d.Votes==maxi})
        // Give these new data to update line
        
        corr
          .data(selectedGroup)
          
          .transition()
          .duration(1000)
            .attr("cx", d => xScale(d.winning_percent))
            .attr("cy", d => yScale(d.voter_turnup))
      }
    
      d3.select("#districtcorr").on("change", function(event, d) {
        // recover the option that has been chosen
        let selectedOption = d3.select(this).property("value")
        distr = d3.group(clients, d => d.district);
        let dat1 = distr.get(selectedOption)
        // run the updateChart function with this selected option
        update(dat1)
    })
  
    /*container1.selectAll("mylabels")
    .data(winner.map(d => d.Winner))
    .enter()
    .append("text")
    .attr("x", 120)
    .attr("y", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function(d){ return colorScale(d)})
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")*/
                
   }


   function drawBaz(clients){
    
        
        let datafilt = clients

        let maxi = d3.max(datafilt, function(d) { return d.Votes; } );
        let sum = d3.sum(datafilt, function(d) { return d.Votes; } );
        let widthScale = d3.scaleLinear()
                        .range([0,300])
                        .domain([0, ((maxi+(maxi/4))/sum)*100])
        
        let positionScale = d3.scaleBand()
                            .range([0, 200])
                            .domain(datafilt.map(d => d.PoliticalParty))
                            .padding(0.3)
        
        let colorScale = d3.scaleOrdinal()
                            .domain(datafilt.map(d => d.PoliticalParty))
                            .range(["gray", "teal", "yellow", "blue", "purple"])
        let color = ["#010211", "#002200", "#ff4444", "0000ff", "#00ffff"]

        let join = container.selectAll("rect").data(datafilt)
        /*join.enter()
                .append("rect")
                .text(d => d.PoliticalParty+": "+widthScale(d.Votes))
                .style("background-color","blue")
                .style("margin","5px")
                .style("color","white")
                .style("width", d => 10)//widthScale(d.Votes)*1)*/
        cov = join.enter()
            .append("rect")
            .style("stroke","white")
            .attr("fill", function (d) { return colorScale(d.PoliticalParty)})
            .attr("width", d => widthScale((d.Votes/sum)*100))
            .attr("height", positionScale.bandwidth())
            .attr("y", d => positionScale(d.PoliticalParty))


        let xAxis = d3.axisBottom(widthScale)
                    .ticks(5)
                    .tickFormat(d => d + "%" )
        xs = d3.select("#xAxis")
            .attr("transform", "translate(100,  300)")
            .call(xAxis)
        let yAxis = d3.axisLeft(positionScale)
        ys = d3.select("#yAxis")
            .attr("transform", "translate(100, 100)")
            .call(yAxis)


   }
