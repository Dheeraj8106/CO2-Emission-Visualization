function drawMap1(world) {
    var width = document.getElementById("mainMapChart").offsetWidth,
        height = document.getElementById("mainMapChart").offsetHeight - 150;

    // var svg = d3.select("#mainMapChart")
    //     .append("svg")
    //     .style("cursor", "move")
    //     .style("position", "relative")
    //     .style("top", "1px")
    //
    // svg.attr("viewBox", "10 5 " + width + " " + (height + 200))
    //     .attr("preserveAspectRatio", "xMinYMin");

    // plot the map
    var projection = d3.geoMercator()
        .scale(1)
        .translate([0, 0]);

    var path = d3.geoPath().projection(projection);

    var ut = topojson.feature(world, world.objects.cb_2015_texas_county_20m);

    let b = path.bounds(ut),
        s = 0.8 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
        t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

    //Update the projection to use computed scale & translate.
    projection
        .scale(s)
        .translate(t);

    var features = ut.features;

    // // creating and adding the legend
    // for(let i = 0;i <= colors.length;i++)
    //     fillRange.push(legendWidth/colors.length * i);
    //
    // let axisScale = d3.scaleQuantile().range(fillRange);
    //
    // let diff = (max - min)/colors.length;
    // let LegendScale = [];
    // for(let i = 0;i <= colors.length;i++)
    //     LegendScale.push(diff * (i + 1) + min);

    // // creating a color scale
    // var colorScale = d3.scaleLinear()
    //     .domain([0,12])
    //     .range(["white", "#61764B"]);
    //
    // for(let idx = 0; idx < features.length;idx++){
    //     var color = colorScale(features[idx].details.unemploymentRate);
    //     colors.push(color);
    // }

    // colors = colors.slice(5);
    //
    // axisScale.domain(LegendScale);
    //
    // let legendaxis = d3.axisBottom(axisScale).tickFormat(x=>  x.toFixed(1) + "%");
    //
    // let legend = svg.selectAll(".legend").data(colors).enter().append("g").attr("transform", `translate(${width/6},${height + 50})`)
    //
    // // adding legend svg to the div
    // legend.append("rect").attr("width", legendWidth/colors.length).attr("height", legendHeight).style("fill", d=>d)
    //     .attr("x", (d,i)=> legendWidth/colors.length * i)
    //
    // svg.append("g").attr("class", "axis")
    //     .attr("transform", `translate(${width/6},${height + 70})`)
    //     .call(legendaxis);


    // ploting the points to draw a map
    worldMap.append("g")
        .selectAll("path")
        .data(features)
        .join(
            function (enter) {
                return enter.append("path")
                    .attr("id", function (d) {
                        return d.properties.NAME.replaceAll(" ", "").toLowerCase();
                    })
                    .attr("name", function (d) {
                        return d.properties.NAME.replaceAll(" ", "").toLowerCase();
                    })
                    .attr("d", path)
                    .attr("fill", function (d, i) {
                        return "#8B7E74";
                    })
                    .style("stroke", "white")
                    .style("stroke-width", 1)
                    .attr("transform", `translate(-120, ${height + 220})`)
            },
            function (update) {
            },
            function (exit) {
                return exit.remove();
            }
        )
}