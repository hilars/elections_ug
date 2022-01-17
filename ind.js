
var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    let container = d3.select("#body")
                   /* .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");*/
                    
                    
   data =  d3.csv("mps_results_2021.csv",
    ({District,Constituency,Name,PoliticalParty,Votes}) => ({
        District:District, Constituency:Constituency , Name:Name, PoliticalParty:PoliticalParty, Votes:+Votes
    })
    )
   
    data.then(dataload)

    function dataload(data){

        dat =new Set( d3.map(data, (d) => {
           return d.District
       })
       )
       
       //Add constituency to drop down 
        d3.select("#districtmp").selectAll("option")
            .data(d3.map(dat, (d) => {
                 return d}))
            .enter()
            .append("option")
            .text(function(d){return d;})
            .attr("value", function(d){return d;})

                
        bars(data);
                

    }



    function bars(clients){
        district1 = d3.group(clients, d => d.District);
        var selecti = d3.select("#districtmp").property("value")
              //write(selecti)
        
        let datafilt = district1.get(selecti)

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
        d3.select("#xAxis")
            .attr("transform", "translate(100, 300)")
            .call(xAxis)
        let yAxis = d3.axisLeft(positionScale)
        ys = d3.select("#yAxis")
            .attr("transform", "translate(100, 100)")
            .call(yAxis)


            function update(selectedGroup) {

                // Create new data with the selection?
                //const dataFilter = data.map(function(d){return {time: d.time, value:d[selectedGroup]} })
                
                
                //var dataFilter = dat.filter(function(d){return d.Votes==maxi})
                // Give these new data to update line
                console.log(selectedGroup)
                let positionScale = d3.scaleBand()
                            .range([0, 200])
                            .domain(selectedGroup.map(d => d.PoliticalParty))
                            .padding(0.3)
                ys.call(yAxis)
                cov .append("rect")
                            .style("stroke","white")
                            .attr("fill", function (d) { return colorScale(d.PoliticalParty)})
                            .attr("width", d => widthScale((d.Votes/sum)*100))
                            .attr("height", positionScale.bandwidth())
                            .attr("y", d => positionScale(d.PoliticalParty))
                
                /*cov
                  .data(selectedGroup)
                  
                  .transition()
                  .duration(1000)
                    .attr("cx", d => xScale(d.winning_percent))
                    .attr("cy", d => yScale(d.voter_turnup))*/
              }
            
              d3.select("#districtmp").on("change", function(event, d) {
                // recover the option that has been chosen
                let selectedOption = d3.select(this).property("value")
                district2 = d3.group(clients, d => d.District);
                let dat11 = district2.get(selectedOption)
                // run the updateChart function with this selected option
                console.log("h'"+dat11)
                update(dat11)
            })


    }

    
    function write(text){
        container.append("div").text(text)
    }
    function del_it(){
        container.selectAll("div").remove()
    }
