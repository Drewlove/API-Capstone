'use strict';

const stateListMaster = {
    Alabama: { name: "Alabama", abbr: "AL" },
    Alaska: {name: "Alaska", abbr: "AK" },
    Arizona: { name: "Arizona", abbr: "AZ" },
    Arkansas: {name: "Arkansas", abbr: "AR" },
    California: {name: "California", abbr: "CA"},
    Colorado: {name: "Colorado", abbr: "CO"},
    Connecticut: {name: "Connecticut", abbr: "CT"},
    Delaware: {name: "Delaware", abbr: "DE"},
    Florida: {name: "Florida", abbr: "FL" },
    Georgia: {name: "Georgia", abbr: "GA"},
    Hawaii: {name: "Hawaii", abbr: "HI"},
    Idaho: {name: "Idaho", abbr: "ID"},
    Illinois: {name: "Illinois", abbr: "IL"},
    Indiana: {name: "Indiana", abbr: "IN"},
    Iowa: {name: "Iowa", abbr: "IA"},
    Kansas: {name: "Kansas", abbr: "KS"},
    Kentucky: {name: "Kentucky", abbr: "KY"},
    Louisana: {name: "Louisana", abbr: "LA"},
    Maine: {name: "Maine", abbr: "ME"},
    Maryland: {name: "Maryland", abbr: "MD"},
    Masschusetts: {name: "Massachusetts", abbr: "MA"},
    Michigan: {name: "Michigan", abbr: "MI"},
    Minnesota: {name: "Minnesota", abbr: "MN"},
    Mississippi: {name: "Mississippi", abbr: "MS"},
    Missouri: {name: "Missouri", abbr: "MO"},
    Montana: {name: "Montana", abbr: "MT"},
    Nebraska: {name: "Nebraska", abbr: "NE"},
    Nevada: {name: "Nevada", abbr: "NV"},
    NewHampshire: {name: "New Hampshire", abbr: "NH"},
    NewJersey: {name: "New Jersey", abbr: "NJ"},
    NewMexico: {name: "New Mexico", abbr: "NM"},
    NewYork: {name: "New York", abbr: "NY"},
    NorthCarolina: {name: "North Carolina", abbr: "NC"},
    NorthDakota: {name: "North Dakota", abbr: "ND"},
    Ohio: {name: "Ohio", abbr: "OH"},
    Oklahoma: {name: "Oklahoma", abbr: "OK"},
    Oregon: {name: "Oregon", abbr: "OR"},
    Pennsylvania: {name: "Pennsylvania", abbr: "PA"},
    RhodeIsland: {name: "Rhode Island", abbr: "RI"},
    SouthCarolina: {name: "South Carolina", abbr: "SC"},
    SouthDakota: {name: "South Dakota", abbr: "SD"},
    Tennessee: {name: "Tennessee", abbr: "TN"},
    Texas: {name: "Texas", abbr: "TX"},
    Utah: {name: "Utah", abbr: "UT"},
    Vermont: {name: "Vermont", abbr: "VT"},
    Virginia: {name: "Virginia", abbr: "VA"},
    Washington: {name: "Washington", abbr: "WA"},
    WestVirginia: {name: "West Virginia", abbr: "WV"},
    Wisconsin: {name: "Wisconsin", abbr: "WI"},
    Wyoming: {name: "Wyoming", abbr: "WY"}
}

//if user picks multiple energy types, then it combines all those energy types
//Include a more clear phrasing in the graph that specifies this. 
//"Combined Total of CO2 Emissions for...[insert energy types here]"
//

//if you "check off" both states after you've clicked for the graph
//you get a -1 to 1 

//once you're in GDP view you should be able to click to go back to CO2 emissions 
//graph 

//For energy types, if you click total, it should uncheck all of the others 
//you can't click total, AND other energy types 
//or just eliminate the "total" option 

//if user has selected same states, and then clicks submit, issue a warning that they
//cannot choose the same state multiple times


// final polish make sure syntax and indentation is the same
// look at functions and variables, limit global variables
// name clearly indicates what function does, function does a single thing
//          what about functions that need multiple functions?
// every function should take an argument (pure functions)
// the function should require a known input, otherwise it's likely 
// to create bugs
// each function should return a value, which makes it clear
// where the function ends, even if you're just returning a function

