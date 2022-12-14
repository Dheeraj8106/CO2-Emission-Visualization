var svg, worldMap, boundingBox, centroid;

function drawMap(world, co2EmissionRate) {

    var width = document.getElementById("mainMapChart").offsetWidth + 500,
        height = document.getElementById("mainMapChart").offsetHeight + 500;

    svg = d3.select("#mainMapChart")
        .append("svg")
        .style("cursor", "move");

    svg.attr("viewBox", "10 5 " + width + " " + (height + 200))
        .attr("preserveAspectRatio", "xMinYMin");

    worldMap = svg.append("g")
        .attr("class", "map");

    boundingBox = svg.append("g")
        .attr("class", "bounding-box")
        .append('rect');

    centroid = svg.append("g")
        .attr("class", "centroid")
        .append('circle')
        .attr("r", "4");

    let colors = ["#3D8361" ,"#CFB997" ,"#E14D2A" ,"#61764B" ,"#FD841F"];
    let fillRange = [];
    let legendWidth = 300;
    let legendHeight = 35;
    var max = 80;
    var min = -20;

    var projection = d3.geoMercator()
        .scale(1)
        .translate([0, 0]);

    var path = d3.geoPath(projection);

    var ut = topojson.feature(world, world.objects.countries);

    let b = path.bounds(ut),
        s = 1.2 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
        t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

    //Update the projection to use computed scale & translate.
    projection
        .scale(s)
        .translate(t);

    var features = ut.features;


    features.forEach(function (feature){
        var countryName = feature.properties.name;
        co2EmissionRate.forEach(function (d){
            if(d.Entity.trim() === countryName.trim() && d.Year === "2021" || (d.Entity.trim() === "North America" && countryName.trim() === "United States of America" && d.Year === "2021")){
                feature.details = d
            }
        });
    });

    var maxCo2Value = 0;
    var minCo2Value = 1000000000000000000
    features.forEach(function (d){
        if(!d.details){
            d.details = {};
        }
        else{
            maxCo2Value = Math.max(maxCo2Value, d.details["Annual CO2 emissions"]);
            minCo2Value = Math.min(minCo2Value, d.details["Annual CO2 emissions"]);
        }
    })

    for(let i = 0;i <= colors.length;i++)
        fillRange.push(legendWidth/colors.length * i);

    let axisScale = d3.scaleQuantile().range(fillRange);

    let diff = (max - min)/colors.length;
    let LegendScale = [];
    for(let i = 0;i <= colors.length;i++)
        LegendScale.push(diff * (i + 1) + min);

    var colorScale = d3.scaleLinear()
        .domain([0, 20])
        .range(["#47B5FF", "#3F0071"]);

    for(let idx = 0; idx < 20;idx++){
        var color = colorScale(idx);
        colors.push(color);
    }

    colors = colors.slice(5);

    axisScale.domain(LegendScale);

    let legendaxis = d3.axisBottom(axisScale).tickFormat(x=>  x.toFixed(1) + "%");

    let legend = svg.selectAll(".legend").data(colors).enter().append("g").attr("transform", `translate(${width/2},${height + 100})`)

    legend.append("rect").attr("width", legendWidth/colors.length).attr("height", legendHeight).style("fill", d=>d)
        .attr("x", (d,i)=> legendWidth/colors.length * i)


    svg.append("g").attr("class", "axis")
        .attr("transform", `translate(${width/2},${height + 135})`)
        .call(legendaxis);

    svg.append("text").attr("class", "ctext");


    function handleMouseover(e, d) {

        var tempValue = d.properties.name;

        let bounds = path.bounds(d);
        let centroid = path.centroid(d);

        d3.selectAll('.ctext').attr("x", bounds[0][0] + (bounds[1][0] - bounds[0][0])/2)
            .attr("y", bounds[0][1] + 85).text(tempValue);

        var countryNameElements = document.getElementsByClassName('countryName');

        for(var idx = 0; idx < countryNameElements.length;idx++){
            countryNameElements[idx].textContent = tempValue;
        }

        d3.select('.bounding-box rect')
            .attr('x', bounds[0][0] + 10)
            .attr('y', bounds[0][1] + 100)
            .attr('width', bounds[1][0] - bounds[0][0])
            .attr('height', bounds[1][1] - bounds[0][1]);

        centroid[1] = centroid[1] + 100
        centroid[0] = centroid[0]
        d3.select('.centroid')
            .style('display', 'inline')
            .attr('transform', 'translate(' + centroid + ')');


        d3.select(this)
            .style("stroke", "black")
            .style("stroke-width", 3)
            .style("cursor", "pointer")

        d3.select(this)
            .style("stroke", "black")
            .style("stroke-width", 3)
            .style("cursor", "pointer")

        d3.select("#" + tempValue + "1").transition().duration(100).style("fill", "#FF731D").style("stroke", "black").style("stroke-width", "3");
        var finalDataArray = prepareFinalArrayForLineChart(tempValue);
        var finalDataArray1 = prepareFinalArrayForLineChart2(tempValue);
        var finalDataArray2 = prepareFinalArrayForLineChart3(tempValue);
        initializeAreaChart(getOzoneData(tempValue), [parseTime1("1989"), parseTime1("2013")])
        initializeLineChart2(finalDataArray1, [parseTime("1850"), parseTime("2021")]);
        initializeLineChart3(finalDataArray2, [parseTime("1989"), parseTime("2021")]);
        initializeLineChart(finalDataArray);
        // initializeMap(tempValue);
    }


    worldMap.append("g")
        .selectAll("path")
        .data(features)
        .join(
            function (enter) {
                return enter.append("path")
                    .attr("id", function (d) {
                        return d.properties.name;
                    })
                    .attr("name", function (d) {
                        return d.properties.name;
                    })
                    .attr("d", path)
                    .attr("fill", function (d, i) {
                        var co2Emission = d.details["Annual CO2 emissions"]? d.details["Annual CO2 emissions"] : 0;
                        var scaleValue = (20 * co2Emission) / maxCo2Value;
                        return colorScale(scaleValue)
                    })
                    .style("stroke", "white")
                    .style("stroke-width", 0.8)
                    .attr("transform", "translate(0, -50)")
                    .on('mouseover', handleMouseover)
                    .on('mouseout', function (d) {
                        d3.select(this)
                            .style("stroke-width", 0.8)
                            .style("stroke", "white")

                        var tempValue = d.srcElement.__data__.properties.name;
                        d3.select("#" + tempValue + "1").transition().duration(100).style("fill", "#1e99e7").style("stroke", "#1e99e7");
                    });
            },
            function (update) {

            },
            function (exit) {
                return exit.remove();
            }
        )
}