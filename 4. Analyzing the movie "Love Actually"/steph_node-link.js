(function() {
  var width = 1000,
    height = 650;

  var root = d3.select("#interactions")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        
  var svg = root.append("g");
  
  var defs = svg.append("defs")

  var forceLink = d3.forceLink()
    .id(function(d) { return d.character; })
    .strength(function(d) {
      return (d.weight-1)} )

  var manyBody = d3.forceManyBody()
    .strength(-10)

  var simulation = d3.forceSimulation()
    .force("manybody", manyBody)
    .force("link", forceLink)
    .force("x", d3.forceX(width).strength(0.3))
    .force("y", d3.forceY(height / 2).strength(1.5))
    .force("collide", d3.forceCollide(70))
    .alphaTarget(0)
    .velocityDecay(0.95)

  // var colorScale = d3.scaleOrdinal().domain(['friendship', 'romantic', 'family', 'work', 'default'])
  //   .range(['yellow', 'red', 'lightblue', 'green', 'gray'])

  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  d3.queue()
    .defer(d3.json, "interactions.json")
    .await(ready)

  function ready (error, graph) {

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

    var draggable = d3.drag()
     .on("start", dragstarted)
     .on("drag", dragged)
     .on("end", dragended)

    var links = svg.selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr('class', 'link')
        .attr("stroke", function(d) {
          // return colorScale(d.relationship)
          return '#b61210'
        })
        .attr("fill", "none")
        .attr("stroke-width", function(d) {
          return (d.weight-1)*2
        })
        .attr("id", function(d) {
          return "line-" + d.id;
        })

    var nodes = svg.selectAll(".artist")
      .data(graph.nodes)
      .enter().append("circle")
      .attr("class", "artist")
      .attr("r", 40)
      .attr("fill", function(d) {
        return "url(#" + d.character.split(' ')[0].toLowerCase() + ")"
      })
      .attr('stroke', '#bbbbbb')
      .attr('stroke-width', '5px')
      .call(draggable)
      .on('mouseover', function(d) {
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html("Character: " + d.character.split(' ')[0] + "<br/>Actor: " + d.character.split('(')[1].split(')')[0])
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      }) 
      .on('mouseout', function(d) {
        div.transition()
          .duration(500)
          .style("opacity", 0);
      })

    simulation.nodes(graph.nodes)
      .on('tick', ticked)

    simulation.force("link")
      .links(graph.links);

    function ticked() {
      links
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      nodes
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
    }

    d3.select('#all').on('click', function() {
      d3.selectAll('.link')
        .attr('stroke', '#b61210')
    })
    d3.select('#romantic').on('click', function() {
      d3.selectAll('.link')
        .attr('stroke', function(d) {
          if (d.relationship == 'romantic') {
            return '#b61210'
          }
          else {return '#bbbbbb'}
        })
    })
    d3.select('#friendship').on('click', function() {
      d3.selectAll('.link')
        .attr('stroke', function(d) {
          if (d.relationship == 'friendship') {
            return '#b61210'
          }
          else {return '#bbbbbb'}
        })
    })
    d3.select('#family').on('click', function() {
      d3.selectAll('.link')
        .attr('stroke', function(d) {
          if (d.relationship == 'family') {
            return '#b61210'
          }
          else {return '#bbbbbb'}
        })
    })
    d3.select('#work').on('click', function() {
      d3.selectAll('.link')
        .attr('stroke', function(d) {
          if (d.relationship == 'work') {
            return '#b61210'
          }
          else {return '#bbbbbb'}
        })
    })

  }

})();