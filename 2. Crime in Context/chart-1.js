(function() {
    var margin = { top: 50, left: 50, right: 50, bottom: 50},
    height = 600 - margin.top - margin.bottom,
    width = 960 - margin.left - margin.right;

  // What is this???
  var svg = d3.select("#chart-1")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  
//Making the scales
  
  //var xPositionScale=d3.scalePoint().domain([1975, 2015]).range([0, width])
  var yPositionScale=d3.scaleLinear().domain([0,4500]).range([height, 0]);
  var xPositionScale=d3.scaleLinear().domain([1975, 2015]).range([0, width])

  // var xPositionScale = d3.scaleLinear().domain([0,100000]).range([0, width]);
  // var yPositionScale = d3.scaleLinear().domain([0,100]).range([height, 0]);

  d3.queue()
    .defer(d3.csv, "ucr_crime_1975_2015.csv")
    .await(ready)

  function ready(error, datapoints) {
    // now want to make a line graph for each police department

    
  var goodDataPoints = datapoints.filter(function(d) { 
  return d.violent_per_100k != 'NA' && d.department_name != "National"
})


    var line=d3.line()
    .x(function(d){
      return xPositionScale(d.year)
    })
    .y(function(d){
      return yPositionScale(d.violent_per_100k)
    })

    var nested=d3.nest()
    .key(function(d){
      return d.department_name
    })
    .entries(goodDataPoints)

    svg.selectAll("path")
    .data(nested)
    .enter().append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "grey")
    .attr("d",function(d){
      return line(d.values)
    })
    .attr("stroke-width", 2)
    .on("mouseover", function(d){
    svg.selectAll("line")
    .attr("stroke", "grey")
    var thisLine=d3.select(this)
    thisLine.attr("stroke", "red")
    })
          
    
    
     
////Bisector stuff

      var tooltip = svg.append("g")
      .attr("class", "tip")
      .style("display", "none");


      tooltip.append("circle")
      .attr("r", 3);

      tooltip.append("text")
      .attr("dx", 5)
      .attr("dy", 15);

      svg.append("rect")
      .attr("fill", "none")
      .style("pointer-events", "all")
      .attr("width", width)
      .attr("height", height)
      .on("mousemove", function(d) {

        var mouse = d3.mouse(this);
        console.log(mouse);
        var mousePositionX = mouse[0];
        console.log(mousePositionX);

        var mouseYear = xPositionScale.invert(mousePositionX);
        var closeDatapoints = nested.map(function(d) {
        var index = d3.bisector(function(d) { 
          return d.year; 
        })
        .left(d.values, mouseYear);
          return d.values[index];
        })

        var mousePositionY = mouse[1];
        var mouseCrimes = yPositionScale.invert(mousePositionY);

        var sorted = closeDatapoints.sort(function(a,b) {
          return a.violent_per_100k - b.violent_per_100k;
        })

         var index = d3.bisector(function(d) { 
          return d.violent_per_100k; 
        })
          .left(sorted, mouseCrimes);

          var d = sorted[index];
          if(!d) {
          d = sorted[index - 1];
        }

        var xPos = xPositionScale(d.year);
        var yPos = yPositionScale(d.violent_per_100k);
        d3.select(".tip")
        .attr("transform", "translate(" + xPos + "," + yPos + ")");

        d3.select(".tip").select("text").text(d.department_name + " " + d.year + ":" + " " + d.violent_per_100k)


      })


        .on("mouseout", function(d){
        svg.select(".tip").style("display", "none")        
        
        })

        .on("mouseover", function(d){
          svg.select(".tip").style("display", null)
          svg.selectAll(".line")
          .attr("stroke", "grey")
          var thisLine=d3.select(this)
          thisLine.attr("stroke", "red")
          
        })
      







  //    bisectYear = d3.bisector(function(d) { return d.year; }).left
  //    formatValue = d3.format(",.2f"),
  //    formatCurrency = function(d) { return formatValue(d); };

  //   var focus = svg.append("g")
  //     .attr("class", "focus")
  //     .style("display", "none")


  //     focus.append("text")
  //     .attr("x", 9)
  //     .attr("dy", ".35em");

  //     function mousemove() {
  //   var x0 = xPositionScale.invert(d3.mouse(this)[0]),
  //       i = bisectYear(goodDataPoints, x0, 1),
  //       d0 = goodDataPoints[i - 1],
  //       d1 = goodDataPoints[i],
  //       d = x0 - d0.year > d1.year - x0 ? d1 : d0;
  //   focus.attr("transform", "translate(" + xPositionScale(d.year) + "," + yPositionScale(d.violent_per_100k) + ")");
  //   focus.select("text").text(formatCurrency(d.violent_per_100k));
  // }




///Selecting the nyc crime button

 var newDataPoints = datapoints.filter(function(d) { 
  return d.homs_sum != 'NA' && d.year>=1990 && d.department_name != "National"
})

console.log(newDataPoints);

// var nycDataPoints=goodDataPoints.filter(function(d){
//         return d.department_name=="New York City"
//        })



d3.select("#nycCrime").on("click", function(d){

      d3.select(this).style("opacity", 0.5)
      var maxY=d3.max(newDataPoints,function(d){
          return +d.homs_sum
  })
        var minY=d3.min(newDataPoints, function(d){
          return +d.homs_sum
        })

      yPositionScale.domain([minY, maxY])
      xPositionScale.domain([1990,2014])


// now drawing line graphs for homicide

/// we need to nest again using the filtered dataset
var nested=d3.nest()
    .key(function(d){
      return d.department_name
    })
    .entries(newDataPoints)

    var line=d3.line()
    .x(function(d){
      return xPositionScale(d.year)
    })
    .y(function(d){
      return yPositionScale(d.homs_sum)
    })

    for (prop in yPositionScale) {
      if (typeof prop === 'function') {
        console.log(prop())
      }
    }

 d3.select("#yAxisLabel")
    .style("display", "block")
    .style("top", (yPositionScale.range()[1]  + 20) + 'px')
    .style("left", (xPositionScale.range()[0] + 50) + 'px')


 svg.selectAll(".line")
    .data(nested)
    // .enter().append("path")
    // .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "grey")
    .transition()
    .attr("d",function(d){
      return line(d.values)
    })
    .attr("stroke-width", 2)
    .attr("stroke", function(d){
      if (d.key=="New York City"){
        return "red"
      } else {
        return "grey"
      }
      
    })
    
     d3.select(".x-axis")
    .transition()
    .call(xAxis)


    d3.select(".y-axis")
    .transition()
    .call(yAxis)

})




    // .on("mouseover", function(){
    //       svg.selectAll("path")
    //       .attr("stroke", "grey")
    //       var thisLine=d3.select(this)
    //       thisLine.attr("stroke", "red")
    //       .text(function(d){
    //         return d.department_name
    //       })
    //     })


      // var nycLine=d3.filter(function(d){
      //   return d.department_name=="New York City"
      // })
      // svg.selectAll("path")
      // .attr("stroke", "grey")
      // .






    // svg.selectAll("circle")
    //   .data(datapoints)
    //   .enter().append("circle")
    //   .attr("r", 6)
    //   .attr("cx", function(d) {
    //     return xPositionScale(d.GDP_per_capita)
    //   })
    //   .attr("cy", function(d) {
    //     return yPositionScale(d.life_expectancy)
    //   })
    //   .on("mouseover", function(){
    //     console.log();
    //     var circle=d3.select(this)
    //     circle.attr("fill", "lightblue")

    //   })




    var xAxis = d3.axisBottom(xPositionScale);
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + (height) + ")")
      .call(xAxis);

    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);

  }
})();