//try to make a function not span more than 5-10 lines of code

//redo event listeners, have onClick, then name the function
//that should be performed

const apiKey = 'Q3oXtmNbQIEm2zNEjnbmU0OFyfRI2sgRbBQp9g8t';
const stateGdpApiKey = 'A1E0048C-FE51-40B6-B0BE-F8D7D58C1549';

let globalState = {}


//Utility Functions
function capitalize(elem) {
    return elem.charAt(0).toUpperCase() + elem.slice(1)
}

function getStateAbbr(obj){
    return obj.geography.slice(4)
}

function getEnergyType(obj){
    let energyType = obj.name.split(' ')[0];  
    return lowerCase(energyType)
}

function lowerCase(word){
    return word.charAt(0).toLowerCase() + word.slice(1); 
}

//Launch Application
function launchApp() {
    renderLandingPage();
}

function renderLandingPage() {
    let landingPage =
        `<section class='landing'>
        <img alt='USA lights at night' src='https://bit.ly/2EZpU39'>
        <button class='light-button'>START</button>
    </section>`;
    $('main').append(landingPage)
    startEventListener();
}

function startEventListener() {
    $(".landing button").on("click", function () {
        $(".landing").addClass("hidden");
        emptyMainContent();
        renderCompareStatesForm();
    })
}

function emptyMainContent() {
    $('main').empty();
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
          <select class='state-val' name='state'>${getStateOptions()}</select>      
        </div>
      </div>
      <button id='add-state-btn' class='light-button'>+</button>
      <span>Add State</span>
      </fieldset>
      <fieldset>
      <legend>Choose CO<sub>2</sub> Emissions by Energy Type</legend>
      ${renderEnergyInputs()}
      </fieldset>
      <button id='submit-btn' type='submit' class='light-button'>Submit</button>
    </form>`
    $('main').append(compareStateForm); 
    backgroundGradient(); 
    addStateEventListener(); 
    totalEnergyEventListener(); 
    submitEventListener();
    instantiateGlobalStateFetchedData(); 
}

function instantiateGlobalStateFetchedData(){
    globalState.fetchedData = []; 
}

function getStateOptions() {
    let stateNames = Object.keys(stateListMaster); 
    return stateNames.map(key => {
        return `<option value=${key.toString()}>${stateListMaster[key].name}</option>`
    }).join("");
}

function renderEnergyInputs() {
    globalState.energyTypes = []; 
    let energyTypes = ["commercial", "electric", "residential", "industrial", "transportation", "total"];
    return energyTypes.map(energy => {
        return energyInput(energy); 
    }).join("");
}

function energyInput(energy){
    return `<div>
    <input id=${energy}-energy type='checkbox' data-energy=${energy} name="energy" class="energy-input"}>
    <label for=${energy}>${capitalize(energy)}</label>  
