var xScale2;
var yScale2;
var info1, line, svg2, lineG1, lineG2, lineG3, circlePlot2, circlePlot3, xAxis2, yAxis2, xAxisGroup2, yAxisGroup2, width3, height3;

function convertToInternationalCurrencySystem(labelValue) {
    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+9

        ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + "B"
        // Six Zeroes for Millions
        : Math.abs(Number(labelValue)) >= 1.0e+6

            ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + "M"
            // Three Zeroes for Thousands
            : Math.abs(Number(labelValue)) >= 1.0e+3

                ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + "K"

                : Math.abs(Number(labelValue));

}

let initializeLineChart2 = (finalDataArray, year) => {
    var maxDomain = 0;

    finalDataArray.forEach(function (d){
        for(var idx = 1; idx < 3;idx++){
            maxDomain = Math.max(d.value[idx], maxDomain);
        }
    })

    finalDataArray.sort(function(a, b){return a.year - b.year})

    // line = d3.line()
    //     .x(function (d) {
    //         return xScale2(parseTime(d.key));
    //     })
    //     .y(function (d) {
    //         return yScale2(d.value[0]);
    //     });

    line1 = d3.line()
        .x(function (d) {
            return xScale2(parseTime(d.key));
        })
        .y(function (d) {
            return yScale2(d.value[1]);
        });

    line2 = d3.line()
        .x(function (d) {
            return xScale2(parseTime(d.key));
        })
        .y(function (d) {
            return yScale2(d.value[2]);
        });

    // lineG1.selectAll("path")
    //     .data([finalDataArray])
    //     .join(
    //         function (enter) {
    //             return enter.append("path")
    //                 .attr("d", line1)
    //                 .attr("class", "lines")
    //         },
    //         function (update) {
    //             yAxisGroup2.transition().duration(150).call(d3.axisLeft(d3.scaleLinear().domain([0, maxDomain]).range([height3 - 70, 0])).tickSize(5).tickPadding(15).tickFormat(function (d) { return d / 1000000000 + ' B'; })).style("stroke-width", "2").attr("class", "ylabel");
    //             yScale2 = getScale([0, maxDomain], [height3 - 70, 0], "scaleLinear");
    //
    //             xAxisGroup2.transition().duration(150).call(d3.axisBottom(d3.scaleTime().domain([year[0], year[1]]).range([0, width3 - 50])).tickSize(5).tickPadding(15)).style("stroke-width", "2").attr("class", "xlabel");
    //             xScale2 = getScale([year[0], year[1]], [0, width3 - 50], "scaleTime");
    //
    //             return update.transition().duration(150).attr("d", line);
    //         },
    //         function (exit) {
    //             return exit.remove();
    //         }
    //     )
    //     .style("fill", "none")
    //     .style("stroke", "#FF731D")
    //     .attr("stroke-width", 3)
    //     .attr("transform", "translate(20, 40)")
    //     .on("mouseover", function (d, i) {
    //         d3.select(this).attr("stroke-width", 3).style("stroke", "#FF731D");
    //     })
    //     .on("mouseout", function () {
    //         d3.select(this).attr("stroke-width", 1).style("stroke", "black");
    //     });

    lineG2.selectAll("path")
        .data([finalDataArray])
        .join(
            function (enter) {
                return enter.append("path")
                    .attr("d", line1)
                    .attr("class", "lines1")
                    .attr("id", "line1")
            },
            function (update) {
                yAxisGroup2.transition().duration(150).call(d3.axisLeft(d3.scaleLinear().domain([0, maxDomain]).range([height3 - 70, 0])).tickSize(5).tickPadding(15).tickFormat(function (d) { return d / 1000000000 + ' B'; })).style("stroke-width", "2").attr("class", "ylabel");
                yScale2 = getScale([0, maxDomain], [height3 - 70, 0], "scaleLinear");

                xAxisGroup2.transition().duration(150).call(d3.axisBottom(d3.scaleTime().domain([year[0], year[1]]).range([0, width3 - 50])).tickSize(5).tickPadding(15)).style("stroke-width", "2").attr("class", "xlabel");
                xScale2 = getScale([year[0], year[1]], [0, width3 - 50], "scaleTime");

                return update.transition().duration(150).attr("d", line1);
            },
            function (exit) {
                return exit.remove();
            }
        )
        .style("fill", "none")
        .style("stroke", "#FF731D")
        .attr("stroke-width", 2.5)
        .attr("transform", "translate(40, 20)")
        // .on("mouseover", function (d, i) {
        //     d3.select(this).attr("stroke-width", 5)
        //     d3.select(".lines2").attr("opacity", 0.3);
        // })
        // .on("mouseout", function () {
        //     d3.select(this).attr("stroke-width", 3);
        //     d3.select(".lines2").attr("opacity", 1);
        // });

    lineG3.selectAll("path")
        .data([finalDataArray])
        .join(
            function (enter) {
                return enter.append("path")
                    .attr("d", line2)
                    .attr("class", "lines1")
                    .attr("id", "line2")
            },
            function (update) {
                yAxisGroup2.transition().duration(150).call(d3.axisLeft(d3.scaleLinear().domain([0, maxDomain]).range([height3 - 70, 0])).tickSize(5).tickPadding(25).tickFormat(function (d) { return d / 1000000000 + ' B'; })).style("stroke-width", "2").attr("class", "ylabel");
                yScale2 = getScale([0, maxDomain], [height3 - 70, 0], "scaleLinear");

                xAxisGroup2.transition().duration(150).call(d3.axisBottom(d3.scaleTime().domain([year[0], year[1]]).range([0, width3 - 50])).tickSize(5).tickPadding(15)).style("stroke-width", "2").attr("class", "xlabel");
                xScale2 = getScale([year[0], year[1]], [0, width3 - 50], "scaleTime");

                return update.transition().duration(150).attr("d", line2);
            },
            function (exit) {
                return exit.remove();
            }
        )
        .style("fill", "none")
        .style("stroke", "#1746A2")
        .attr("stroke-width", 2.5)
        .attr("transform", "translate(40, 20)")
        // .on("mouseover", function (d, i) {
        //     d3.select(this).attr("stroke-width", 3);
        //     d3.select(".lines1").attr("opacity", 1.5);
        // })
        // .on("mouseout", function () {
        //     d3.select(this).attr("stroke-width", 3);
        //     d3.select(".lines1").attr("opacity", 1);
        // });


    var mouseG1 = svg2.append("g")
        .attr("class", "mouse-over-effects1")
        .attr("transform", "translate(40,0)");

    mouseG1.append("path") // this is the black vertical line to follow mouse
        .attr("class", "mouse-line1")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("opacity", "0");

    var lines2 = document.getElementsByClassName('lines1');

    var mousePerLine1 = mouseG1.selectAll('.mouse-per-line1')
        .data([
            {name: 'New York', values: 0},
            {name: 'New York', values: 0}
        ])
        .enter()
        .append("g")
        .attr("class", "mouse-per-line1");

    mousePerLine1.append("circle")
        .attr("r", 7)
        .style("stroke", function(d) {
            return "black";
        })
        .style("fill", "none")
        .style("stroke-width", "1px")
        .style("opacity", "0");

    mousePerLine1.append("text")
        .attr("transform", "translate(-40,-20)");

    mouseG1.append('svg:rect') // append a rect to catch mouse movements on canvas
        .attr('width', width3) // can't catch mouse events on a g element
        .attr('height', height3)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseout', function() { // on mouse out hide line, circles and text
            d3.select(".mouse-line1")
                .style("opacity", "0");
            d3.selectAll(".mouse-per-line1 circle")
                .style("opacity", "0");
            d3.selectAll(".mouse-per-line1 text")
                .style("opacity", "0");
            d3.select("#line2").attr("stroke-width", 2.5);
            d3.select("#line1").attr("stroke-width", 2.5);
        })
        .on('mouseover', function() { // on mouse in show line, circles and text
            d3.select(".mouse-line1")
                .style("opacity", "1");
            d3.selectAll(".mouse-per-line1 circle")
                .style("opacity", "1");
            d3.selectAll(".mouse-per-line1 text")
                .style("opacity", "1");
            d3.select("#line2").attr("stroke-width", 1);
            d3.select("#line1").attr("stroke-width", 1);
        })
        .on('mousemove', function(e) { // mouse moving over canvas
            d3.select("#line2").attr("stroke-width", 1);
            d3.select("#line1").attr("stroke-width", 1);
            var mouse = d3.pointer(e, this);
            d3.select(".mouse-line1")
                .attr("d", function() {
                    var d = "M" + (mouse[0]) + "," + (height3 - 60);
                    d += " " + (mouse[0]) + "," + 0;
                    return d;
                })
                .attr("transform", "translate(0, 40)");

            d3.selectAll(".mouse-per-line1")
                .attr("transform", function(d, i) {
                    var xDate = xScale2.invert(mouse[0]),
                        bisect = d3.bisector(function(d) { return d.values; }).right;
                    idx = bisect(d.values, xDate);

                    var beginning = 0,
                        end = lines2[i].getTotalLength(),
                        target = null;

                    while (true){
                        target = Math.floor((beginning + end) / 2);
                        pos = lines2[i].getPointAtLength(target);
                        if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                            break;
                        }

                        if (pos.x > mouse[0])      end = target;
                        else if (pos.x < mouse[0]) beginning = target;
                        else break; //position found
                    }

                    d3.select(this).select('text')
                        .text(convertToInternationalCurrencySystem(yScale2.invert(pos.y).toFixed(2)));

                    return "translate(" + (mouse[0]) + "," + (pos.y + 20) +")";
                });
        });
}

