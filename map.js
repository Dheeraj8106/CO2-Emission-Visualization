function drawMap(world, co2EmissionRate) {
    var width = document.getElementById("mainMapChart").offsetWidth - 100,
        height = 300;

    var svg = d3.select("#mainMapChart")
        .append("svg")
        .style("cursor", "move");

    svg.attr("viewBox", "10 5 " + width + " " + (height + 200))
        .attr("preserveAspectRatio", "xMinYMin");

    var worldMap = svg.append("g")
        .attr("class", "map");

    let colors = ["#3D8361" ,"#CFB997" ,"#E14D2A" ,"#61764B" ,"#FD841F"];
    let fillRange = [];
    let legendWidth = 180;
    let legendHeight = 20;
    var max = 80;
    var min = -20;

    // var zoom = d3.zoom()
    //     .on("zoom", function () {
    //         var transform = d3.zoomTransform(this);
    //         worldMap.attr("transform", transform);
    //     });
    //
    // svg.call(zoom);

    var projection = d3.geoMercator()
        .scale(130)
        .translate([width / 2, height / 1.5]);

    var path = d3.geoPath(projection);

    var features = topojson.feature(world, world.objects.countries).features;

    function findCountry(countryName){
        co2EmissionRate.forEach(function (d){
            // console.log(d.Entity + "a")
            // console.log(countryName + "b")
            // console.log(d.Entity.trim(), countryName.trim())
            if(d.Entity.trim() === countryName.trim() && d.Year === "2021" || (d.Entity.trim() === "North America" && countryName.trim() === "United States of America" && d.Year === "2021")){
                return d
            }
        });
    }

    // console.log(features)
    // console.log(co2EmissionRate)

    features.forEach(function (feature){
        // console.log(d.properties.name)
        var countryName = feature.properties.name;
        co2EmissionRate.forEach(function (d){
            // console.log(d.Entity + "a")
            // console.log(countryName + "b")
            // console.log(d.Entity.trim(), countryName.trim())
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

    let legend = svg.selectAll(".legend").data(colors).enter().append("g").attr("transform", "translate(250,400)")

    legend.append("rect").attr("width", legendWidth/colors.length).attr("height", legendHeight).style("fill", d=>d)
        .attr("x", (d,i)=> legendWidth/colors.length * i)


    svg.append("g").attr("class", "axis")
        .attr("transform", "translate(250,420)")
        .call(legendaxis);


    worldMap.append("g")
        .selectAll("path")
        .data(features)
        .join(
            function (enter) {
                return enter.append("path")
                    .attr("id", function (d) {
                        return d.properties.name;
                        // console.log(d.properties);
                    })
                    .attr("name", function (d) {
                        // return d.properties.NAME.replaceAll(" ", "");
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
                    .on('mouseover', function (d) {
                        d3.select(this)
                            .style("stroke", "black")
                            .style("stroke-width", 2)
                            .style("cursor", "pointer")

                        var tempValue = d.srcElement.__data__.properties.name;
                        d3.select("#" + tempValue + "1").transition().duration(100).style("fill", "#FF731D").style("stroke", "black").style("stroke-width", "3");
                    })
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