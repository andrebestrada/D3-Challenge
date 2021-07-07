console.log("It´s alive!")

// Create frame for the scatter plot
var svgWidth = 1050;
var svgHeight = 550;

var margin = {
    top: 20,
    right: 20,
    left: 100,
    bottom: 100
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
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(NPData, d => d[chosenXAxis]) * .95, d3.max(NPData,d => d[chosenXAxis]) * 1.05])
        .range([0,width]);
    return xLinearScale
}
// Function for updating Y Scale 
function yScale(NPData, chosenYAxis){
  var yLinearScale = d3.scaleLinear()
      .domain([d3.min(NPData,d=>d[chosenYAxis])*0.8, d3.max(NPData,d => d[chosenYAxis]) * 1.1])
      .range([height,0]);
  return yLinearScale
}

function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    circlesGroup.transition()
      .duration(1100)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
}

function renderDataLabels(dataLabelsGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    
    dataLabelsGroup.transition()
        .duration(1150)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));
    return dataLabelsGroup;
}

var toolTip = d3.select("#toolTip").append("div")			
.style("opacity", 0);

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup, dataLabelsGroup) {

    var label;
  
    if (chosenXAxis === "poverty") {
      label = "Poverty:";
    } else if(chosenXAxis === "age") {
      label = "Age";
    } else {
      label = "Household Income";
    }

    // var toolTip = d3.tip()
    //   .attr("class", "tooltip")
    //   .offset([80, -60])
    //   .html(function(d) {
    //     return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
    //   });
  
    // circlesGroup.call(toolTip);
    // dataLabelsGroup.call(toolTip);
  
    // Mouseover event
    // circlesGroup.on("mouseover", function(data) {toolTip.show(data)});
    // dataLabelsGroup.on("click", (data)=>{toolTip.show(data)});
    // Mouseout event
    // circlesGroup.on("mouseout", function(data, index) {toolTip.hide(data)});
    // dataLabelsGroup.on("mouseout", function(data, index) {toolTip.hide(data)});

    return circlesGroup;
}

function labelChange(clickedAxis, current_selection){
  d3
    .selectAll("#axis-text")
    .filter(".active")
    .classed("active", false)
    .classed("inactive", true);

  clickedAxis.classed("inactive", false).classed("active", true);
  current_selection.classed("inactive", false).classed("active", true);
}

//   Retrieve Cool Newspaper Data from CSV
d3.csv("assets/data/data.csv").then((NPData,err)=>{
    if (err) throw err;
    
    console.log(NPData)

    NPData.forEach(data=>{
        data.poverty = +data.poverty
        data.healthcare = +data.healthcare
        data.age = +data.age
        data.income = +data.income
        data.smokes = +data.smokes
        data.obesity = +data.obesity
    })

 // xLinearScale function above csv import
 var xLinearScale = xScale(NPData, chosenXAxis);
 var yLinearScale = yScale(NPData, chosenYAxis);

 // Create initial axis functions
 var bottomAxis = d3.axisBottom(xLinearScale);
 var leftAxis = d3.axisLeft(yLinearScale);
  
 // Initial circles
 var circlesGroup = chartGroup.selectAll("circle")
        .data(NPData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 14)
        .attr("fill", "#187bcd")
        .classed("nodes",true)	

 var dataLabelsGroup = chartGroup.selectAll("text")
        .data(NPData)
        .enter()
        .append("text")
        .attr("fill", "black")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .attr("font-size",".8em")
        .attr("font-weight","bold")
        .style("fill", "white")
        .attr("text-anchor","middle")
        .attr("dy", "0.35em")
        .attr("class", "abbr")
        .text(d=>d.abbr)
        .on("mouseover", d => {
          // circlesGroup(this).attr("fill", "red")
          toolTip.transition()		
                 .duration(1000)			
                 .style("opacity", 1)
          toolTip.html("<h6>State: "+ d.state +"</h6> <h6> "+ chosenXAxis+ ": " + d[chosenXAxis] + "</h6> <h6> "+ chosenYAxis+ ": " + d[chosenYAxis] + "</h6>")

          

            })	        
 
        
 // append x axis
 var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

 // append y axis
 var yAxis = chartGroup.append("g")
        .classed("y-axis",true)
        .call(leftAxis);   

  // Create group for three x-axis labels

  var XlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`)
    .attr("id","XlabelsGroup");

    var povertyLabel = XlabelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 20)
          .attr("value", "poverty") // value to grab for event listener
          .classed("active", true)
          .attr("id", "axis-text")
          .text("In Poverty (%)");

    var ageLabel = XlabelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 40)
          .attr("value", "age") // value to grab for event listener
          .classed("inactive", true)
          .attr("id", "axis-text")
          .text("Age (Median)");

    var householdLabel = XlabelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 60)
          .attr("value", "income") // value to grab for event listener
          .classed("inactive", true)
          .attr("id", "axis-text")
          .text("Household Income (Median)");
        

  // Create group for two y-axis labels
  var YlabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)")
    .attr("dy", "1em");

    var healthcareLabel = YlabelsGroup.append("text")
          .attr("y", 0 - margin.left +70)
          .attr("x", 0 - (height / 2))
          .attr("value", "healthcare") // value to grab for event listener
          .attr("id", "axis-text")
          .classed("active", true)
          .text("Lacks Healthcare (%)")

    var smokesLabel = YlabelsGroup.append("text")
          .attr("y", 0 - margin.left + 45)
          .attr("x", 0 - (height / 2))
          .attr("value", "smokes") // value to grab for event listener
          .attr("id", "axis-text")
          .classed("inactive", true)
          .text("Smokes (%)")
    
    var ObeseLabel = YlabelsGroup.append("text")
          .attr("y", 0 - margin.left + 20)
          .attr("x", 0 - (height / 2))
          .attr("value", "obesity") // value to grab for event listener
          .classed("inactive", true)
          .attr("id", "axis-text")
          .text("Obese (%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup, dataLabelsGroup);

  // x axis labels event listener
  d3.selectAll("#axis-text").on("click", function() {
    selection = d3.select(this);
    chosen = d3.select(this).attr("value");

      // console.log(chosen)
      if (chosen === "poverty" || chosen === "income" || chosen === "age"){
        Xvalue = chosen
        Yvalue = chosenYAxis
        current_selection = d3.select(`text[value=${chosenYAxis}]`);
        // d3.select("#axis-text".filter(chosenYAxis))
      }
      if (chosen === "healthcare" || chosen === "smokes" || chosen === "obesity"){
        Yvalue = chosen
        Xvalue = chosenXAxis
        current_selection = d3.select(`text[value=${chosenXAxis}]`);
      }
      
      if (Xvalue !== chosenXAxis || Yvalue !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = Xvalue;
        chosenYAxis = Yvalue;

        // functions here found above csv import
        // updates x/y scale for new data
        xLinearScale = xScale(NPData, Xvalue);
        yLinearScale = yScale(NPData, Yvalue);

        // updates x/y axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles and labels with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
        dataLabelsGroup = renderDataLabels(dataLabelsGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup, dataLabelsGroup);

        // changes classes to change bold text
        labelChange(selection, current_selection)
    }
  });
})
.catch(function(error) {
  console.log(error);
});
