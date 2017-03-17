(function() {
    var margin = { top: 30, left: 30, right: 30, bottom: 30},
    height = 400 - margin.top - margin.bottom,
    width = 780 - margin.left - margin.right;

  // What is this???
  var svg = d3.select("#chart-1")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 //var colorScale=d3.scaleOrdinal().range(['orange', 'blue', 'green'])
 var colorScale=d3.scaleOrdinal(d3.schemeCategory10);


    var radius=100

    var arc=d3.arc()
    .outerRadius(radius)
    .innerRadius(0);

    var labelArc=d3.arc()
    .outerRadius(radius+10)
    .innerRadius(radius+10);

    var pie=d3.pie()
    .value(function(d){
      return d.minutes;
    })
    .sort(null)
           


  d3.queue()
    .defer(d3.csv, "data/time-breakdown.csv")
    .await(ready)



  function ready(error, datapoints) {
    pieHolder=svg.append("g").attr("transform", "translate(" + width / 2 + ',' + height / 2 + ')');

    var g=pieHolder.selectAll(".arc")
    .data(pie(datapoints))
    .enter().append("g");


    g.append("path")
    .attr("d", arc)
    .attr("fill", function(d){
      return colorScale(d.data.task)///Why d.data.task and not d.task?
    })

    g.append("text")
    .attr("transform", function(d){
      return "translate("+ labelArc.centroid(d) + ")";///What does labelArc.centroid do?

    })
    .attr("text-anchor", function(d){ ///What is happening here?????
      if (d.startAngle + d.endAngle/2<Math.PI)
      {
        return 'start';
      }
      else{
        return 'end';
      }
    })
    .text(function(d){
      return d.data.task;
    })



  }
})();



