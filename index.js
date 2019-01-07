'use strict';
/*
*** data of gdp by state, 1997-2016
https://www.eia.gov/state/seds/sep_use/notes/use_gdp.pdf
BEA Data API: A1E0048C-FE51-40B6-B0BE-F8D7D58C1549

API Call to get each state's GDP from 1997-2016: 
https://apps.bea.gov/api/data/?UserID=A1E0048C-FE51-40B6-B0BE-F8D7D58C1549&method=GetData&datasetname=Regional&TableName=SAGDP2N&LineCode=1&Year=ALL&GeoFips=STATE&ResultFormat=json
TableName is what determines what economic data you are retrieving
For a list of tables see: 
Appendix N
page 1 of 9; 



incorporate feedback
-Add an X, so you can close a graph once it's been generated
-Add titles\directions at the head of the state inputs and the 
energy type inputs. Need to more clearly communicate to user
what those inputs are for. 


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



/*

On submit: 
Empty main content
then render chart

add an X that when clicked closes the chart and returns user to form
where they can choose states and energy type

Firebase GDP data

*/

const stateListMaster = [
    { name: "Alabama", abbr: "AL" },
    { name: "Alaska", abbr: "AK" },
    { name: "Arizona", abbr: "AZ" },
    { name: "Arkansas", abbr: "AR" },
    { name: "California", abbr: "CA" },
    { name: "Colorado", abbr: "CO" },
    { name: "Connecticut", abbr: "CT" },
    { name: "Delaware", abbr: "DE" },
    { name: "Florida", abbr: "FL" },
    { name: "Georgia", abbr: "GA" },
    { name: "Hawaii", abbr: "HI" },
    { name: "Idaho", abbr: "ID" },
    { name: "Illinois", abbr: "IL" },
    { name: "Indiana", abbr: "IN" },
    { name: "Iowa", abbr: "IA" },
    { name: "Kansas", abbr: "KS" },
    { name: "Kentucky", abbr: "KY" },
    { name: "Louisiana", abbr: "LA" },
    { name: "Maine", abbr: "ME" },
    { name: "Maryland", abbr: "MD" },
    { name: "Massachusetts", abbr: "MA" },
    { name: "Michigan", abbr: "MI" },
    { name: "Minnesota", abbr: "MN" },
    { name: "Mississippi", abbr: "MS" },
    { name: "Missouri", abbr: "MO" },
    { name: "Montana", abbr: "MT" },
    { name: "Nebraska", abbr: "NE" },
    { name: "Nevada", abbr: "NV" },
    { name: "New Hampshire", abbr: "NH" },
    { name: "New Jersey", abbr: "NJ" },
    { name: "New Mexico", abbr: "NM" },
    { name: "New York", abbr: "NY" },
    { name: "North Carolina", abbr: "NC" },
    { name: "North Dakota", abbr: "ND" },
    { name: "Ohio", abbr: "OH" },
    { name: "Oklahoma", abbr: "OK" },
    { name: "Oregon", abbr: "OR" },
    { name: "Pennsylvania", abbr: "PA" },
    { name: "Rhode Island", abbr: "RI" },
    { name: "South Carolina", abbr: "SC" },
    { name: "South Dakota", abbr: "SD" },
    { name: "Tennessee", abbr: "TN" },
    { name: "Texas", abbr: "TX" },
    { name: "Utah", abbr: "UT" },
    { name: "Vermont", abbr: "VT" },
    { name: "Virginia", abbr: "VA" },
    { name: "Washington", abbr: "WA" },
    { name: "West Virginia", abbr: "WV" },
    { name: "Wisconsin", abbr: "WI" },
    { name: "Wyoming", abbr: "WY" }
]

const apiKey = 'Q3oXtmNbQIEm2zNEjnbmU0OFyfRI2sgRbBQp9g8t'

function launchApp() {
    renderLandingPage();
    startEventListener();
}

function renderLandingPage() {
    let landingPage =
        `<section class='landing'>
        <img alt='USA lights at night' src='https://bit.ly/2EZpU39'>
        <button>START</button>
    </section>`;
    $('main').append(landingPage)

}

function startEventListener() {
    $(".landing button").on("click", function () {
        $(".landing").addClass("hidden");
        emptyMainContent();
        renderChartChoice();
        compareEventListener();
    })
}

function emptyMainContent() {
    $('main').empty();
}

function renderChartChoice() {
    $('main').append(chartChoice);
}

function chartChoice(){
    return `<section id='page-chart-choice'>
            <section class='compare'>
            <button>Compare</button>
                    <p class='chart-choice-p'>Compare multiple state's CO2 emissions</p>
            </section>
            <section class='analyze-choice'>
                <button>Analyze State</button>
                <p class='chart-choice-p'>Analyze a single state's CO2 emissions</p>
            </section>
            </section>`
        } 

function compareEventListener() {
    $(".compare button").on("click", function () {
        emptyMainContent();
        renderCompareStatesForm();
    })
}

function renderCompareStatesForm() {
    let compareStateForm =
        `<section id='page-compare'>
    <form>
    <fieldset>
    <legend>Select States to Compare</legend>
      <div id='state-container'>
        <div id='first-state' class='state'>
          <label for='state'>State:</label>
        </div>
      </div>
      <button id='add-state-btn'>+</button>
      <span>Add State</span>
      </fieldset>
      <fieldset>
      <legend>Choose CO<sub>2</sub> Emissions by Energy Type</legend>
      ${renderEnergyInputs()}
      </fieldset>
      <button id='submit-btn' type='submit'>Submit</button>
    </form>`

    $('main').append(compareStateForm);
    addStateEventListener();
    addStateOptions();
    submitEventListener();
}