</div>`
}


function backgroundGradient(){
    $('body').addClass('background-gradient'); 
}

function updateGlobalStateTotalEnergy(){
    $('.energy-input').each(function (){
        if($(this).prop("checked") === true){
            return $(this).prop("checked", false)
        }      
    })
    $('#total-energy').prop("checked", true)
    globalState.energyTypes = ["total"]
}

function addStateEventListener() {
    $("#add-state-btn").on("click", function (e) {
        e.preventDefault();
        if ($('.state').length < 5) {
            addState(); 
        } else {
            let modalMessage = "Only 5 states allowed at a time";
            return renderModal(modalMessage)
        }
    })
}

function addState(){
    let newStateEntry = $("#first-state").clone(true).removeAttr("id");
    $("#state-container").append(newStateEntry)
    let newStateName = $('.state').last().find('.state-val').val(); 
    $('.state').last().append(`<button class='remove-state-btn light-button'>-</button>`)
    removeStateEventListener(); 
}

function removeStateEventListener(){
    $('.state').last().find('.remove-state-btn').on('click', function(e){
        e.preventDefault;
        let self = $(this).closest('.state').remove(); 
    }) 
}

function totalEnergyEventListener(){
          $(".energy-input").on("click", function(){
              if($(this).attr("id") !== "total-energy"){
                  $("#total-energy").prop("checked", false)
            } else if($(this).attr("id") === "total-energy"){
                $(".energy-input").prop("checked", false)
                $("#total-energy").prop("checked", true)
            }
          })
}

function renderModal(message) {
    toggleOpaque(); 
    let modal =
        `<section class='modal'>
        <span class='modal-close'>X</span>
        <h1>${message}</h1>
    </section>
    `;
    $('body').append(modal);
    modalCloseListener();
}

function toggleOpaque(){
    $('main').toggleClass('opaque')
}

function modalCloseListener() {
    $('.modal-close').on('click', function (e) {
        e.preventDefault();
        toggleOpaque(); 
        closeModal()
    })
}

function closeModal() {
    $('.modal').remove();
}

function submitEventListener() {
    $("#submit-btn").on("click", function (e) {
        e.preventDefault(); 
        verifyStateSelection();
    })
}

function verifyStateSelection(){
    updateGlobalStateStates(); 
    let statesList = globalState.statesList; 
    let deDupeStatesList = []; 
    statesList.forEach(state => {
        if(deDupeStatesList.indexOf(state) === -1){
            deDupeStatesList.push(state)
        } 
    })
    if(deDupeStatesList.length === statesList.length){
        verifyEnergyTypeSelection();
    }
    else {
        renderModal("You cannot choose the same state multiple times")
    }
}

function updateGlobalStateStates(){
    globalState.statesList = []; 
    globalState.statesList =  $(".state-val").map(function () {
        return $(this).val();
    }).get();
}

function verifyEnergyTypeSelection(){
    updateGlobalStateEnergyType();
    if(globalState.energyTypes.length === 0){
        return renderModal("You must select at least one energy type")
    } else {
        getFormData(globalState.statesList, globalState.energyTypes); 
        updateGlobalStateFetchedData("totalCO2emissions") 
    }
}

function updateGlobalStateEnergyType(){
    globalState.energyTypes = []; 
    $.each($("input[name='energy']:checked"), function () {
        let energyType = $(this).data("energy");
        globalState.energyTypes.push(energyType);
    });
}

function getFormData(checkedStates, checkedEnergyTypes) {
    Promise.all(getPromises(checkedStates, checkedEnergyTypes))
    .then(formatResponse)
    .then(response => updateGlobalState(response, checkedStates, checkedEnergyTypes))
    .then(updateGlobalStateTotalCO2)
    .then(renderChart)
    .catch(error => console.log("error is", error))
}

function getPromises(checkedStates, checkedEnergyTypes){
    const urlList = []; 
    checkedStates.forEach(state => {
        let stateAbbr = stateListMaster[state].abbr;
        checkedEnergyTypes.map(energyType => {
            return urlList.push(`https://developer.nrel.gov/api/cleap/v1/state_co2_emissions?state_abbr=${stateAbbr}&type=${energyType}&api_key=${apiKey}`)
        })
    })  
    return fetchUrls(urlList); 
} 


function fetchUrls(urlArray){
    return urlArray.map(url => {
        return fetch(url)
        .then(response => {
            if(response.ok) return Promise.resolve(response.json())
            else return Promise.reject(new Error(response.statusText))
        })
        .catch(error => console.log("error is", error)) 
    });
}  

function formatResponse(response){
    return response.map(obj => {
        return obj.result[0]
    })
}

function updateGlobalState(response, checkedStates, checkedEnergyTypes){
    updateGlobalStateGraph("totalCO2emissions")
    globalState.years = Object.keys(response[0].data);
    globalState.stateData = getStateCO2EmissionsArr(response, checkedStates, checkedEnergyTypes); 
    globalState.yAxisLabel = "CO2 Emissions (million metric tons)";
}

function getStateCO2EmissionsArr(response, checkedStates, checkedEnergyTypes) {  
    let CO2EmissionsByState = {};   
    checkedStates.forEach(state => {
        return CO2EmissionsByState[state] = getCO2EmissionsByEnergyObj(response, state, checkedEnergyTypes); 
    })
    return CO2EmissionsByState; 
}

