(function() {
	var margin = { top: 30, left: 30, right: 30, bottom: 30},
	height = 400 - margin.top - margin.bottom,
	width = 960 - margin.left - margin.right;

	

	var svg = d3.select("#line-graph")
				.append("svg")
				.attr("height", height + margin.top + margin.bottom)
				.attr("width", width + margin.left + margin.right)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Create your scales
	// var colorScale = d3.scaleOrdinal().domain(["Australia", "Korea", "Estonia", 
	// 	"Indonesia", "Colombia"]).range(["purple", "green", "orange", "red", "yellow"]);

	var xPositionScale=d3.scalePoint().domain([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,
 		27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,77,78,79]).range([0, width])
	.padding(2)

	
    
	var yPositionScale=d3.scaleLinear().range([height, 0]);

	// Create a d3.line function
	var line=d3.line()
	.x(function(d){
		return xPositionScale(d.scene)
	})
	.y(function(d){
		return yPositionScale(d.num_character)
	})

	// Import your data file using d3.queue()

	d3.queue()
	.defer(d3.csv, "data.csv")
	.await(ready);


	
	// Fix up the function definition! It doesn't just get an error...
	function ready(error, datapoints) {

	var minValue = d3.min(datapoints, function(d) { return +d.num_character });
    var maxValue = d3.max(datapoints, function(d) { return +d.num_character });
    yPositionScale.domain([minValue, maxValue]);



		// Draw your dots
		svg.selectAll(".character-circles")
		.data(datapoints)
		.enter().append("circle")
		.attr("class", "character-circles")
		.attr("r", 2)
		.attr("fill", "red")
		.attr("cx", function(d){
			return xPositionScale(d.scene)
		})
		.attr("cy", function(d){
			return yPositionScale(d.num_character)
		})

		// You have many, many datapoints but only need a few lines...
		// how do you group them together?


	svg.append("path")
    .datum(datapoints)
    .attr("d", line)
    .attr("stroke", "green")
    .attr("fill", "none")
    .attr("stroke-width", 2)




		// Add your axes

	var xAxis = d3.axisBottom(xPositionScale)
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);

	}


// how do I label my axes?
// too many values very close to each other on x axis




})();