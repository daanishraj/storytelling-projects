(function() {
	var margin = { top: 30, left: 40, right: 90, bottom: 50},
	height = 400 - margin.top - margin.bottom,
	width = 1000 - margin.left - margin.right;



	var svg = d3.select("#line-graph")
				.append("svg")
				.attr("height", height + margin.top + margin.bottom)
				.attr("width", width + margin.left + margin.right)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var xPositionScale=d3.scalePoint().domain([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,
 		27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,77,78,79]).range([0, width])
	.padding(2)



	var yPositionScale=d3.scaleLinear().range([height, 0]);

	// Create a d3.line function
	var line1=d3.line()
	.x(function(d){
		return xPositionScale(d.scene)
	})
	.y(function(d){
		return yPositionScale(d.num_character)
	})
	.curve(d3.curveStepBefore)


	var line2=d3.line()
	.x(function(d){
		return xPositionScale(d.scene)
	})
	.y(function(d){
		return yPositionScale(d.num_lines)
	})
	.curve(d3.curveStep)


	// Import your data file using d3.queue()

	d3.queue()
	.defer(d3.csv, "data.csv")
	.await(ready);



	// Fix up the function definition! It doesn't just get an error...
	function ready(error, datapoints) {

	var minValue = d3.min(datapoints, function(d) { return +d.num_lines });
    var maxValue = d3.max(datapoints, function(d) { return +d.num_lines });
    yPositionScale.domain([minValue, maxValue]);

	svg.append("path")
    .datum(datapoints)
    .attr("d", line1)
    .attr("stroke", "black")
    .attr("fill", "none")
    .attr("stroke-width", 2)

    svg.append("path")
    .datum(datapoints)
    .attr("d", line2)
    .attr("stroke", "#b61210")
    .attr("fill", "none")
    .attr("stroke-width", 2)

     svg.append("text")
      .attr("class", "xAxislabel")
      .attr("y", height)
      .attr("x", width/2.5)
      .text("Scene #")
      .attr("dy", 35)
      .attr("dx", 0)
      .attr("fill", "black")
      .attr("font-size", 18)

      svg.selectAll(".line1label")
      .data(datapoints.filter(function(d){
      	return d.scene==79
      }))
      .enter().append("text")
      .attr("class", "line1label")

      .attr("y", function(d){

      	return yPositionScale(d.num_character)
      })
      .attr("x", function(d){
      		return xPositionScale(d.scene)

      })
      .text("# Characters")
      .attr("dy", 0)
      .attr("dx", 5)
      .attr("fill", "black")
      .attr("font-size", 8)


      svg.selectAll(".line2label")
      .data(datapoints.filter(function(d){
      	return d.scene==79
      }))
      .enter().append("text")
      .attr("class", "line2label")

      .attr("y", function(d){

      	return yPositionScale(d.num_lines)
      })
      .attr("x", function(d){
      		return xPositionScale(d.scene)

      })

      .text("# Lines")
      .attr("dy", 0)
      .attr("dx", 5)
      .attr("fill", "black")
      .attr("font-size", 8)

	// Add your axes

	var xAxis = d3.axisBottom(xPositionScale)
    .tickValues([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 79]);
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);

	}




})();
