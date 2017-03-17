(function() {
    var margin = { top: 30, left: 30, right: 30, bottom: 30},
    height = 400 - margin.top - margin.bottom,
    width = 780 - margin.left - margin.right;

  // What is this???
  var svg = d3.select("#chart-4")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // since you probably don't want to type them, 
  // and i won't make you use .map later, the months are
  // 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'

  var colorScale = d3.scaleLinear().domain([0, 100]).range(['lightblue', 'pink'])

  var radius=100

  var radiusScale=d3.scaleLinear()
  .domain([0,100]).range([0,radius]);

  var angleScale=d3.scalePoint()
  .domain(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 
    'Nov', 'Dec', 'Blah']).range([0, Math.PI*2]);


  var radialArea=d3.radialArea()//// what is this doing exactly??
  .angle(function(d){
    if (!angleScale(d.month)) {
      // console.log(d.month);
    }
    return angleScale(d.month);

  })
  .innerRadius(function(d) {
    return radiusScale(d.low);
  })
  .outerRadius(function(d) {
    return radiusScale(d.high);
  })


  d3.queue()
    .defer(d3.csv, "data/ny-temps.csv")
    .await(ready)

  function ready(error, datapoints) {

    var g=svg.append("g").attr("transform", "translate(" + width/2 + "," + height/2 + ")");

    datapoints.push(datapoints[0]); ///what is this??

    g.selectAll("circle")
    .data([0,10,20,30,40,50,60,70,80,90,100])
    .enter().append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", function(d){
      return radiusScale(d)///is this using the most recent data we entered?
    })

    .style("fill", "none")
    .attr("stroke", function(d){
      return colorScale(d)
    })

    g.append("path")
    .datum(datapoints)//when do we use datum as opposed to data?
    .attr("d", radialArea)
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .style("stroke", "none")
    .style("fill", "pink");

    g.selectAll(".temps")
    .data(datapoints)
    .enter().append("text")
    .attr("x", function(d){
      var a=angleScale(d.month)
      var r=radiusScale(d.high)
      return (r+10)*Math.sin(a);////whats happening here? isn't x axis cos and y axis sin?
    })

    .attr("y", function(d) {
        var a = angleScale(d.month);
        var r = radiusScale(d.high);
        return (r + 10) * Math.cos(a) * -1;
      })
      
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .text(function(d){
        return d.high;
      })

      g.selectAll(".month-line")
      .data(datapoints)
      .enter().append("line")
      .attr("x0", 0)///x0?
      .attr("y0", 0)
      .attr("x1",function(d){
        var a=angleScale(d.month);
        return radius*Math.sin(a);
      })
      .attr("y1", function(d){
        var a =angleScale(d.month);
        return radius*Math.cos(a)*-1; //why the -1?
      })
      .attr("stroke", "lightgray")

      g.selectAll(".months")
      .data(datapoints)
      .enter().append("text")
      .attr("x", function(d){
      var a=angleScale(d.month);
      return (radius+ 30)*Math.sin(a);
      })

      .attr("y", function(d) {
        var a = angleScale(d.month);
        return (radius + 30) * Math.cos(a) * -1;
      })
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .text(function(d) {
        return d.month;
      })









  }
})();