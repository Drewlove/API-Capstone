'use strict'; 
/*
API Docs: https://developer.nrel.gov/docs/cleap/emissions/
Census: https://www.census.gov/data/developers/data-sets/decennial-census.html
Census Params: https://api.census.gov/data/2010/sf1/variables.html
***use "P0010001" for total population
state codes: https://www.census.gov/geo/reference/ansi_statetables.html
*** use state codes as part of stateList array of objects 

Bug: 
-User can select same state multiple times

Notes: 
-Remove "add" in front of function name for every state listener

Next Features: 
-Use checkboxes for energy types to cumulatively add up CO2 emissions

-User can see CO2 emissions per capita by making API calls to us census
--will show 3 data points, 1990, 2000, 2010

-User can see total of all 50 states CO2 emissions by energy type from 1980-2016

-User can select one state, and view a graph that charts the CO2 emissions
of each energy type. So one line for industrial, one line for commercial, etc.

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

function renderLandingPage(){
    let landingPage = 
    `<section class='landing'>
        <img alt='USA lights at night' src='https://bit.ly/2EZpU39'>
        <button id='btn-start'>START</button>
    </section>`; 
    $('main').append(landingPage)
}

function startEventListener(){
    $("#btn-start").on("click", function(){
        $(".landing").addClass("hidden"); 
        emptyMainContent(); 
        renderChartChoice(); 
    })
}

function emptyMainContent(){
    $('main').empty(); 
}

function renderChartChoice(){
    let chartChoice = 
    `<section id='page-chart-choice'>
        <section class='chart-choice-section'>
            <button id='btn-compare'>Compare States</button>
                <p class='chart-choice-p'>Compare multiple state's CO2 emissions</p>
        </section>
        <section class='chart-choice-section'>
            <button>Analyze State</button>
            <p class='chart-choice-p'>Analyze a single state's CO2 emissions</p>
        </section>
    </section>`; 
    $('main').append(chartChoice); 
    $('#btn-compare').on('click', function(){
        emptyMainContent(); 
        renderCompareStatesForm(); 
    })
}

function renderCompareStatesForm(){
    let compareStateForm = 
    `<section class'page-compare'>
    <form>
      <div id='state-container'>
        <div id='first-state' class='state'>
          <label for='state'>State:</label>
        </div>
      </div>
      <button id='add-state-btn'>+</button>
      <span>Add State</span>
      <div>
        <input type='radio' id='commercial' name='energy'>
        <label for=='commercial='>Commercial</label>
      </div>
      <div>
        <input type='radio' id='electric' name='energy'>
        <label for='electric'>Electric</label>
      </div>
      <div>
        <input type='radio' id='residential' name='energy'>
        <label for='residential'>Residential</label>
      </div>
      <div>
          <input type='radio' id='industrial' name='energy'>
          <label for='industrial'>Industrial</label>
      </div>
      <div>
          <input type='radio' id='transportation' name='energy'>
          <label for='transportation'>Transportation</label>
      </div>
      <div>
          <input type='radio' id='total' name='energy'>
          <label for='total'>Total</label>
      </div>
      <button id='submit-btn' type='submit'>Submit</button>
    </form>
    <section id='chart'></section>`;
    $('main').append(compareStateForm);
    addStateEventListener();
    addStateOptions(); 
    addSubmitEventListener(); 
}

function addStateEventListener(){
    $("#add-state-btn").on("click", function(e){
        e.preventDefault(); 
        if( $('.state').length <5){
            let newStateEntry = $("#first-state").clone().removeAttr("id"); 
            $("#state-container").append(newStateEntry);
            $('.state').last().append(`<button class='subtract-state-btn'>-</button>`)
            $(".state").last().val("");  
            subtractStateButtonListener(); 
        }
        else {
            let modalMessage = "Only 5 states allowed at a time"; 
            return renderModal(modalMessage)
        }
    })
}

function renderModal(message){
    let modal = 
    `<section class='modal'>
        <span class='modal-close'>X</span>
        <h1>${message}</h1>
    </section>
    `; 
    $('main').append(modal); 
    modalCloseListener(); 
}

function modalCloseListener(){
    $('.modal-close').on('click', function(e){
        e.preventDefault(); 
        closeModal()
    })
}


function closeModal(){
    console.log("close"); 
    $('.modal').remove(); 
}

function subtractStateButtonListener(){
    $('.subtract-state-btn').on('click', function(e){
        e.preventDefault(); 
        $(this).closest('.state').empty(); 
    })
}

function addStateOptions(){
    $("#first-state").append(`<select class='state-val' name='state'>${stateOption()}</select>`);
}

function stateOption(){
    let stateOptions = stateList.map(stateObj => {
        return `<option value=${stateObj.abbr}>${stateObj.name}</option>`
    })
    return stateOptions.join(); 
}

function addSubmitEventListener(){
    $("#submit-btn").on("click", function(e){
        e.preventDefault(); 
        let state = $(".state-val").map(function(){
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
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        fontSize: 16, 
                        fontColor: 'white'
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontSize: 16, 
                        fontColor: 'white'
                    }
                }] 
            },
            legend: {
                labels:{
                  fontSize: 18, 
                  fontColor: 'white'
                }
            }
        }
    });
    $("#chart-title").append("<div id='y-axis-label'>Million Metric Tons CO2</div>");
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
            pointBackgroundColor: 'white',
        })
    }
    return responseDataSet;
}

function launchApp(){
    renderLandingPage()
    startEventListener(); 
}

$(launchApp)