(function() {
    var margin = { top: 30, left: 30, right: 30, bottom: 30},
    height = 400 - margin.top - margin.bottom,
    width = 1200 - margin.left - margin.right;

  // What is this???
  var svg = d3.select("#chart-1")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var radius = 70;

  var radiusScale=d3.scaleLinear().domain([23,70])
  .range([0, radius]);

  var xPositionScale=d3.scalePoint()
  .domain(["Virat Kohli", "Sachin Tendulkar", "IVA Richards",
    "MS Dhoni", "AB De Villiers"])
  .range([0, width]).padding(0.5)


  var angleScale=d3.scalePoint()
  .domain(["Overall", "Home", "Away", "Batting First", "Chasing",
"Wins", "Finals", "blah"])
  .range([0, Math.PI*2]);

  var colorScale=d3.scaleLinear()
  .domain([0,100]).range(["pink", "red"]);


  var radialLine=d3.radialLine()
  .angle(function(d){
    return angleScale(d.category)
  })
  .radius(function(d){
    return radiusScale(d.average)
  })

d3.queue()
.defer(d3.csv, "cricket.csv")
.await(ready)

function ready(error, datapoints) {
  
var nested=d3.nest()
.key(function(d){
  return d.player
})
.entries(datapoints)

var charts=svg.selectAll(".radial-charts")
.data(nested)
.enter().append("g")
.attr("transform", function(d){
  var yPos=100
  var xPos=xPositionScale(d.key)
  return "translate(" + xPos + "," + yPos + ")"
})

charts.each(function(d){
  var pathData=d.values
  var g=d3.select(this)
  pathData.push(pathData[0])

  
g.selectAll(".category-line")
      .data(d.values)
      .enter().append("line")
      .attr("x0", 0)
      .attr("y0", 0)
      .attr("x1", function(d) {
        var a = angleScale(d.category);
        return radius * Math.sin(a);
      })
      .attr("y1", function(d) {
        var a = angleScale(d.category);/// we had month and high above. but why month appears twice here?
        return radius * Math.cos(a) * -1;
      })
      .attr("stroke", "lightgrey")




  g.append("text")
      .text(function (d) {
        return d.key;
      })
      .attr('y', radius + 75)
      .style('text-anchor', 'middle')




      g.selectAll("circle")
      .data([0, 10, 20, 30, 40, 50, 60, 70])
      .enter().append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", function(d) {
        return radiusScale(d)
      })
      .attr("fill", "none")
      .attr("stroke", function(d) {
        return colorScale(d)
      })

      g.append("path")
      .datum(d.values)
      .attr("d", radialLine)
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("fill", "grey")
      .attr("opacity", 0.5)

      g.selectAll(".avgs")
      .data(d.values)
      .enter().append("text")
      .attr("x", function(d) {
        var a = angleScale(d.category);
        var r = radiusScale(d.average);
        return (r + 10) * Math.sin(a);
      })
      .attr("y", function(d) {
        var a = angleScale(d.category);
        var r = radiusScale(d.average);
        return (r + 10) * Math.cos(a) * -1;
      })
      .attr("font-size", 8)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("fill", "black")
      .text(function(d) {
        return d.average;
      })

      
      g.selectAll(".categories")
      .data(d.values)
      .enter().append("text")
      .attr("x", function(d) {
        var a = angleScale(d.category);
        return (radius + 30) * Math.sin(a);///isn't cos theta the the polar coordinate for x? also
        //how is this working exactly?
      })
      .attr("y", function(d) {
        var a = angleScale(d.category);
        return (radius + 30) * Math.cos(a) * -1;
      })
      .attr("font-size", 10)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .text(function(d) {
        return d.category;
      })


})
















/*

  var g=svg.append("g").attr("transform", "translate")

  var nested=d3.nest()
  .key(function(d){
    return d.player
  })
  .entries(datapoints)

  var charts=svg.selectAll(".radial-charts")
  .data(nested)
  .enter().append("g")
  .attr("transform", function(d){
    var yPos=200
    var xPos=xPositionScale(d.key);
    return "translate(" + xPos + "," + yPos + ")"
  })

  charts.each(function(d){
    var pathData=d.values
    var g=d3.select(this)
    pathData.push(pathData[0])

    charts.append("text")
    .text(function(d){
      return d.key
    })
    .attr('y', 5)
    .style('text-anchor', 'middle');

    g.selectAll("circle")
    .data([0,10,20,30,40,50,60,70,80])
    .enter().append("circle")
    .attr("r", function(d){
      return radiusScale(d)
    })
    .style("fill", "none")
    .style("stroke", function(d){
      return colorScale(d)
    })

    g.append("path")
      .datum(datapoints)
      .attr("d", radialLine)
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("fill", "none");

    g.selectAll(".average")
      .data(datapoints)
      .enter().append("text")
      .attr("x", function(d) {
        var a = angleScale(d.player);
        var r = radiusScale(d.average);
        return (r + 10) * Math.sin(a);
      })
      .attr("y", function(d) {
        var a = angleScale(d.player);
        var r = radiusScale(d.average);
        return (r + 10) * Math.cos(a) * -1;
      })
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .text(function(d) {
        return d.average;
      })

    g.selectAll(".player-line")
      .data(datapoints)
      .enter().append("line")
      .attr("x0", 0)
      .attr("y0", 0)
      .attr("x1", function(d) {
        var a = angleScale(d.player);
        return radius * Math.sin(a);
      })
      .attr("y1", function(d) {
        var a = angleScale(d.player);
        return radius * Math.cos(a) * -1;
      })
      .attr("stroke", "lightgray")

    g.selectAll(".player")
      .data(datapoints)
      .enter().append("text")
      .attr("x", function(d) {
        var a = angleScale(d.player);
        return (radius + 30) * Math.sin(a);
      })
      .attr("y", function(d) {
        var a = angleScale(d.player);
        return (radius + 30) * Math.cos(a) * -1;
      })
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .text(function(d) {
        return d.player;
      })





  })

*/

}
})();









