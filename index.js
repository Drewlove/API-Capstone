'use strict'; 

/*
API Docs: https://developer.nrel.gov/docs/cleap/emissions/
St. Lous Fed

Will have to change the interval type
Will depend upon the highest number on record, 
round to nearest 0 or 5 number, then divide by 10

Be able to select multiple energy types
Give each energy type its own line
See CO2 emissions per capita 
--(will have to call other API that gives state population by year)

*/

const stateList = [
    {name: "Alabama", abbr: "AL"},
    {name: "Alaska", abbr: "AK"},
    {name: "Arizona", abbr: "AZ"}, 
    {name: "Arkansas",abbr: "AR"},
    {name: "California", abbr: "CA"},
    {name: "Colorado", abbr: "CO"},
    {name: "Connecticut", abbr: "CT"},
    {name: "Delaware", abbr: "DE"},
    {name: "Florida", abbr: "FL"},
    {name: "Georgia", abbr: "GA"},
    {name: "Hawaii", abbr: "HI"},
    {name: "Idaho", abbr: "ID"},
    {name: "Illinois", abbr: "IL"},
    {name: "Indiana", abbr: "IN"},
    {name: "Iowa", abbr: "IA"},
    {name: "Kansas", abbr: "KS"},
    {name: "Kentucky", abbr: "KY"},
    {name: "Louisiana", abbr: "LA"},
    {name: "Maine", abbr: "ME"},
    {name: "Maryland", abbr: "MD"},
    {name: "Massachusetts", abbr: "MA"},
    {name: "Michigan", abbr: "MI"},
    {name: "Minnesota", abbr: "MN"},
    {name: "Mississippi", abbr: "MS"},
    {name: "Missouri", abbr: "MO"},
    {name: "Montana", abbr: "MT"},
    {name: "Nebraska", abbr: "NE"},
    {name: "Nevada", abbr: "NV"},
    {name: "New Hampshire", abbr: "NH"},
    {name: "New Jersey", abbr: "NJ"},
    {name: "New Mexico", abbr: "NM"},
    {name: "New York", abbr: "NY"},
    {name: "North Carolina", abbr: "NC"},
    {name: "North Dakota", abbr: "ND"},
    {name: "Ohio", abbr: "OH"},
    {name: "Oklahoma", abbr: "OK"},
    {name: "Oregon", abbr: "OR"},
    {name: "Pennsylvania", abbr: "PA"},
    {name: "Rhode Island", abbr: "RI"},
    {name: "South Carolina", abbr: "SC"},
    {name: "South Dakota", abbr: "SD"},
    {name: "Tennessee", abbr: "TN"},
    {name: "Texas", abbr: "TX"},
    {name: "Utah", abbr: "UT"},
    {name: "Vermont", abbr: "VT"},
    {name: "Virginia", abbr: "VA"},
    {name: "Washington", abbr: "WA"},
    {name: "West Virginia", abbr: "WV"},
    {name: "Wisconsin", abbr: "WI"},
    {name: "Wyoming", abbr: "WY"}
]

const apiKey = 'Q3oXtmNbQIEm2zNEjnbmU0OFyfRI2sgRbBQp9g8t'

function addCompareEventListener(){
    $("#compare-btn").on("click", function(){
        console.log("clicking"); 
        $(".landing").addClass("hidden"); 
        $(".page").removeClass("hidden");
        $("body").css("background-color", "white")  
    })
}

function addStateEventListener(){
    $("#add-state-btn").on("click", function(e){
        e.preventDefault(); 
        let newStateEntry = $("#first-state").clone().removeAttr("id"); 
        $("#state-container").append(newStateEntry); 
        $(".state").last().val("");      
    })
}

function addSubmitEventListener(){
    $("#submit-btn").on("click", function(e){
        e.preventDefault(); 
        let state = $(".state").map(function(){
            return $(this).val(); 
        }).get(); 
        let energyType = $("input[name=energy]:checked")[0].id; 
        fetchData(state, energyType);
    })
}

function fetchData(state, energyType){
Promise.all(getUrls(state, energyType).map(url => 
    fetch(url)
        .then(checkStatus)
        .then(parseJSON)
        .then(getDataObj)
        .catch(err => console.log(err))
    ))
    .then(data => display(data, state, energyType))
}

function getUrls(state, energyType){
    return state.map(key => {
        return `https://developer.nrel.gov/api/cleap/v1/state_co2_emissions?state_abbr=${key}&type=${energyType}&api_key=${apiKey}`;
    })  
}

function checkStatus(response){
    if(response.ok){
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText))
    }
}

function parseJSON(response){
    return response.json()
}

function getDataObj(response){
    return response.result[0]
}

function display(response, state, energyType){ 
    resetCanvas(energyType, state);  
    let responseData = response[0].data; 
    var ctx = document.getElementById('chart-canvas').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(responseData),
            datasets: createDataSet(state, response),
        },
    });
    $("#chart-title").append("<div id='y-axis-label'>Million Metric Tons CO2</div>")
}

function resetCanvas(energyType, state){
    clearChart(); 
    createChart();
    createTitle(energyType, state); 
}

function clearChart(){
    $("#chart").empty(); 
}

function createChart(){
    $("#chart").append("<div id='chart-title'></div><canvas id='chart-canvas'></canvas>")
}

function createTitle(energyType, state){
    let title = `${energyType.charAt(0).toUpperCase() + energyType.slice(1)} Carbon Dioxide Emissions: ${state.join(", ")}`;
    $("#chart-title").append(`<h3>${title}</h3>`); 
}

function createDataSet(state, response){
    let responseDataSet = [];
    let lineColors = ["#4286f4", "#f44141", "#3ea84c", "#eaea19", "#ffa100"];
    for(let i=0; i<state.length; i++){
        let responseData = response[i].data; 
        responseDataSet.push({
            label: `${state[i]}`, 
            fill: false, 
            borderColor: lineColors[i],
            data: Object.values(responseData).map(dataPoint => dataPoint.toFixed(3)),
            pointBackgroundColor: lineColors[i],
            pointBorderWidth: 1
        })
    }
    return responseDataSet;
}

function addStateOptions(){
    $("#first-state").append(`<select class='state' name='state'>${stateSelect()}</select>`);
}

function stateSelect(){
    let stateOptions = stateList.map(stateObj => {
        return `<option value=${stateObj.abbr}>${stateObj.name}</option>`
    })
    return stateOptions.join(); 
}

function launchApp(){
    addCompareEventListener(); 
    addStateEventListener();
    addSubmitEventListener();
    addStateOptions(); 
}

$(launchApp)