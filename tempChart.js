function drawLineChart4() {
    var margin = {top: 10, right: 10, bottom: 100, left: 40},
        margin2 = {top: 430, right: 10, bottom: 20, left: 40},
        width6 = document.getElementById("mainLineChart").offsetWidth - margin.left - margin.right,
        height6 = document.getElementById("mainLineChart3").offsetHeight - 30 - margin.top - margin.bottom,
        height7 = document.getElementById("mainLineChart3").offsetHeight - 30 - margin2.top - margin2.bottom;

    const parseDate = d3.timeParse("%Y");
//%b

    var x = d3.scaleTime().range([0, width6]),
        x2 = d3.scaleTime().range([0, width6]),
        y = d3.scaleLinear().range([height6, 0]),
        y2 = d3.scaleLinear().range([height7, 0]);

    var xAxis = d3.axisBottom(x),
        xAxis2 = d3.axisBottom(x2),
        yAxis = d3.axisLeft(y);

    var brush = d3.brush().on("brush", brushed);

    var area = d3.area()
        .x(function (d) {
            return x(d.date);
        })
        .y0(height6)
        .y1(function (d) {
            return y(d.caseid);
        });

    var area2 = d3.area()
        .x(function (d) {
            return x2(d.date);
        })
        .y0(height7)
        .y1(function (d) {
            return y2(d.caseid);
        });

    var svg = d3.select("#mainLineChart").append("svg")
        .attr("width", width6 + margin.left + margin.right)
        .attr("height", height6 + margin.top + margin.bottom);

    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width6)
        .attr("height", height6);

    var focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    d3.csv("totaltopics.csv")
        .then(function (data) {
            x.domain(d3.extent(data.map(function (d) {
                return d.date;
            })));
            y.domain([0, d3.max(data.map(function (d) {
                return d.caseid;
            }))]);
            x2.domain(x.domain());
            y2.domain(y.domain());

            focus.append("path")
                .datum(data)
                .attr("class", "area")
                .attr("d", area);

            focus.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height6 + ")")
                .call(xAxis);

            focus.append("g")
                .attr("class", "y axis")
                .call(yAxis);

            context.append("path")
                .datum(data)
                .attr("class", "area")
                .attr("d", area2);

            context.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height7 + ")")
                .call(xAxis2);

            context.append("g")
                .attr("class", "x brush")
                .call(brush)
                .selectAll("rect")
                .attr("y", -6)
                .attr("height", height7 + 7);
        });

    function brushed() {
        x.domain(brush.empty() ? x2.domain() : brush.extent());
        focus.select(".area").attr("d", area);
        focus.select(".x.axis").call(xAxis);
    }

    function type(d) {
        d.date = parseDate(d.date);
        d.caseid = +d.caseId;
        return d;
    }
}
