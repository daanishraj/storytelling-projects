(function() {
    var margin = { top: 50, left: 50, right: 50, bottom: 50},
    height = 800 - margin.top - margin.bottom,
    width = 960 - margin.left - margin.right;

  var svg = d3.select("#bubble-grid")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var yPositionScale = d3.scalePoint().domain(['Aurelia','Billy','Colin','Daniel','Harry','Jack','Jamie','Joe','Judy','Juliet','Karen','Karl','Mark','Mia','Natalie','Peter','PM','Sam','Sarah','Tony'])
  .range([height,0]).padding(2);
  var xPositionScale = d3.scaleLinear().domain([1,80]).range([0,width]);
  //can color by gender
  // var colorScale = d3.scaleOrdinal().domain(['m','f']).range(['#fdbb84','#e34a33']);
  var radiusScale = d3.scaleSqrt().domain([0,25]).range([0,36]);

  // gridlines in x axis function
  function make_x_gridlines() {
      return d3.axisBottom(xPositionScale)
          .ticks(80)
  }

  // gridlines in y axis function
  function make_y_gridlines() {
      return d3.axisLeft(yPositionScale)
          .ticks(2)
  }


  //gradients
  var grad1 = svg.append("defs").append("linearGradient").attr("id", "grad1")
              .attr("x1", "0%").attr("x2", "0%").attr("y1", "100%").attr("y2", "0%");
  grad1.append("stop").attr("offset", "50%").style("stop-color", "#ffffff");
  grad1.append("stop").attr("offset", "50%").style("stop-color", "#fdbb84");

  var grad2 = svg.append("defs").append("linearGradient").attr("id", "grad2")
              .attr("x1", "0%").attr("x2", "0%").attr("y1", "100%").attr("y2", "0%");
  grad2.append("stop").attr("offset", "50%").style("stop-color", "#ffffff");
  grad2.append("stop").attr("offset", "50%").style("stop-color", '#e34a33');

  var grad3 = svg.append("defs").append("linearGradient").attr("id", "grad3")
              .attr("x1", "0%").attr("x2", "0%").attr("y1", "100%").attr("y2", "0%");
  grad3.append("stop").attr("offset", "50%").style("stop-color", "#ffffff");
  grad3.append("stop").attr("offset", "50%").style("stop-color", "black");


  d3.queue()
    .defer(d3.csv, "speaker_lines.csv")
    .await(ready)

  function ready(error, datapoints) {

    var sorted = datapoints.sort(function(a,b){
      return b.lines - a.lines;
    });


//creating tooltip
  var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);


  // add the X gridlines
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_gridlines()
            .tickSize(-height)
            .tickFormat("")
        )

    // add the Y gridlines
    svg.append("g")
        .attr("class", "grid")
        .call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat("")
        )

  drawCircles();

  // function for drawing circles

  function drawCircles(){

    svg.selectAll("circle")
    .remove();

    svg.selectAll("circle")
      .data(sorted)
      .enter().append("circle")
      .attr("class","character")
      .attr("r", function(d){
        return radiusScale(d.lines)
      })
      .attr("cx", function(d) {
        return xPositionScale(d.scene)
      })
      .attr("cy", function(d) {
        return yPositionScale(d.speaker)
      })
      .attr("fill",
      function(d){
        if (d.gender == 'm') { return "url(#grad1)"}
        else { return ("url(#grad2)")}

        // return colorScale(d.gender);
      }
    )

      .attr("stroke-width", 2.5)
      .attr("stroke", "white")
      .attr("opacity", 0.7)


      .on("mouseover", function(d) {

        d3.select(this).attr("stroke","url(#grad3)");

         div.transition()
             .duration(200)
             .style("opacity", .9);
         div.html("Character: " + d.speaker + "<br>Actor: " + d.actor + "<br>Lines: "  + d.lines + "<br>Scene#: "  + d.scene )
             .style("left", (d3.event.pageX) + "px")
             .style("top", (d3.event.pageY - 28) + "px");
         })
       .on("mouseout", function(d) {

         d3.select(this).attr("stroke","white");
           div.transition()
               .duration(500)
               .style("opacity", 0);
       })


     }




//code for drawing axes
     var xAxis = d3.axisBottom(xPositionScale)
     .ticks(20);
     svg.append("g")
       .attr("class", "x-axis")
       .attr("transform", "translate(0," + (height) + ")")
       .call(xAxis);

     svg.append("text")
     .attr("x",width/2)
     .attr("y",height+45)
     .style("text-anchor", "end")
     .text("Scene#")


     var yAxis = d3.axisLeft(yPositionScale);
     svg.append("g")
       .attr("class", "y-axis")
       .call(yAxis)

     svg.append("text")
       .attr("class","justtext")
       .attr("transform", "rotate(-90)")
       .attr("y", 6)
       .attr("dy", ".71em")
       .style("text-anchor", "end")
       .text("Characters");

  }

  //end of function ready
})();