function getCO2EmissionsByEnergyObj(response, state, checkedEnergyTypes){
    let energyEmissionsObj = {}; 
    checkedEnergyTypes.forEach(energyType => {
        energyEmissionsObj[energyType] = getEnergyCo2Emissions(response, state, energyType)
    })
    return energyEmissionsObj
}

function getEnergyCo2Emissions(response, state, energyType){
    let stateAbbr = stateListMaster[state].abbr
    let match = response.find(obj =>  {
        return getStateAbbr(obj) === stateAbbr && getEnergyType(obj) === energyType
    })
    return match.data
}

function renderChart(){
    renderCanvas();
    toggleActiveBtnClass(); 
    var ctx = document.getElementById('chart-canvas').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: globalState.years,
            datasets: createDataSet(),
        },
        options: {
            title: {
                display: true, 
                position: "top", 
                text: globalState.yAxisLabel,
                fontColor: "white", 
                fontSize: 18 

            },
            scales: {
                yAxes: [{
                    ticks: {
                        fontSize: 16,
                        fontColor: 'white'
                    }, 
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

//meow
function renderCanvas() {
    emptyMainContent();
    $('main').append(`<div id='chart-top'></div>`)
    $('#chart-top').append(energyTypeContent());
    $('main').append(`<section id='chart'></section>`);
    $("#chart").append(canvasContent()); 
    $('#chart-top').append(btnContainer())
    closeChartEventListener();
    graphBtnEventListeners(); 
}

function btnContainer(){
    return `<div>${stateGdpBtn()} ${co2Btn()}</div>`
}

function stateGdpBtn(){
    return `<button class='graph-btn' id='btn-gdp' data-graph='gdpPerCO2emissions'>GDP per CO<sub>2</sub></button>`
}

function co2Btn(){
    return `<button class='graph-btn' id='btn-co2' data-graph='totalCO2emissions'>Cumulative CO<sub>2</sub></button>`  
}

function graphBtnEventListeners(){
    $('.graph-btn').on('click', function(e){
        e.preventDefault();
        let activeGraphBtn = $(this).data("graph");
        let btnId = $(this).attr("id")
        checkFetchedDataTypes(activeGraphBtn, btnId)     
    })
}

function checkFetchedDataTypes(activeGraphBtn, btnId){
    let graphTypeIndex = globalState.fetchedData.indexOf(activeGraphBtn)
    if(graphTypeIndex === -1){
        fetchGdpData();
        toggleActiveBtnClass(btnId) 
    } else if(graphTypeIndex >= 0){
        toggleGraphType(activeGraphBtn)
        toggleActiveBtnClass(btnId)
    }
}

//meow
function toggleGraphType(activeGraphBtn){
    let totalCO2emissionsLabel = "CO2 Emissions (million metric tons)"
    let gdpPerCo2emissionsLabel = "GDP (billions of current dollars) per 1 million metric tons of CO2 Emissions"; 
    let stateName= globalState.statesList[0];
    let years = Object.keys(globalState.stateData[stateName][activeGraphBtn]); 
    console.log(years)
    updateGlobalStateGraph(activeGraphBtn);
    updateGlobalStateYears(years);
    if(activeGraphBtn === "gdpPerCO2emissions"){
        updateGlobalStateYaxis(gdpPerCo2emissionsLabel)
    } else if (activeGraphBtn === "totalCO2emissions"){
        updateGlobalStateYaxis(totalCO2emissionsLabel)
    }  
    renderChart();   
}

function toggleActiveBtnClass(){

}

function fetchGdpData(){
            let urls = globalState.statesList.map(state => {
                let stateAbbr = stateListMaster[state].abbr; 
                return `https://apps.bea.gov/api/data/?UserID=${stateGdpApiKey}&method=GetData&datasetname=Regional&TableName=SAGDP2N&LineCode=1&Year=ALL&GeoFips=${stateAbbr}&ResultFormat=json`
            })
                Promise.all(urls.map(url => 
                    fetch(url)
                    .then(checkStatus)
                    .then(parseJSON)
                    .catch(error => console.log("error is", error))
                    ))
                    .then(updateGlobalStateFetchedData("gdpPerCO2emissions"))
                    .then(gdpResults=> updateGlobalStateGdpData(gdpResults))
                    .then(getGdpPerCO2emissions)
                    .then(renderChart)           
                    .catch(error => console.log("error is", error))
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

function updateGlobalStateGdpData(gdpResults){
    gdpResults.forEach(gdpObj => {
        return getGdpData(gdpObj.BEAAPI.Results.Data)
    })
}

function getGdpData(gdpDataArr){
    let stateName = gdpDataArr[0].GeoName.replace(/\s+/g, '');
    let gdpObj = {}
    gdpDataArr.forEach(year => {
        let gdpNum = year.DataValue.replace(/,/g, '')
        gdpObj[year.TimePeriod] = parseInt(gdpNum)/1000
    })
    let stateObj = globalState.stateData[stateName]
    stateObj.gdp = gdpObj;
    updateGlobalStateYaxis(`GDP (billions of current dollars) per 1 million metric tons of CO2 Emissions`)
    return stateObj; 
}



function updateGlobalStateFetchedData(dataName){
    globalState.fetchedData.push(dataName);   
}

function updateGlobalStateYaxis(yAxisLabel){
    globalState.yAxisLabel = yAxisLabel
}

function getGdpPerCO2emissions(){
    let stateObjKeys = Object.keys(globalState.stateData)
    stateObjKeys.forEach(stateName => getGdpPerCO2(stateName))
}

function getGdpPerCO2(stateName){
    let gdpObj = globalState.stateData[stateName].gdp
    let years = Object.keys(gdpObj);
    let gdpPerCO2emissions = {}; 
    years.forEach(year => {
        gdpPerCO2emissions[year] = getGdpEmissionsRatio(gdpObj[year], year, globalState.stateData[stateName])   
    })
    globalState.stateData[stateName].gdpPerCO2emissions = gdpPerCO2emissions; 
    
    updateGlobalStateYears(years)
    updateGlobalStateGraph("gdpPerCO2emissions");
}

//start here
//refactored Promise.all() for gdp data fetch
//make sure graph can be updated to reflect gdp/CO2 emissions
//then work on toggling between total CO2 emissions, and gdp/CO2

function getGdpEmissionsRatio(gdp, year, stateObj){
    let gdpToCO2emissionsRatio = gdp/stateObj.totalCO2emissions[year]; 
    return gdpToCO2emissionsRatio.toFixed(3)
    }

function updateGlobalStateYears(years){
    globalState.years = years
}

function updateGlobalStateGraph(graphName){
    globalState.graph = graphName; 
}

function energyTypeContent(){
    return  `<h2>Energy Types: ${globalState.energyTypes.map(energy => capitalize(energy)).join(", ")}</h2>`
}

function canvasContent(){
    return `<div id='chart-title'>
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

function createDataSet() {
    let lineColors = ["#4286f4", "#f44141", "#3ea84c", "#eaea19", "#ffa100"];
    let responseDataSet = [];
    let graphType = globalState.graph; 
    for (let i = 0; i < globalState.statesList.length; i++) {
        let currentState = globalState.statesList[i];   
        responseDataSet.push({
            label: stateListMaster[currentState].name,
            fill: false,
            borderColor: lineColors[i],
            data: createData(globalState.stateData[currentState][graphType]),
            pointBackgroundColor: 'white',
        })
    }
    return responseDataSet;
}

function createData(dataObj){
    return Object.keys(dataObj).map(year => {
        return dataObj[year]
    })
}

function updateGlobalStateTotalCO2(){
    Object.keys(globalState.stateData).forEach(state => {
        sumCO2Emissions(globalState.stateData[state])
    })
}

function sumCO2Emissions(state){
    let energyTypes= Object.keys(state);
    let firstEnergyType = state[energyTypes[0]]

    let totalCO2emissions = {}; 
    Object.keys(firstEnergyType).forEach(year => {
        return totalCO2emissions[year] = sumEnergyCO2(state, energyTypes, year)
    })
    state.totalCO2emissions = totalCO2emissions; 
}
 
function sumEnergyCO2(state, energyTypes, year){
    let sum = 0; 
    energyTypes.forEach(energy => {
        sum += state[energy][year]
    })
    return sum
}

$(launchApp)