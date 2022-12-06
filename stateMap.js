var features, countryMap, path, width, height;

function initializeMap(country){

    // plot the map
    var projection = d3.geoMercator()
        .scale(1)
        .translate([0, 0]);

    path = d3.geoPath().projection(projection);

    var ut = topojson.feature(world, world.objects.countries);

    console.log(ut)
    let b = path.bounds(ut),
        s = 5 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
        t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

    console.log(b)
    //Update the projection to use computed scale & translate.
    projection
        .scale(s)
        .translate(t);

    features = ut.features;

    // ploting the points to draw a map
    countryMap
        .selectAll("path")
        .data(features)
        .join(
            function (enter) {
                return enter.append("path")
                    .attr("id", function (d) {
                        // return d.properties.name.replaceAll(" ", "").toLowerCase();
                    })
                    .attr("name", function (d) {
                        // return d.properties.name.replaceAll(" ", "").toLowerCase();
                    })
                    .attr("d", path)
                    .attr("fill", function (d, i) {
                        return "#8B7E74";
                    })
                    .style("stroke", "white")
                    .style("stroke-width", 1)
                    .attr("transform", `translate(0, ${height + 250})`)
            },
            function (update) {
                return update.transition().duration(150)
                    .attr("id", function (d) {
                        return d.properties.name.replaceAll(" ", "").toLowerCase();
                    })
                    .attr("name", function (d) {
                        return d.properties.name.replaceAll(" ", "").toLowerCase();
                    })
                    .attr("d", path);
            },
            function (exit) {
                return exit.remove();
            }
        )
}
function drawMap1(world, country) {
    countryMap = worldMap.append("g").attr("transform", "translate(250, 0)");

    width = document.getElementById("mainMapChart").offsetWidth / 3;
    height = document.getElementById("mainMapChart").offsetHeight / 3;


    initializeMap(country);
}