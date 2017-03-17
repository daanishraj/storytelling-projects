(function() {
    var margin = { top: 30, left: 30, right: 30, bottom: 30},
    height = 450 - margin.top - margin.bottom,
    width = 1080 - margin.left - margin.right;

  // What is this???
  var svg = d3.select("#chart-5")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var xPositionScale=d3.scalePoint().domain(["NYC", "Lima", "Tuscon", "Beijing", "Melbourne", "Stockholm"])
  .range([0, width]);      

var colorScale = d3.scaleLinear().domain([0, 100]).range(['lightblue', 'pink'])

  var radius=80

  var radiusScale=d3.scaleLinear()
  .domain([0,100]).range([30,radius]);

  var angleScale=d3.scalePoint()
  .domain(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 
    'Nov', 'Dec', "blah"]).range([0, Math.PI*2]);


  var radialArea=d3.radialArea()//// what is this doing exactly??
  .angle(function(d){
// if (!angleScale(d.month)) {
      // console.log(d.month);
    
    return angleScale(d.month);

  })
  .innerRadius(function(d) {
    return radiusScale(d.low);
  })
  .outerRadius(function(d) {
    return radiusScale(d.high);
  })





  d3.queue()
    .defer(d3.csv, "data/all-temps.csv")
    .await(ready)

  function ready(error, datapoints) {
    
    var nested=d3.nest()
    .key(function(d){
      return d.city;
    })
    .entries(datapoints)

    var charts = svg.selectAll(".pie-charts")
    .data(nested)
    .enter().append("g")
    .attr("transform", function(d){
      var yPos=200
      var xPos=xPositionScale(d.key);
      return "translate("+ xPos + "," + yPos + ")";
    })

    charts.each(function(d) {
      var pathData = d.values;///what's happening here?
      var g = d3.select(this);//what are we doing here?
      pathData.push(pathData[0])

      charts.append("text")// why are we not using the variable g instead of charts?
      .text(function (d) {
        return d.key;
      })
      .attr('y', 5)
      .style('text-anchor', 'middle');

      g.selectAll("circle")
      .data([0,30,60,90])
      .enter().append("circle")
      // .attr("cx", 0)
      // .attr("cy", 0)
      .attr("r", function(d){
        return radiusScale(d)///is this using the most recent data we entered?
      })
      .style("fill", "none")
      .style('stroke', 'black');

      g.append('path')
        .datum(pathData)
        .attr('d', radialArea)
        .style('fill', 'lightblue');      

    })

    //var g=svg.append("g").attr("transform", "translate(" + width/2 + "," + height/2 + ")");

    // datapoints.push(datapoints[0]); ///what is this??


    // charts.append("path")
    // .datum(datapoints)//when do we use datum as opposed to data?
    // .attr("d", radialArea)
    // .attr("stroke", "black")
    // .attr("stroke-width", 2)
    // .style("stroke", "none")
    // .style("fill", "pink");

    // charts.selectAll(".temps")
    // .data(datapoints)
    // .enter().append("text")
    // .attr("x", function(d){
    //   var a=angleScale(d.month)
    //   var r=radiusScale(d.high)
    //   return (r+10)*Math.sin(a);////whats happening here? isn't x axis cos and y axis sin?
    // })

    // .attr("y", function(d) {
    //     var a = angleScale(d.month);
    //     var r = radiusScale(d.high);
    //     return (r + 10) * Math.cos(a) * -1;
    //   })
      
    //   .attr("font-size", 12)
    //   .attr("text-anchor", "middle")
    //   .attr("alignment-baseline", "middle")
    //   .text(function(d){
    //     return d.high;
    //   })

      // charts.selectAll(".month-line")
      // .data(datapoints)
      // .enter().append("line")
      // .attr("x0", 0)///x0?
      // .attr("y0", 0)
      // .attr("x1",function(d){
      //   var a=angleScale(d.month);
      //   return radius*Math.sin(a);
      // })
      // .attr("y1", function(d){
      //   var a =angleScale(d.month);
      //   return radius*Math.cos(a)*-1; //why the -1?
      // })
      // .attr("stroke", "lightgray")

      // charts.selectAll(".months")
      // .data(datapoints)
      // .enter().append("text")
      // .attr("x", function(d){
      // var a=angleScale(d.month);
      // return (radius+ 30)*Math.sin(a);
      // })

      // .attr("y", function(d) {
      //   var a = angleScale(d.month);
      //   return (radius + 30) * Math.cos(a) * -1;
      // })
      // .attr("font-size", 12)
      // .attr("text-anchor", "middle")
      // .attr("alignment-baseline", "middle")
      // .text(function(d) {
      //   return d.month;
      // })











  }
})();