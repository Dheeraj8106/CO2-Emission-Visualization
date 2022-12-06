function convertDate(date) {
    return [
        (date.getMonth() + 1).toString().padStart(2, '0'),
        (date.getDate()).toString().padStart(2, '0'),
        date.getFullYear().toString().padStart(2, '0'),
    ].join('/');
}

var dataDict = {}, area, svg1, xScale1, yScale1, areaG, a, b, width2, height2;
const parseTime1 = d3.timeParse("%Y");

let initializeAreaChart = (finalDataArray1, year) => {
    area = d3.area()
        .x(function (d) {
            return xScale1(parseTime1(d.year));
        })
        .y0(260)
        .y1(function (d) {
            return yScale1(d.value);
        })

    var maxDomain = 0;

    finalDataArray1.forEach(function (d) {
        maxDomain = Math.max(d.value, maxDomain);
    })

    finalDataArray1.sort(function (a, b) {
        return a.year - b.year
    })

    areaG.selectAll("path")
        .data([finalDataArray1])
        .join(
            function (enter) {
                return enter.append("path")
                    .attr("d", area)
                    .attr("class", "area");
            },
            function (update) {
                b.transition().duration(150).call(d3.axisLeft(d3.scaleLinear().domain([0, maxDomain]).range([height2 - 70, 0])).tickSize(5).tickPadding(15)).style("stroke-width", "2").attr("class", "xlabel");
                yScale1 = getScale([0, maxDomain], [height2 - 70, 0], "scaleLinear");

                a.transition().duration(150).call(d3.axisBottom(d3.scaleTime().domain([year[0], year[1]]).range([0, width2 - 50])).tickSize(5).tickPadding(15)).style("stroke-width", "2").attr("class", "xlabel");
                xScale1 = getScale([year[0], year[1]], [0, width2 - 50], "scaleLinear");

                return update.transition().duration(150).attr("d", area);
            },
            function (exit) {
                return exit.remove();
            }
        )
        .style("fill", "#FEC260")
        .style("stroke", "black")
        .attr("transform", "translate(20, 40)")
        .on("mouseover", function (d, i) {
            d3.select(this).transition().duration(250).attr("stroke-width", 4).style("fill", "#B4CDE6").style("stroke", "#5F9DF7").style("opacity", "0.8");
            d3.selectAll(".pointCircle").transition().duration(500).attr("r", 2)
        })
        .on("mouseout", function () {
            d3.select(this).transition().duration(250).attr("stroke-width", 1).style("fill", "#FEC260").style("stroke", "#FF731D");
            d3.selectAll(".pointCircle").transition().duration(500).attr("r", 1)
        })


    var mouseG2 = svg1.append("g")
        .attr("class", "mouse-over-effects2")
        .attr("transform", "translate(20, 20)");

    mouseG2.append("path") // this is the black vertical line to follow mouse
        .attr("class", "mouse-line2")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("opacity", "0");

    var lines1 = document.getElementsByClassName('area');

    var mousePerLine2 = mouseG2.selectAll('.mouse-per-line2')
        .data([{name: 'New York', values: 0}])
        .enter()
        .append("g")
        .attr("class", "mouse-per-line2");

    mousePerLine2.append("circle")
        .attr("r", 7)
        .style("stroke", function (d) {
            return "black";
        })
        .style("fill", "none")
        .style("stroke-width", "1px")
        .style("opacity", "0");

    mousePerLine2.append("text")
        .attr("transform", "translate(-40,-20)");

    mouseG2.append('svg:rect') // append a rect to catch mouse movements on canvas
        .attr('width', width2) // can't catch mouse events on a g element
        .attr('height', height2)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseout', function () { // on mouse out hide line, circles and text
            d3.select(".mouse-line2")
                .style("opacity", "0");
            d3.selectAll(".mouse-per-line2 circle")
                .style("opacity", "0");
            d3.selectAll(".mouse-per-line2 text")
                .style("opacity", "0");
            d3.select(".lines").attr("stroke-width", 3)
        })
        .on('mouseover', function () { // on mouse in show line, circles and text
            d3.select(".mouse-line2")
                .style("opacity", "1");
            d3.selectAll(".mouse-per-line2 circle")
                .style("opacity", "1");
            d3.selectAll(".mouse-per-line2 text")
                .style("opacity", "1");
            d3.select('.lines').attr("stroke-width", 1.5)
        })
        .on('mousemove', function (e) { // mouse moving over canvas
            d3.select('.lines').attr("stroke-width", 1.5)

            var mouse = d3.pointer(e, this);
            d3.select(".mouse-line2")
                .attr("d", function () {
                    var d = "M" + (mouse[0]) + "," + (height2 - 60);
                    d += " " + (mouse[0]) + "," + 0;
                    return d;
                })
                .attr("transform", "translate(0, 40)");

            d3.selectAll(".mouse-per-line2")
                .attr("transform", function (d, i) {
                    var xDate = xScale1.invert(mouse[0]),
                        bisect = d3.bisector(function (d) {
                            return d.values;
                        }).left;
                    idx = bisect(d.values, xDate);

                    var beginning = 0,
                        end = lines1[i].getTotalLength(),
                        target = null;

                    while (true) {
                        target = Math.floor((beginning + end) / 2);
                        pos = lines1[i].getPointAtLength(target);
                        if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                            break;
                        }

                        if (pos.x > mouse[0]) end = target;
                        else if (pos.x < mouse[0]) beginning = target;
                        else break; //position found
                    }

                    d3.select(this).select('text')
                        .text(convertToInternationalCurrencySystem(yScale1.invert(pos.y).toFixed(2)));

                    return "translate(" + (mouse[0]) + "," + (pos.y + 20) + ")";
                });
        });


    // let circlePlot = svg1.append("g").attr("transform", "translate(35, 10)");
    //
    // // plot points on graph
    // for(var idx = 0;idx < finalDataArray1.length; idx++){
    //     var currX = xScale1(parseTime1(finalDataArray1[idx].year));
    //     var currY = yScale1(finalDataArray1[idx].value);
    //     circlePlot.append("circle")
    //         .attr("cy",  currY)
    //         .attr("cx", currX)
    //         .attr("r", 1)
    //         .attr("class", "pointCircle")
    //         .on("mouseover", function (d, i) {
    //             d3.select(this).attr("r", 2);
    //         })
    //         .on("mouseout", function () {
    //             d3.select(this).attr("r", 1);
    //         });
    // }

}