function renderEnergyInputs() {
    let energyTypes = ["commercial", "electric", "residential", "industrial", "transportation", "total"];
    return energyTypes.map(energy => {
        return (
            `<div>
            <input type='checkbox' data-energy=${energy} name="energy"}>
            <label for=${energy}>${capitalize(energy)}</label>  
        </div>`
        )
    })
    .join("");
}

function capitalize(elem) {
    return elem.charAt(0).toUpperCase() + elem.slice(1)
}

function addStateEventListener() {
    $("#add-state-btn").on("click", function (e) {
        e.preventDefault();
        if ($('.state').length < 5) {
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

function addStateOptions() {
    $("#first-state").append(`<select class='state-val' name='state'>${stateOption()}</select>`);
}

function renderModal(message) {
    let modal =
        `<section class='modal'>
        <span class='modal-close'>X</span>
        <h1>${message}</h1>
    </section>
    `;
    $('main').append(modal);
    modalCloseListener();
}

function modalCloseListener() {
    $('.modal-close').on('click', function (e) {
        e.preventDefault();
        closeModal()
    })
}

function closeModal() {
    console.log("close");
    $('.modal').remove();
}

function subtractStateButtonListener() {
    $('.subtract-state-btn').on('click', function (e) {
        e.preventDefault();
        $(this).closest('.state').remove();
    })
}

function stateOption() {
    let stateOptions = stateListMaster.map(stateObj => {
        return `<option value=${stateObj.abbr}>${stateObj.name}</option>`
    })
    return stateOptions.join();
}

function submitEventListener() {
    $("#submit-btn").on("click", function (e) {
        e.preventDefault();
        getFormData(getStates(), getEnergyTypes()); 
    })
}

function getStates(){
    return $(".state-val").map(function () {
        return $(this).val();
    }).get();
}

function getEnergyTypes(){
    let checkedEnergyTypes = []; 
    $.each($("input[name='energy']:checked"), function () {
        let energyType = $(this).data("energy");
        checkedEnergyTypes.push(energyType);
    });
    return checkedEnergyTypes; 
}

function getFormData(checkedStates, checkedEnergyTypes) {
    Promise.all(fetchData(checkedStates, checkedEnergyTypes))
        .then(function (dataSet) {
            renderChart(dataSet, checkedStates, checkedEnergyTypes);
            checkedEnergyTypes = [];
        })
}

function fetchData(checkedStates, checkedEnergyTypes) {
    return checkedStates.map(state => {
        return Promise.all(getUrls(state, checkedEnergyTypes).map(url =>
            fetch(url)
                .then(checkStatus)
                .then(parseJSON)
                .then(getDataObj)
                .catch(err => console.log(err))
        ))
            .then(data => sumCO2EmissionsTotal(data))
    })
}

function getUrls(state, checkedEnergyTypes) {
    return checkedEnergyTypes.map(energyType => {
        return `https://developer.nrel.gov/api/cleap/v1/state_co2_emissions?state_abbr=${state}&type=${energyType}&api_key=${apiKey}`;
    })
}

function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText))
    }
}

function parseJSON(response) {
    return response.json()
}

function getDataObj(response) {
    return response.result[0]
}

function renderChart(response, checkedStates, checkedEnergyTypes) {
    console.log("render chart", checkedEnergyTypes)
    renderCanvas(checkedEnergyTypes);
    let responseData = response[0];
    var ctx = document.getElementById('chart-canvas').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(responseData),
            datasets: createDataSet(response, checkedStates, checkedEnergyTypes),
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
                labels: {
                    fontSize: 18,
                    fontColor: 'white'
                }
            },
            layout: {
                padding: {
                    left: 10
                }
            }
        }
    });
}

function renderCanvas(checkedEnergyTypes) {
    emptyMainContent();
    $('main').append(energyTypeContent(checkedEnergyTypes))
    $('main').append(`<section id='chart'></section>`);
    $("#chart").append(canvasContent());
    closeChartEventListener(); 
}

function energyTypeContent(checkedEnergyTypes){
    return  `<h2>Energy Types: ${checkedEnergyTypes.map(energy => capitalize(energy)).join(", ")}</h2>`
}

function canvasContent(checkedEnergyTypes){
    return `<div id='chart-title'>
                <div id='y-axis-label'>CO<span><sub>2</sub></span> Emissions (million metric tons)
                </div>
                <div>
                <span id='close-chart' class='modal-close'>X</span>
                </div>
            </div>
            <canvas id='chart-canvas'></canvas>`
}

function closeChartEventListener(){
    $("#close-chart").on("click", function(){
        emptyMainContent(); 
        renderCompareStatesForm(); 
    })
}

function createDataSet(response, checkedStates, checkedEnergyTypes) {
    let lineColors = ["#4286f4", "#f44141", "#3ea84c", "#eaea19", "#ffa100"];
    let responseDataSet = [];
    for (let i = 0; i < checkedStates.length; i++) {
        responseDataSet.push({
            label: `${checkedStates[i]}`,
            fill: false,
            borderColor: lineColors[i],
            data: Object.values(response[i]),
            pointBackgroundColor: 'white',
        })
    }
    return responseDataSet;
}

function sumCO2EmissionsTotal(response) {
    let co2EmissionObj = {};
    Object.keys(response[0].data).forEach(year => {
        return co2EmissionObj[year] = sumCO2EmissionsYear(response, year)
    })
    return co2EmissionObj
}

function sumCO2EmissionsYear(response, year) {
        let sum = 0;
        response.forEach(energyType => {
            sum += energyType.data[year]
        })
        return sum.toFixed(3)
    }


$(launchApp)