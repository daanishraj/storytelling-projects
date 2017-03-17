(function() {
    var margin = { top: 30, left: 30, right: 30, bottom: 30},
    height = 400 - margin.top - margin.bottom,
    width = 1080 - margin.left - margin.right;

  // What is this???
  var svg = d3.select("#chart-3b")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var cityNames = ['NYC', 'Tuscon', 'Lima', 'Beijing', 'Melbourne', 'Stockholm'];


  d3.queue()
    .defer(d3.csv, "data/all-temps.csv")
    .await(ready)

  function ready(error, datapoints) {

  }
})();