var xScale;
var yScale;
const parseTime = d3.timeParse("%Y");
var info3, line, svg, lineG, circlePlot, xAxis, yAxis, xAxisGroup, yAxisGroup, width1, height1;

function convertToInternationalCurrencySystem (labelValue) {
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

let initializeLineChart = (finalDataArray, year) => {
    var maxDomain = 0;

    // var color = d3.scale.category10();

    finalDataArray.forEach(function (d){
        maxDomain = Math.max(d.value, maxDomain);
    })

    finalDataArray.sort(function(a, b){return a.year - b.year})

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
                    .attr("class", "lines")
            },
            function (update) {
                yAxisGroup.transition().duration(150).call(d3.axisLeft(d3.scaleLinear().domain([0, maxDomain]).range([height1 - 70, 0])).tickSize(5).tickPadding(25).tickFormat(function (d) { return d / 1000000000 + ' B'; })).style("stroke-width", "2").attr("class", "ylabel");
                yScale = getScale([0, maxDomain], [height1 - 70, 0], "scaleLinear");

                xAxisGroup.transition().duration(150).call(d3.axisBottom(d3.scaleTime().domain([year[0], year[1]]).range([0, width1 - 50])).tickSize(5).tickPadding(15)).style("stroke-width", "2").attr("class", "xlabel");
                xScale = getScale([year[0], year[1]], [0, width1 - 50], "scaleTime");

                return update.transition().duration(150).attr("d", line);
            },
            function (exit) {
                return exit.remove();
            }
        )
        .style("fill", "none")
        .style("stroke", "#FF731D")
        .attr("stroke-width", 3)
        .attr("transform", "translate(35, 0)")


    var mouseG = svg.append("g")
        .attr("class", "mouse-over-effects")
        .attr("transform", "translate(35,-40)");

    mouseG.append("path") // this is the black vertical line to follow mouse
        .attr("class", "mouse-line")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("opacity", "0");

    var lines1 = document.getElementsByClassName('lines');

    var mousePerLine = mouseG.selectAll('.mouse-per-line')
        .data([{name: 'New York', values: 0}])
        .enter()
        .append("g")
        .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
        .attr("r", 7)
        .style("stroke", function(d) {
            return "black";
        })
        .style("fill", "none")
        .style("stroke-width", "1px")
        .style("opacity", "0");

    mousePerLine.append("text")
        .attr("transform", "translate(-40,-20)");

    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
        .attr('width', width1) // can't catch mouse events on a g element
        .attr('height', height1)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseout', function() { // on mouse out hide line, circles and text
            d3.select(".mouse-line")
                .style("opacity", "0");
            d3.selectAll(".mouse-per-line circle")
                .style("opacity", "0");
            d3.selectAll(".mouse-per-line text")
                .style("opacity", "0");
            d3.select(".lines").attr("stroke-width", 3)
        })
        .on('mouseover', function() { // on mouse in show line, circles and text
            d3.select(".mouse-line")
                .style("opacity", "1");
            d3.selectAll(".mouse-per-line circle")
                .style("opacity", "1");
            d3.selectAll(".mouse-per-line text")
                .style("opacity", "1");
            d3.select('.lines').attr("stroke-width", 1.5)
        })
        .on('mousemove', function(e) { // mouse moving over canvas
            d3.select('.lines').attr("stroke-width", 1.5)

            var mouse = d3.pointer(e, this);
            d3.select(".mouse-line")
                .attr("d", function() {
                    var d = "M" + (mouse[0]) + "," + (height1 - 60);
                    d += " " + (mouse[0]) + "," + 0;
                    return d;
                })
                .attr("transform", "translate(0, 40)");

            d3.selectAll(".mouse-per-line")
                .attr("transform", function(d, i) {
                    var xDate = xScale.invert(mouse[0]),
                        bisect = d3.bisector(function(d) { return d.values; }).left;
                    idx = bisect(d.values, xDate);

                    var beginning = 0,
                        end = lines1[i].getTotalLength(),
                        target = null;

                    while (true){
                        target = Math.floor((beginning + end) / 2);
                        pos = lines1[i].getPointAtLength(target);
                        if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                            break;
                        }

                        if (pos.x > mouse[0])      end = target;
                        else if (pos.x < mouse[0]) beginning = target;
                        else break; //position found
                    }

                    d3.select(this).select('text')
                        .text(convertToInternationalCurrencySystem(yScale.invert(pos.y).toFixed(2)));

                    return "translate(" + (mouse[0]) + "," + (pos.y + 40) +")";
                });
        });

}

function drawLineChart(data) {
    var maxDomain = 0;

    data.forEach(function (d){
        maxDomain = Math.max(d.value, maxDomain);
    })

    data.sort(function(a, b){return a.year - b.year})

    width1 = document.getElementById("mainLineChart").offsetWidth;
    height1 = document.getElementById("mainLineChart3").offsetHeight - 80;

    xScale = getScale([parseTime("1749"), parseTime("2020")], [0, width1 - 50], "scaleTime");
    yScale = getScale([0, maxDomain], [height1 - 70, 0], "scaleLinear");

    xAxis = d3.axisBottom(xScale)
        .tickSize(5)
        .tickPadding(15)

    yAxis = d3.axisLeft(yScale)
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
        return svg.append("g")
            .call(axis)
            .attr("transform", translate)
            .style("stroke-width", stroke_width)
            .attr("class", cls);
    }

    // add svg element inside div
    svg = d3.select("#mainLineChart")
        .append("svg")
        .attr("width", width1)
        .attr("height", height1)
        .style("display", "block")
        .style("margin", "auto")

    xAxisGroup = draw(xAxis, "2", `translate(35, ${height1 - 70})`, "xlabel", "scaleTime");
    yAxisGroup = draw(yAxis, "2", `translate(35,0)`, "ylabel", "scaleLinear");

    lineG = svg.append("g");

    info3 = svg.append("g");
    info3.append("line").attr("x1", 50).attr("y1", 30).attr("x2", 90).attr("y2", 30).style("stroke", "#FF731D").style("stroke-width", "3").attr("transform", "translate()");
    info3.append("text").attr("x", 100).attr("y", 30).text("Carbon dioxide (CO₂) emissions ").style("stroke", "black").style("stroke-width", "0.1").style("font-size", "10px")

    circlePlot = svg.append("g");

    initializeLineChart(data, [parseTime("1749"), parseTime("2020")]);
}