function drawLineChart2(data) {
    width3 = document.getElementById("mainLineChart2").offsetWidth;
    height3 = document.getElementById("mainLineChart3").offsetHeight - 100;

    xScale2 = getScale([parseTime("1850"), parseTime("2021")], [0, width3 - 50], "scaleTime");
    yScale2 = getScale([0, 9000000000], [height3 - 70, 0], "scaleLinear");

    xAxis2 = d3.axisBottom(xScale2)
        .tickSize(5)
        .tickPadding(15)

    yAxis2 = d3.axisLeft(yScale2)
        .tickSize(5)
        .tickPadding(15)
        .tickFormat(function (d) {
            return d / 1000000000 + 'B';
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
        return svg2.append("g")
            .call(axis)
            .attr("transform", translate)
            .style("stroke-width", stroke_width)
            .attr("class", cls);
    }

    // add svg element inside div
    svg2 = d3.select("#mainLineChart2")
        .append("svg")
        .attr("width", width3)
        .attr("height", height3)
        .style("display", "block")
        .style("margin", "auto")

    xAxisGroup2 = draw(xAxis2, "2", `translate(40, ${height3 - 50})`, "xlabel", "scaleTime");
    yAxisGroup2 = draw(yAxis2, "2", `translate(40,20)`, "ylabel", "scaleLinear");

    lineG1 = svg2.append("g");
    lineG2 = svg2.append("g");
    lineG3 = svg2.append("g");
    info1 = svg2.append("g");

    info1.append("line").attr("x1",50).attr("y1",30).attr("x2", 90).attr("y2", 30).style("stroke","#FF731D").style("stroke-width", "3")
    info1.append("line").attr("x1",50).attr("y1",50).attr("x2", 90).attr("y2", 50).style("stroke","#1746A2").style("stroke-width", "3")

    info1.append("text").attr("x", 100).attr("y", 30).text("Fossil fuels").style("stroke","black").style("stroke-width", "0.1").style("font-size", "10px")
    info1.append("text").attr("x", 100).attr("y", 50).text("Land use change").style("stroke","black").style("stroke-width", "0.1").style("font-size", "10px")

    circlePlot2 = svg2.append("g");

    initializeLineChart2(data, [parseTime("1850"), parseTime("2021")]);
}