// @TODO: YOUR CODE HERE!
// Core Assignment: D3 Dabbler 
//Plot between Healthcare and Poverty: use image in readme as reference of final graph

//set width and height
var svgWidth= 650;
var svgHeight= 500;

//will need to adjust margins to fit tick labels by creating a 
//container and array 
var margin= {
    top: 10,
    right: 30,
    bottom: 50,
    left: 100
};
var width= svgWidth - margin.left - margin.right;
var height= svgHeight - margin.top - margin.bottom;

//select svg container -> index.html has div id=scatter where code will be added
var svg = d3.select("#scatter")
    .append("svg") //this is adding svg in html
    .attr("width", svgWidth)
    .attr("height", svgHeight);

//append group ("g") translate along x axis and y axis
var svgGroup= svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//import data using d3.csv(url,row,callback)
d3.csv("./assets/data/data.csv").then(function(data){
    data.forEach(function(data){
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });
    //console.log(data);
//need to create scales so that charts values are proportional
var xScale= d3.scaleLinear()
    .domain([d3.min(data,d=>d.poverty), d3.max(data,d=>d.poverty)])
    .range([0, width]);
var yScale= d3.scaleLinear()
    .domain([d3.min(data,d=>d.healthcare), d3.max(data,d=>d.healthcare)])
    .range([height,0]);
//create axes and append to svgGroup
var yAxis= d3.axisLeft(yScale);
var xAxis= d3.axisBottom(xScale);

//using "g" element append to svg element 
svgGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);
svgGroup.append("g")
    .call(yAxis);

//since we want circles instead of "rect" we will use "dot" 
var circlesGroup= svgGroup.selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "stateCircle")
    .attr("cx", d => xScale(d.poverty))
    .attr("cy", d => yScale(d.healthcare))
    .attr("r", "10")
    .attr("fill", "blue")
    .attr("opacity", "1");

svgGroup.selectAll("dot")
    .data(data)
    .enter()
    .append("text") //states text/abb
    .attr("class", "stateText")
    .attr("x", d => xScale(d.poverty))
    .attr("y", d => yScale(d.healthcare)+3)
    .attr("font-size", "10xp")
    .text(function(d){return d.abbr});

//https://www.d3-graph-gallery.com/graph/bubble_template.html
//create tool tip 
var toolTip= d3.tip()
    .attr("class", "d3-tip")
    .offset([70,-60])
    .html(function(d){
        return (`In Poverty: ${d.poverty}%<br>Lacks Healthcare: ${d.healthcare}%<br>`);
    });

svgGroup.call(toolTip);

circlesGroup.on("mouseover", function(data){
    toolTip.show(data, this);
})
    .on("mouseout", function(data, index){
        toolTip.hide(data);
    });

//Axis lables for Lacks Healthcare (%) vs. In Poverty (%)
//y axis
svgGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height/2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Lacks HealthCare (%)");

//x axis
svgGroup.append("text")
    .attr("transform", `translate${width/3}, ${height + margin.top + 20})`)
    .text("In Poverty (%)");
});




