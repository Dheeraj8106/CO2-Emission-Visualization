var xScale3;
var yScale3;
var info2, line, svg3, lineG4, lineG5, lineG6, xAxis3, yAxis3, xAxisGroup3, yAxisGroup3, width4, height4;

let initializeLineChart3 = (finalDataArray, year) => {
    var maxDomain = 0;

    finalDataArray.forEach(function (d){
        for(var idx = 1; idx < 3;idx++){
            maxDomain = Math.max(d.value[idx], maxDomain);
        }
    })

    finalDataArray.sort(function(a, b){return a.year - b.year})
    let yAxisValues = []


    line4 = d3.line()
        .x(function (d) {
            return xScale3(parseTime(d.key));
        })
        .y(function (d) {
            return yScale3(d.value[1]);
        });


    line5 = d3.line()
        .x(function (d) {
            return xScale3(parseTime(d.key));
        })
        .y(function (d) {
            return yScale3(d.value[2]);
        });

    lineG5.selectAll("path")
        .data([finalDataArray])
        .join(
            function (enter) {
                return enter.append("path")
                    .attr("d", line4)
                    .attr("class", "lines2")
                    .attr("id", "line3")
            },
            function (update) {
                yAxisGroup3.transition().duration(150).call(d3.axisLeft(d3.scaleLinear().domain([0, maxDomain]).range([height4 - 70, 0])).tickSize(5).tickPadding(25).tickFormat(function (d) { return d; })).style("stroke-width", "2").attr("class", "ylabel");
                yScale3 = getScale([0, maxDomain], [height4 - 70, 0], "scaleLinear");

                xAxisGroup3.transition().duration(150).call(d3.axisBottom(d3.scaleTime().domain([year[0], year[1]]).range([0, width4 - 50])).tickSize(5).tickPadding(15)).style("stroke-width", "2").attr("class", "xlabel");
                xScale3 = getScale([year[0], year[1]], [0, width4 - 50], "scaleTime");

                return update.transition().duration(150).attr("d", line4);
            },
            function (exit) {
                return exit.remove();
            }
        )
        .style("fill", "none")
        .style("stroke", "#FF731D")
        .attr("stroke-width", 2.5)
        .attr("transform", "translate(40, 37)")

    lineG6.selectAll("path")
        .data([finalDataArray])
        .join(
            function (enter) {
                return enter.append("path")
                    .attr("d", line5)
                    .attr("class", "lines2")
                    .attr("id", "line4")
            },
            function (update) {
                yAxisGroup3.transition().duration(150).call(d3.axisLeft(d3.scaleLinear().domain([0, maxDomain]).range([height4 - 70, 0])).tickSize(5).tickPadding(15).tickFormat(function (d) { return d; })).style("stroke-width", "2").attr("class", "ylabel");
                yScale3 = getScale([0, maxDomain], [height4 - 70, 0], "scaleLinear");

                xAxisGroup3.transition().duration(150).call(d3.axisBottom(d3.scaleTime().domain([year[0], year[1]]).range([0, width4 - 50])).tickSize(5).tickPadding(15)).style("stroke-width", "2").attr("class", "xlabel");
                xScale3 = getScale([year[0], year[1]], [0, width4 - 50], "scaleTime");

                return update.transition().duration(150).attr("d", line5);
            },
            function (exit) {
                return exit.remove();
            }
        )
        .style("fill", "none")
        .style("stroke", "#1746A2")
        .attr("stroke-width", 2.5)
        .attr("transform", "translate(40, 37)")


    var mouseG3 = svg3.append("g")
        .attr("class", "mouse-over-effects3")
        .attr("transform", "translate(40,20)");

    mouseG3.append("path") // this is the black vertical line to follow mouse
        .attr("class", "mouse-line3")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("opacity", "0")

    var lines3 = document.getElementsByClassName('lines2');

    var mousePerLine3 = mouseG3.selectAll('.mouse-per-line3')
        .data([
            {name: 'New York', values: 0},
            {name: 'New York', values: 0},
        ])
        .enter()
        .append("g")
        .attr("class", "mouse-per-line3");

    mousePerLine3.append("circle")
        .attr("r", 7)
        .style("stroke", function(d) {
            return "black";
        })
        .style("fill", "none")
        .style("stroke-width", "1px")
        .style("opacity", "0");

    mousePerLine3.append("text")
        .attr("transform", "translate(-40,-20)");

    mouseG3.append('svg:rect') // append a rect to catch mouse movements on canvas
        .attr('width', width4) // can't catch mouse events on a g element
        .attr('height', height4)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseout', function() { // on mouse out hide line, circles and text
            d3.select(".mouse-line3")
                .style("opacity", "0");
            d3.selectAll(".mouse-per-line3 circle")
                .style("opacity", "0");
            d3.selectAll(".mouse-per-line3 text")
                .style("opacity", "0");
            d3.select("#line4").attr("stroke-width", 2.5);
            d3.select("#line3").attr("stroke-width", 2.5);
        })
        .on('mouseover', function() { // on mouse in show line, circles and text
            d3.select(".mouse-line3")
                .style("opacity", "1");
            d3.selectAll(".mouse-per-line3 circle")
                .style("opacity", "1");
            d3.selectAll(".mouse-per-line3 text")
                .style("opacity", "1");
            d3.select("#line4").attr("stroke-width", 1);
            d3.select("#line3").attr("stroke-width", 1);
        })
        .on('mousemove', function(e) { // mouse moving over canvas
            d3.select("#line4").attr("stroke-width", 1);
            d3.select("#line3").attr("stroke-width", 1);
            var mouse = d3.pointer(e, this);
            d3.select(".mouse-line3")
                .attr("d", function() {
                    var d = "M" + (mouse[0]) + "," + (height4 - 60);
                    d += " " + (mouse[0]) + "," + 0;
                    return d;
                })
                .attr("transform", "translate(0, 15)");

            d3.selectAll(".mouse-per-line3")
                .attr("transform", function(d, i) {
                    var xDate = xScale3.invert(mouse[0]),
                        bisect = d3.bisector(function(d) { return d.values; }).right;
                    idx = bisect(d.values, xDate);
                    var beginning = 0,
                        end = lines3[i].getTotalLength(),
                        target = null;

                    while (true){
                        target = Math.floor((beginning + end) / 2);
                        pos = lines3[i].getPointAtLength(target);
                        if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                            break;
                        }

                        if (pos.x > mouse[0])      end = target;
                        else if (pos.x < mouse[0]) beginning = target;
                        else break; //position found
                    }

                    d3.select(this).select('text')
                        .text(convertToInternationalCurrencySystem(yScale3.invert(pos.y).toFixed(2)));

                    return "translate(" + (mouse[0]) + "," + (pos.y + 18) +")";
                });
        });
}

