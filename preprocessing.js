var world, state, co2EmissionData, finalDataArray = [], finalDataArray1 = [], dataDict = {}, dataDict1 = {}, ozoneData, fossilFuelData;
function fetchingData() {
    d3.json("world-110m.json")
        .then(function (world) {
            d3.csv("annual-co2-emissions-per-country.csv").then(function (co2EmissionsRate) {
                d3.csv("ozone-depleting-substance-consumption.csv").then(function (ozoneData) {
                    d3.csv("global-co2-fossil-plus-land-use.csv").then(function (fossilFuelData) {
                        d3.json("TX-48-texas-counties.json").then(function (state) {
                            this.state = state;
                            this.world = world;
                            this.co2EmissionData = co2EmissionsRate;
                            this.ozoneData = ozoneData
                            this.fossilFuelData = fossilFuelData;
                            preprocessing(co2EmissionData, world);
                        })
                    });
                });
            });
        });
};

function prepareFinalArrayForLineChart2(country){
    var dataArray1 = [];
    finalDataArray1 = [];

    if(fossilFuelData){
        fossilFuelData.forEach(function (d) {
            if (d.Entity === country) {
                dataArray1.push(d);
            }
        });

        for (let idx = 0; idx < dataArray1.length; idx++) {
            var year = new Date(dataArray1[idx].Year).getFullYear();
            dataDict1[year] = [dataArray1[idx]["Annual CO2 emissions"][0] === "-"? dataArray1[idx]["Annual CO2 emissions"].slice(1):dataArray1[idx]["Annual CO2 emissions"], dataArray1[idx]["Annual CO2 emissions from land-use change"][0] === "-"? dataArray1[idx]["Annual CO2 emissions from land-use change"].slice(1):dataArray1[idx]["Annual CO2 emissions from land-use change"], dataArray1[idx]["Annual CO2 emissions including land-use change"][0] === "-"? dataArray1[idx]["Annual CO2 emissions including land-use change"].slice(1):dataArray1[idx]["Annual CO2 emissions including land-use change"]]
        };

        for (key in dataDict1) {
            finalDataArray1.push({'key': key, 'value': dataDict1[key]})
        };
    }

    return finalDataArray1
}

function prepareFinalArrayForLineChart(country){
    var dataArray = [];

    finalDataArray = [];

    if(co2EmissionData){
        co2EmissionData.forEach(function (d) {
            if (d.Entity === country) {
                dataArray.push(d);
            }
        });


        for (let idx = 0; idx < dataArray.length; idx++) {
            var year = new Date(dataArray[idx].Year).getFullYear();
            dataDict[year] = dataArray[idx]["Annual CO2 emissions"];
        }


        for (key in dataDict) {
            finalDataArray.push({'key': key, 'value': dataDict[key]})
        }
    }

    return finalDataArray;
}

// function callInitializeLineChart(country){
//     finalDataArray = prepareFinalArrayForLineChart(country);
//     initializeLineChart(finalDataArray);
// }

function getOzoneData(country){
    var tempOzoneData = []
    ozoneData.forEach(function (d){
        if(d["Entity"] === country){
            if(d["Consumption of Ozone-Depleting Substances - Methyl Chloroform"][0] === "-"){
                tempOzoneData.push({
                    name: d["Entity"],
                    year: d["Year"],
                    value: d["Consumption of Ozone-Depleting Substances - Methyl Chloroform"].slice(1)
                });
            }
            else {
                tempOzoneData.push({
                    name: d["Entity"],
                    year: d["Year"],
                    value: d["Consumption of Ozone-Depleting Substances - Methyl Chloroform"] != "" ? d["Consumption of Ozone-Depleting Substances - Methyl Chloroform"]: "0"
                });
            }
        }
    })
    return tempOzoneData;
}

function preprocessing(co2EmissionsData, world){
    drawMap(world, co2EmissionsData);
    drawMap1(state);
    var finalDataArray = prepareFinalArrayForLineChart("United States");
    drawLineChart(finalDataArray);
    drawAreaChart(getOzoneData("United States"));
    drawLineChart2(prepareFinalArrayForLineChart2("United States"));
};

function startLineYearLap(chart, time){
    var limit = 0;
    if(chart === "lineChart") {
        limit = 281;
    }
    else if(chart === "areaChart"){
        limit = 24;
    }


    for (let i=0; i <= limit; i++) {
        task(i);
    }

    function task(i) {
        setTimeout(function () {
            if(chart === "lineChart"){
                initializeLineChart(finalDataArray, [parseTime("1740"), parseTime((parseInt("1740") +  i).toString())]);
            }
            else if(chart === "lineChart2"){
                initializeLineChart2(finalDataArray, [parseTime("1740"), parseTime((parseInt("1740") +  i).toString())]);
            }
            else if(chart === "areaChart"){
                initializeAreaChart(getOzoneData("United States"), [parseTime("1989"), parseTime((parseInt("1989") +  i).toString())])
            }
        }, time * i);
    }
}

// startLineYearLap("areaChart", 200);
// startLineYearLap("lineChart", 10);