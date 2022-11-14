var xScale;
var yScale;
const parseTime = d3.timeParse("%Y");
var dataDict = {}, line, svg, lineG, circlePlot;

let initializeLineChart = (data, country) => {
    var dataArray = [];
    data.forEach(function (d) {
        if (d.Entity === country) {
            dataArray.push(d);
        }
    })


    for (let idx = 0; idx < dataArray.length; idx++) {
        var year = new Date(dataArray[idx].Year).getFullYear();
        dataDict[year] = dataArray[idx]["Annual CO2 emissions"];
    }

    var finalDataArray = [];
    for (key in dataDict) {
        finalDataArray.push({'key': key, 'value': dataDict[key]})
    }

    line = d3.line()
        .x(function (d) {
            return xScale(parseTime(d.key));
        })
        .y(function (d) {
            return yScale(d.value);
        });

    lineG.selectAll("path")
        .data([finalDataArray])
        .join(
            function (enter) {
                return enter.append("path")
                    .attr("d", line)
                    .attr("class", "lines");
            },
            function (update) {
                console.log("update")
                return update.attr("d", line);
            },
            function (exit) {
                return exit.remove();
            }
        )
        .style("fill", "none")
        .style("stroke", "black")
        .attr("transform", "translate(35, 10)")
        .attr("stroke-width", 1)
        .on("mouseover", function (d, i) {
            d3.select(this).attr("stroke-width", 3).style("stroke", "#FF731D");
        })
        .on("mouseout", function () {
            d3.select(this).attr("stroke-width", 1).style("stroke", "black");
        });


    circlePlot.selectAll("circle")
        .data(finalDataArray)
        .join( function (enter) {
                return enter.append("circle")
                    .attr("class", "pointCircle")
                    .attr("cy", function (d){
                        return yScale(d.value)
                    })
                    .attr("cx", function(d){
                        return xScale(parseTime(d.key))
                    })
                    .attr("r", 1.5)
            },
            function (update) {
                return update.attr("cy", (d) => yScale(d.value))
                    .attr("cx", (d) => xScale(parseTime(d.key)))
                    .attr("r", 1.5);
            },
            function (exit) {
                return exit.remove();
            })
        .attr("transform", "translate(35, 10)")
        .on("mouseover", function (d, i) {
                d3.select(this).attr("r", 3).style("fill", "#1746A2");
        })
        .on("mouseout", function () {
            d3.select(this).attr("r", 1.5).style("fill", "black");
        });

    // plot points on graph
    // for (var idx = 0; idx < finalDataArray.length; idx++) {
    //     var currY = yScale(finalDataArray[idx].value);
    //     var currX = xScale(parseTime(finalDataArray[idx].key));
    //     circlePlot.selectAll("circle")
    //         .attr("class", "pointCircle")
    //         .attr("cy", currY).attr("cx", currX)
    //         .attr("r", 1.5)
    //         .attr("transform", "translate(35, 10)")
    //         .on("mouseover", function (d, i) {
    //             d3.select(this).attr("r", 7).style("fill", "#1746A2");
    //         })
    //         .on("mouseout", function () {
    //             d3.select(this).attr("r", 3).style("fill", "black");
    //         });
    // }
}

function drawLineChart(data, country) {
    var width = document.getElementById("mainMapChart").offsetWidth - 100,
        height = 500;

    xScale = getScale([parseTime("1750"), parseTime("2021")], [10, width - 40], "scaleTime");
    yScale = getScale([0, 11472369000], [height - 70, 0], "scaleLinear");

    let xAxis = d3.axisBottom(xScale)
        .tickSize(5)
        .tickPadding(15)

    let yAxis = d3.axisLeft(yScale)
        .tickSize(5)
        .tickPadding(15)
        .tickFormat(function (d) {
            return d / 1000000000 + ' Billion';
        });


    function getScale(domainValues, rangeValues, scaleType) {
        if (scaleType == "scaleLinear") {
            return d3.scaleLinear()
                .domain(domainValues)
                .range(rangeValues)
        } else if (scaleType == "scaleTime") {
            return d3.scaleTime()
                .domain(domainValues)
                .range(rangeValues)
        }
    }

    function draw(axis, stroke_width, translate, cls) {
        svg.append("g")
            .call(axis).attr("transform", translate)
            .style("stroke-width", stroke_width)
            .attr("class", cls);
    }

    // add svg element inside div
    svg = d3.select("#mainLineChart")
        .append("svg")
        .attr("width", width + 20)
        .attr("height", height)
        .style("display", "block")
        .style("margin", "auto")
        .attr("transform", "translate(0,50)");

    svg.append("text").attr("x", 800).attr("y", height - 800).style("stroke", "black").style("stroke-width", "1").style("font-size", "25px").text("X-axis --> Year");
    svg.append("text").attr("x", 800).attr("y", height - 770).style("stroke", "black").style("stroke-width", "1").style("font-size", "25px").text("Y-axis --> Maximum value of the tweets");

    draw(xAxis, "2", `translate(35, ${height - 60})`, "xlabel", "scaleTime");
    draw(yAxis, "2", `translate(45,10)`, "xlabel", "scaleLinear");

    lineG = svg.append("g");
    circlePlot = svg.append("g");

    initializeLineChart(data, country);
}