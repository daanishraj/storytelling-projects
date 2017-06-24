(function() {
    var margin = { top: 50, left: 85, right: 50, bottom: 50},
    height = 700 - margin.top - margin.bottom,
    width = 1020 - margin.left - margin.right;

  var svg = d3.select("#bubble-grid")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //creating defs
  var defs = svg.append("defs")


  var yPositionScale = d3.scalePoint().domain(['Peter','Joe','Judy','Tony','Karl','Mia','Juliet','Jack','Aurelia','Mark','Billy','Natalie','Sarah','Sam','Colin','Karen','Jamie','Daniel','Harry','PM'])
  .range([height,0]).padding(2);
  var xPositionScale = d3.scaleLinear().range([0,width]);
  //can color by gender
  // var colorScale = d3.scaleOrdinal().domain(['m','f']).range(['#fdbb84','#e34a33']);
  var radiusScale = d3.scaleSqrt().domain([0,25]).range([0,25]);

  // gridlines in x axis function
  function make_x_gridlines(n) {
      return d3.axisBottom(xPositionScale)
          .ticks(80)
  }

  // gridlines in y axis function
  function make_y_gridlines(n) {
      return d3.axisLeft(yPositionScale)
          .ticks(2)
  }


  //gradients
  var grad1 = svg.append("defs").append("linearGradient").attr("id", "grad1")
              .attr("x1", "0%").attr("x2", "0%").attr("y1", "100%").attr("y2", "0%");
  grad1.append("stop").attr("offset", "50%").style("stop-color", "#ffffff");
  grad1.append("stop").attr("offset", "50%").style("stop-color", "#b61210");

  var grad2 = svg.append("defs").append("linearGradient").attr("id", "grad2")
              .attr("x1", "0%").attr("x2", "0%").attr("y1", "100%").attr("y2", "0%");
  grad2.append("stop").attr("offset", "50%").style("stop-color", "#ffffff");
  grad2.append("stop").attr("offset", "50%").style("stop-color", "#fc9272");

  var grad3 = svg.append("defs").append("linearGradient").attr("id", "grad3")
              .attr("x1", "0%").attr("x2", "0%").attr("y1", "100%").attr("y2", "0%");
  grad3.append("stop").attr("offset", "50%").style("stop-color", "#ffffff");
  grad3.append("stop").attr("offset", "50%").style("stop-color", "black");


  d3.queue()
    .defer(d3.csv, "speaker_lines.csv")
    .defer(d3.json, "interactions.json")
    .await(ready)

  function ready(error, datapoints, graph) {


    //creating pattern
    defs.selectAll(".character-pattern")
      .data(graph.nodes)
      .enter().append("pattern")
      .attr("class", "character-pattern")
      .attr("id", function(d) {
        return d.character.split(' ')[0].toLowerCase()
      })
      .attr("height", "100%")
      .attr("width", "100%")
      .attr("patternContentUnits", "objectBoundingBox")
      .append("image")
      .attr("height", 1)
      .attr("width", 1)
      .attr("preserveAspectRatio", "none")
      .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
      .attr("xlink:href", function(d) {
        return "images/" + d.character.split(' ')[0].toLowerCase() + ".jpg"
      })



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

        //  svg.append("text")
        //    .attr("class","justtext")
        //    .attr("transform", "rotate(-90)")
        //    .attr("y", 6)
        //    .attr("dy", ".71em")
        //    .style("text-anchor", "end")
        //    .text("Characters");

//getting data
    var sorted = datapoints.sort(function(a,b){
      return b.lines - a.lines;
    });

//extra variables to track choices
    var flagm = 0;
    var flagf = 0;
    var flaga = 1;
    var n = 80;

//creating tooltip
  var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  function drawXgrid(){
  // add the X gridlines
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_gridlines(n)
            .tickSize(-height)
            .tickFormat("")
        )
      }

    function drawYgrid(){

      // add the Y gridlines
      svg.append("g")
          .attr("class", "grid2")
          .call(make_y_gridlines(20)
              .tickSize(-width)
              .tickFormat("")
          )
    }

    drawXgrid();
    drawYgrid();

// function for drawing circles

function drawCircles(scene){

  // console.log(scene);
  var newpoints = sorted.filter( function(d) {

    if (flaga == 0){

    if (flagm) { return +d.scene>=1 & +d.scene<scene & d.gender == 'm';}
    if(flagf) { return +d.scene>=1 & +d.scene<scene & d.gender == 'f';}

    }

    else { return +d.scene>=1 & +d.scene<scene; }

  });

  xPositionScale.domain([1,scene]);

  svg.selectAll(".character")
  .remove();

  svg.selectAll(".character")
    .data(newpoints)
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

    .attr("fill",function(d){
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

      if(flagm ==1 & d.gender=='m') { divturner(d);}
      if(flagf == 1 & d.gender=='f') {divturner(d)}
      if (flaga==1) {divturner(d)}

      function divturner(d){
      div.transition()
          .duration(200)
          .style("opacity", .9);
      div.html("Character: " + d.speaker + "<br>Actor: " + d.actor + "<br>Lines: "  + d.lines + "<br>Scene#: "  + d.scene )
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");}
       })

     .on("mouseout", function(d) {

       d3.select(this).attr("stroke","white");
         div.transition()
             .duration(500)
             .style("opacity", 0);
     })

     svg.select(".x-axis")
     .transition()
     .call(xAxis);

   }
     drawCircles(n);


//gender selection
     d3.select('#a').on('click', function(d) {


     flaga = 1; flagm = 0; flagf = 0;

     drawCircles(n);
     d3.selectAll(".character")
       .attr("opacity", 0.8)




     });
     d3.select('#m').on('click',function(d) { flagm = 1; flagf = 0; flaga = 0; turn_gender("m"); });
     d3.select('#f').on('click', function(d) { flagf = 1; flagm = 0; flaga = 0; turn_gender("f"); });


     function turn_gender(s){

       drawCircles(n);
       d3.selectAll(".character")
       .attr("opacity", function(d){
         if (s == d.gender) { return 0.8;}
         else { return 0;}
       })



     }

//code for slider
     d3.select("#nRadius").on("input", function() {
       update(+this.value);
     });

// update the elements
    function update(nRadius) {

      // adjust the text on the range slider
      d3.select("#nRadius-value").text(nRadius);
      d3.select("#nRadius").property("value", nRadius);

      // update the circle radius
      // d3.selectAll("circle")
      //   .attr("r", nRadius);
      n = nRadius;

      // xPositionScale.domain([1,n]);
      // drawXgrid();
      // drawYgrid();

      drawCircles(n);

    }

    //images
    svg.selectAll(".artist")
      .data(graph.nodes)
      .enter().append("circle")
      .attr("class", "artist")
      .attr("r", 10)
      .attr("fill", function(d) {
        return "url(#" + d.character.split(' ')[0].toLowerCase() + ")"
      })
      .attr('stroke', '#bbbbbb')
      .attr('stroke-width', '1px')
      .attr('cx',-75)
      .attr('cy',
      function(d){
        return yPositionScale(d.character.split(' ')[0]);
      }
    )
      .call(draggable)


  }

  //end of function ready
})();
