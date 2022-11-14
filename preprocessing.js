// var world, co2EmissionData;
//
// function fetchingData() {
//     d3.json("world-110m.json")
//         .then(function (world) {
//             d3.csv("annual-co2-emissions-per-country.csv").then(function (co2EmissionsRate) {
//                 this.world = world;
//                 this.co2EmissionsRate = co2EmissionsRate;
//                 preprocessing(co2EmissionsRate);
//             });
//         });
// };

function preprocessing(co2EmissionsRate, world){
    drawMap(world, co2EmissionsRate);
    drawLineChart(co2EmissionsRate, "North America");
};