function drawLineChart3(data) {
    width4 = document.getElementById("mainLineChart3").offsetWidth;
    height4 = document.getElementById("mainLineChart3").offsetHeight - 80;

    xScale3 = getScale([parseTime("1989"), parseTime("2021")], [0, width4 - 50], "scaleTime");
    yScale3 = getScale([0, 9000000000], [height4 - 70, 0], "scaleLinear");

    xAxis3 = d3.axisBottom(xScale3)
        .tickSize(5)
        .tickPadding(15)

    yAxis3 = d3.axisLeft(yScale3)
        .tickSize(5)
        .tickPadding(15)
        .tickFormat(function (d) {
            return d;
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
        return svg3.append("g")
            .call(axis)
            .attr("transform", translate)
            .style("stroke-width", stroke_width)
            .attr("class", cls);
    }

    // add svg element inside div
    svg3 = d3.select("#mainLineChart3")
        .append("svg")
        .attr("width", width4)
        .attr("height", height4)
        .style("display", "block")
        .style("margin", "auto")

    xAxisGroup3 = draw(xAxis3, "2", `translate(40, ${height4 - 34})`, "xlabel", "scaleTime");
    yAxisGroup3 = draw(yAxis3, "2", `translate(40,35)`, "ylabel", "scaleLinear");

    lineG4 = svg3.append("g");
    lineG5 = svg3.append("g");
    lineG6 = svg3.append("g");
    info2 = svg3.append("g").attr("transform", "translate(200,0)");

    info2.append("line").attr("x1",0).attr("y1",10).attr("x2", 35).attr("y2", 10).style("stroke","#FF731D").style("stroke-width", "3").attr("transform", "translate()");
    info2.append("line").attr("x1",0).attr("y1",30).attr("x2", 35).attr("y2", 30).style("stroke","#1746A2").style("stroke-width", "3").attr("transform", "translate()");

    info2.append("text").attr("x", 40).attr("y", 10).text("Per capita").style("stroke","black").style("stroke-width", "0.1").style("font-size", "10px")
    info2.append("text").attr("x", 40).attr("y", 30).text("GDP").style("stroke","black").style("stroke-width", "0.1").style("font-size", "10px")


    initializeLineChart3(data, [parseTime("1989"), parseTime("2021")]);
}