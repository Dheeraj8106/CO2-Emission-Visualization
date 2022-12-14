var world, state, co2EmissionData, finalDataArray = [], finalDataArray1 = [], finalDataArray2 = [], dataDict = {}, dataDict1 = {}, dataDict2 = {}, ozoneData, fossilFuelData, co2GdpPerCapita;
function fetchingData() {
    d3.json("dataset/world-110m.json")
        .then(function (world) {
            d3.csv("dataset/annual-co2-emissions-per-country.csv").then(function (co2EmissionsRate) {
                d3.csv("dataset/ozone-depleting-substance-consumption.csv").then(function (ozoneData) {
                    d3.csv("dataset/global-co2-fossil-plus-land-use.csv").then(function (fossilFuelData) {
                            d3.csv("dataset/co2-emissions-and-gdp-per-capita.csv").then(function (co2GdpPerCapita){
                                this.co2GdpPerCapita = co2GdpPerCapita;
                                this.state = state;
                                this.world = world;
                                this.co2EmissionData = co2EmissionsRate;
                                this.ozoneData = ozoneData
                                this.fossilFuelData = fossilFuelData;
                                this.co2GdpPerCapita = co2GdpPerCapita;
                                preprocessing(co2EmissionData, world);
                            })
                        })
                    });
                });
            });
};

function prepareFinalArrayForLineChart3(country){
    var dataArray1 = [];
    finalDataArray2 = [];

    if(co2GdpPerCapita){
        co2GdpPerCapita.forEach(function (d) {
            if (d.Entity === country) {
                dataArray1.push(d);
            }
        });

        for (let idx = 0; idx < dataArray1.length; idx++) {
            var year = new Date(dataArray1[idx].Year).getFullYear();
            dataDict2[year] = [dataArray1[idx]["GDP per capita"] === ""? 0:dataArray1[idx]["GDP per capita"], dataArray1[idx]["Annual CO2 emissions"] === ""? 0: dataArray1[idx]["Annual CO2 emissions"], dataArray1[idx]["Annual consumption-based CO2 emissions"] === ""? 0:dataArray1[idx]["Annual consumption-based CO2 emissions"]]
        };

        for (key in dataDict2) {
            finalDataArray2.push({'key': key, 'value': dataDict2[key]})
        };
    }
    console.log(finalDataArray2)
    return finalDataArray2
}

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

function getOzoneData(country){
    var tempOzoneData = []
    ozoneData.forEach(function (d){
        if(d["Entity"] === country){
            if(d["Consumption of Ozone-Depleting Substances - Chlorofluorocarbons (CFCs)"][0] === "-"){
                tempOzoneData.push({
                    name: d["Entity"],
                    year: d["Year"],
                    value: d["Consumption of Ozone-Depleting Substances - Chlorofluorocarbons (CFCs)"].slice(1)
                });
            }
            else {
                tempOzoneData.push({
                    name: d["Entity"],
                    year: d["Year"],
                    value: d["Consumption of Ozone-Depleting Substances - Chlorofluorocarbons (CFCs)"] != "" ? d["Consumption of Ozone-Depleting Substances - Chlorofluorocarbons (CFCs)"]: "0"
                });
            }
        }
    })
    return tempOzoneData;
}

function preprocessing(co2EmissionsData, world){
    drawMap(world, co2EmissionsData);
    // drawMap1(world, "United States");
    var finalDataArray = prepareFinalArrayForLineChart("United States");
    drawLineChart3(prepareFinalArrayForLineChart3("United States"));
    drawLineChart(finalDataArray);
    drawAreaChart(getOzoneData("United States"));
    drawLineChart2(prepareFinalArrayForLineChart2("United States"));
    // drawLineChart4()
};

function startLineYearLap(chart, time){
    var limit = 0;
    if(chart === "lineChart") {
        limit = 281;
    }
    else if(chart === "areaChart"){
        limit = 90;
    }
    else if(chart === "lineChart2") {
        limit = 171;
    }
    else if(chart === "lineChart3") {
        limit = 90;
    }


    for (let i=0; i <= limit; i++) {
        task(i);
    }

    function task(i) {
        setTimeout(function () {
            if(chart === "lineChart"){
                initializeLineChart(finalDataArray, [parseTime("1749"), parseTime((parseInt("1749") +  i).toString())]);
            }
            else if(chart === "lineChart2"){
                initializeLineChart2(finalDataArray1, [parseTime("1850"), parseTime((parseInt("1850") +  i).toString())]);
            }
            else if(chart === "lineChart3"){
                initializeLineChart3(finalDataArray2, [parseTime("1989"), parseTime((parseInt("1989") +  i).toString())]);
            }
            else if(chart === "areaChart"){
                initializeAreaChart(getOzoneData("United States"), [parseTime("1989"), parseTime((parseInt("1989") +  i).toString())])
            }
        }, time * i);
    }
}

// startLineYearLap("areaChart", 200);
// startLineYearLap("lineChart", 100);
// startLineYearLap("lineChart2", 100);
// startLineYearLap("lineChart3", 300);