function drawAreaChart(data) {
    // d3.csv("COVID-Utah.csv").then(function(data){
    //
    //
    //     data = data.reverse();
    //     let finalDataArray1 = [];
    //
    //     var idx = 0;
    //     while(idx < data.length) {
    //         var maxValue = 0;
    //         var i = idx;
    //         var startDate = new Date(data[i].Date);
    //         while(i < (idx + 7) && i < data.length) {
    //             maxValue = Math.max(parseInt(data[i]['New cases']), maxValue);
    //             i++;
    //         }
    //         var endDate = new Date(data[i-1].Date);
    //
    //         finalDataArray1.push([[startDate,endDate], maxValue]);
    //         idx = i;
    //     }
    //
    //     var finalMaxDate = finalDataArray1[finalDataArray1.length - 1][0][1];
    //     var finalMinDate = finalDataArray1[0][0][0];

    width2 = document.getElementById("mainAreaChart").offsetWidth;
    height2 = document.getElementById("mainLineChart3").offsetHeight - 80;

    xScale1 = getScale([parseTime1("1989"), parseTime1("2013")], [0, width2 - 50], "scaleTime");
    yScale1 = getScale([0, 30000], [height2 - 70, 0], "scaleLinear");

    let xAxis1 = d3.axisBottom(xScale1)
        .tickSize(5)
        .tickPadding(15)

    let yAxis1 = d3.axisLeft(yScale1)
        .tickSize(5)
        .tickPadding(15)

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
        return svg1.append("g")
            .call(axis)
            .attr("transform", translate)
            .style("stroke-width", stroke_width)
            .attr("class", cls);
    }

    // add svg element inside div
    svg1 = d3.select("#mainAreaChart")
        .append("svg")
        .attr("width", width2)
        .attr("height", height2)
        .style("display", "block")
        .style("margin", "auto")

    // add x-axis text
    // for(let idx = 0; idx < finalDataArray1.length; idx+=1) {
    //     svg1.append("text").attr("x", 28 + ((idx * 1) * 34.8)).attr("y", height - 90).attr("class", "xlabel").attr("transform", `rotate(30, ${50 + ((idx * 1) * 34.8)}, ${height - 70} )`).text((convertDate(finalDataArray1[idx][0][0]) + " - " + convertDate(finalDataArray1[idx][0][1])));
    // }

    areaG = svg1.append("g");

    a = draw(xAxis1, "2", `translate(20, ${height2 - 30})`, "xlabel", "scaleTime");
    b = draw(yAxis1, "2", `translate(20, 40)`, "xlabel", "scaleLinear");

    initializeAreaChart(data, [parseTime1("1989"), parseTime1("2013")]);

    // });
}