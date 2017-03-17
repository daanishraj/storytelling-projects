(function() {
    var margin = { top: 30, left: 30, right: 30, bottom: 30},
    height = 400 - margin.top - margin.bottom,
    width = 780 - margin.left - margin.right;

  // What is this???
  var svg = d3.select("#chart-3")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var colorScale=d3.scaleLinear().range(["lightblue", "pink"]);
  colorScale.domain([0,100]);

    var radius=100
      var radiusScale=d3.scaleLinear().domain([0,100]).range([0,radius])


    var wedgeValue=1/12;


    var arc=d3.arc()
    .outerRadius(function(d){
      return radiusScale(d.data.high)
    })
    .innerRadius(0);

    var labelArc=d3.arc()
    .outerRadius(radius+10)
    .innerRadius(radius+10);

    var pie=d3.pie()
    .value(wedgeValue)
      //return wedgeValue;
    .sort(null)//// What does this do?
           
  
  d3.queue()
    .defer(d3.csv, "data/ny-temps.csv")
    .await(ready)

  function ready(error, datapoints) {
    pieHolder=svg.append("g").attr("transform", "translate(100,200)");

    var g=pieHolder.selectAll(".arc")
    .data(pie(datapoints))
    .enter().append("g")
    .attr("class", "arc")

    //// How do i vary the outer radius?!!!
    g.append("path")
    .attr("d", arc)
    .style("fill", function(d){
      //console.log(d)
      return colorScale(d.data.high)
    })

    // g.append("text")
    // .attr("transform", function(d){
    //   return "translate("+ labelArc.centroid(d) + ")";///What does labelArc.centroid do?

    // })
    // // .attr("text-anchor", function(d){ ///What is happening here?????
    //   if (d.startAngle + d.endAngle/2<Math.PI)
    //   {
    //     return 'start';
    //   }
    //   else{
    //     return 'end';
    //   }
    // })
    // 
    //.text(function(d){
      //return d.data.month;
    



  }




})();