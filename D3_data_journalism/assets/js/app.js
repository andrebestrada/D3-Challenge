console.log("It´s alive!")

// Create frame for the scatter plot
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 20,
    left: 20,
    bottom: 20
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.

var svg = d3.select("#scatter").append("svg").attr("width",svgWidth).attr("height",svgHeight);

// Append svg group
var chartGroup = svg.append("g")
    .attr("transform",`translate(${margin.left}, ${margin.top})`);

// Initial Parameter for the scatter plot
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// Function for updating X Scale 
function xScale(NPData, chosenXAxis){
    var xlinearScale = d3.scaleLinear()
        .domain([d3.min(NPData, d => d[chosenXAxis]) * 0.8,
            d3.max(NPData,d => d[chosenXAxis]) * 1.2
        ])
        .range([0,width]);
    return xlinearScale
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
}

// function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

    var label;
  
    if (chosenXAxis === "hair_length") {
      label = "Hair Length:";
    }
    else {
      label = "# of Albums:";
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.rockband}<br>${label} ${d[chosenXAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
}


//   Retrieve Cool Newspaper Data from CSV
d3.csv("assets/data/data.csv").then((NPData,err)=>{
    if (err) throw err;
    
    console.log(NPData)

})