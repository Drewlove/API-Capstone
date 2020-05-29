'use strict';

//highlight active graph

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

const apiKey = 'Q3oXtmNbQIEm2zNEjnbmU0OFyfRI2sgRbBQp9g8t';
const stateGdpApiKey = 'A1E0048C-FE51-40B6-B0BE-F8D7D58C1549';

const CO2EMISSIONSPERGDPLABEL = "GDP (billions of current dollars) per 1 million metric tons of CO2 Emissions";
const TOTALCO2EMISSIONSLABEL= "Total CO2 Emissions";

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

$(renderLandingPage)

function renderLandingPage() {
    let landingPage =
        `<section class='landing'>
        <img alt='USA lights at night' src='rb.gy/ssymcb'>
        <button class='light-button'>START</button>
    </section>`;
    $('main').append(landingPage)
    createEventListener($('.landing button'), renderForm, false)
}

function emptyMainContent() {
    $('main').empty();
}

function renderForm() {
    emptyMainContent(); 
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
      <button id='submit-btn' type='submit' class='light-button'>CO<sub>2</sub> Emissions</button>
    </form>`
    $('main').append(compareStateForm); 
    $('body').addClass('background-gradient')
    createEventListener($('#add-state-btn'), addState, true); 
    createEventListener($('.energy-input'), toggleTotalEnergyCheck, false); 
    createEventListener($('#submit-btn'), verifyStateSelection, true);
}

function newUpdateGlobalState(state, property, updatedValue){
    state[property] = updatedValue;
}

function createEventListener(element, handleAction, preventDefault) {
    element.on("click", function (e) {
        preventDefault === true ? e.preventDefault() : null; 
        handleAction($(this)); 
    })
}

function toggleTotalEnergyCheck(self){
        if(self.attr("id") !== "total-energy"){
            $("#total-energy").prop("checked", false)
      } else if(self.attr("id") === "total-energy"){
          $(".energy-input").prop("checked", false)
          $("#total-energy").prop("checked", true)
      }
}

function getStateOptions() {
    let stateNames = Object.keys(stateListMaster); 
    return stateNames.map(key => {
        return `<option value=${key.toString()}>${stateListMaster[key].name}</option>`
    }).join("");
}

function renderEnergyInputs() {
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

function addState(){
    if($('.state').length <= 4){
        let newStateEntry = $("#first-state").clone(true).removeAttr("id");
        $("#state-container").append(newStateEntry)
        $('.state').last().append(`<button class='remove-state-btn light-button'>-</button>`)
        let lastState = $('.state').last().find('.remove-state-btn')
        createEventListener(lastState, removeState, true); 
    } else {
        renderModal("You can only select 5 states at a time.")
    }
}

function removeState(self){
        self.closest('.state').remove(); 
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
    createEventListener($('.modal-close'), closeModal, true)
}

function toggleOpaque(){
    $('main').toggleClass('opaque')
}

function closeModal() {
    toggleOpaque(); 
    $('.modal').remove();
}


function verifyStateSelection(){
    let states = $(".state-val").map(function (){
        return $(this).val(); 
    }).get(); 
    let deDupeStates = []; 
    states.forEach(state => {
        if(deDupeStates.indexOf(state) === -1){
            deDupeStates.push(state)
        } 
    })
    if(deDupeStates.length === states.length){
        verifyEnergyTypeSelection(states);
    }
    else {
        renderModal("You cannot choose the same state multiple times")
    }
}

function verifyEnergyTypeSelection(states, ){
    if($('.energy-input:checkbox:checked').length === 0){
        return renderModal("You must select at least one energy type")
    } else {
        submitFormUpdateState(states, getEnergyArr())
        getStateFullName(states); 
        fetchTotalCO2data(); 
    }
}

function submitFormUpdateState(states, energy){
    states.forEach(state => {
        let stateAbbr = stateListMaster[state].abbr;
        globalState[stateAbbr] = getCO2emissionsByEnergyType(energy)
    })
}

function getCO2emissionsByEnergyType(energy){
    let energyCO2emissionsObj = {};  
    energy.forEach(eType => {
        let energyProp = {[eType]: {}}; 
        energyCO2emissionsObj.energyType = {...energyCO2emissionsObj.energyType, ...energyProp}; 
    })
    return energyCO2emissionsObj;
}

function getStateFullName(states){
    states.forEach(state => {
        let stateAbbr = stateListMaster[state].abbr;  
        globalState[stateAbbr].fullName = state;     
    })
}

function getEnergyArr(){
    let energyArr = [];
    $.each($("input[name='energy']:checked"), function(){
        let energyType = $(this).data("energy");
        energyArr.push(energyType);
    });
    return energyArr; 
}

function fetchTotalCO2data() {
    let stateAbbrs = Object.keys(globalState); 
    let energy = Object.keys(globalState[stateAbbrs[0]].energyType);
    let urls = getUrls(stateAbbrs, energy); 
    Promise.all(urls.map(url => 
        fetch(url)
        .then(checkStatus)
        .then(parseJSON)
        .then(formatFetchedData)
        ))
        .then(getStateCO2byEnergyType)
        .then(updateGlobalStateCO2emissions)
        .then(()=> renderChart(TOTALCO2EMISSIONSLABEL))
    }

function getUrls(stateAbbrs, energy){
    const urlList = []; 
    stateAbbrs.forEach(state => {
        energy.map(energyType => {
            return urlList.push(`https://developer.nrel.gov/api/cleap/v1/state_co2_emissions?state_abbr=${state}&type=${energyType}&api_key=${apiKey}`)
        })
    })  
    return urlList;
} 

function formatFetchedData(responseObj){ 
    let response = responseObj.result[0]
    let stateAbbr = getStateAbbr(response)
    let energyType = getEnergyType(response);
    return  {[`${stateAbbr}-${energyType}`]: response.data};
}

function getStateCO2byEnergyType(responseArr){
    let stateCO2byEnergyType = {}; 
    responseArr.forEach(response => {
        let key = Object.keys(response);
        let state = key[0].split('-')[0]; 
        let energy = key[0].split('-')[1];
        stateCO2byEnergyType[state] = {...stateCO2byEnergyType[state], [energy]: response[key[0]]}; 
    })
    return stateCO2byEnergyType
}

function updateGlobalStateCO2emissions(response){
    let states = Object.keys(response); 
    states.forEach(state => {
        globalState[state].energyType= response[state]
    })
}


function getCO2emissions(response, key, energy){
    return {[energy]: response[key[0]]}
}

function renderChart(yAxisLabel){ 
    let stateAbbrs = Object.keys(globalState);
    let states = stateAbbrs.map(stateAbbr => globalState[stateAbbr].fullName);
    let energy = Object.keys(globalState[stateAbbrs[0]].energyType); 
    let years = getYears(yAxisLabel, stateAbbrs, energy); 
    renderCanvas(energy);    
    var ctx = document.getElementById('chart-canvas').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: createDataSet(yAxisLabel, states, years),
        },
        options: {
            title: {
                display: true, 
                position: "top", 
                text: yAxisLabel,
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
    createChartBtns(yAxisLabel)
}

function getYears(yAxisLabel, stateAbbrs, energy){
    if(yAxisLabel === TOTALCO2EMISSIONSLABEL){
        return Object.keys(globalState[stateAbbrs[0]].energyType[energy[0]]);
    } else if(yAxisLabel === CO2EMISSIONSPERGDPLABEL){
        return Object.keys(globalState[stateAbbrs[0]].gdp)
    }
}

function renderCanvas(energy) {
    emptyMainContent();
    $('main').append(`<div id='chart-top'></div>`)
    $('#chart-top').append(energyTypeContent(energy));
    $('main').append(`<section id='chart'></section>`);
    $("#chart").append(canvasContent()); 
    createEventListener($("#close-chart"), renderForm, false);
}

function createChartBtns(yAxisLabel){
    $('#chart').append(btnContainer())
    toggleActiveBtnClass(yAxisLabel)
    createEventListener($('#btn-gdp'), fetchGdpData, false); 
    createEventListener($('#btn-co2'), fetchTotalCO2data, false); 
}       

function btnContainer(){
    return `<div class='graph-btn-container'>${totaCO2Btn()} ${gdpPerCO2btn()}</div>`
}

function gdpPerCO2btn(){
    return `<button class='graph-btn' id='btn-gdp' data-graph='gdpPerCO2emissions'>GDP per CO<sub>2</sub></button>`
}

function totaCO2Btn(){
    return `<button class='graph-btn' id='btn-co2' data-graph='totalCO2emissions'>Total CO<sub>2</sub></button>`  
}

function toggleActiveBtnClass(yAxisLabel){
    if(yAxisLabel === TOTALCO2EMISSIONSLABEL ){
        $('#btn-gdp').addClass('inactive-button')
    } else if (yAxisLabel === CO2EMISSIONSPERGDPLABEL){
        $('#btn-co2').addClass('inactive-button')
    }
}

function fetchGdpData(){
    let urls = Object.keys(globalState).map(stateAbbr => {
        return `https://apps.bea.gov/api/data/?UserID=${stateGdpApiKey}&method=GetData&datasetname=Regional&TableName=SAGDP2N&LineCode=1&Year=ALL&GeoFips=${stateAbbr}&ResultFormat=json`
    })
    Promise.all(urls.map(url => 
        fetch(url)
        .then(checkStatus)
        .then(parseJSON)
        .catch(error => console.log("error is", error))
        ))
        .then(gdpResults=> updateGlobalStateGdpData(gdpResults))
        .then(getGdpPerCO2emissions)
        .then(() => renderChart(CO2EMISSIONSPERGDPLABEL))  
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
    return gdpResults.map(gdpObj => {
        return getGdpData(gdpObj.BEAAPI.Results.Data)
    })
}

function getGdpData(gdpDataArr){
    let stateName = gdpDataArr[0].GeoName.replace(/\s+/g, '');
    let stateAbbr = stateListMaster[stateName].abbr; 
    let gdpObj = {}
    gdpDataArr.forEach(year => {
        let gdpNum = year.DataValue.replace(/,/g, '')
        gdpObj[year.TimePeriod] = parseInt(gdpNum)/1000
    })
    globalState[stateAbbr].gdp = gdpObj;
    return globalState; 
}

function updateGlobalStateYaxis(yAxisLabel){
    globalState.yAxisLabel = yAxisLabel
}

function getGdpPerCO2emissions(){
    let stateObjKeys = Object.keys(globalState)
    stateObjKeys.forEach(stateName => getStateGdpPerCO2(stateName))
}

function getStateGdpPerCO2(stateName){
    let gdpObj = globalState[stateName].gdp
    let years = Object.keys(gdpObj);
    let totalCO2emissionsObj = sumCO2emissions(stateName, years); 
    let gdpPerCO2emissions = {}; 
    years.forEach(year => {
        gdpPerCO2emissions[year] = getGdpEmissionsRatio(gdpObj[year], year, totalCO2emissionsObj)   
    })
    globalState[stateName].gdpPerCO2emissions = gdpPerCO2emissions; 
}

function getGdpEmissionsRatio(gdp, year, totalCO2emissionsObj){
    let gdpToCO2emissionsRatio = gdp/totalCO2emissionsObj[year];
    return gdpToCO2emissionsRatio.toFixed(3)
}

function energyTypeContent(energy){
    return  `<h2>Energy Types: ${energy.map(energy => capitalize(energy)).join(", ")}</h2>`
}

function canvasContent(){
    return `<div id='chart-title'>
                <div>
                <span id='close-chart' class='modal-close'>X</span>
                </div>
            </div>
            <canvas id='chart-canvas'></canvas>`
}

function createDataSet(yAxisLabel, states, years) {
    let lineColors = ["#4286f4", "#f44141", "#3ea84c", "#eaea19", "#ffa100"];
    let responseDataSet = []; 
    for (let i = 0; i < states.length; i++) {
        let state = states[i]
        let graphData = getGraphData(yAxisLabel, state, years); 
        responseDataSet.push({
            label: stateListMaster[states[i]].name,
            fill: false,
            borderColor: lineColors[i],
            data: graphData,
            pointBackgroundColor: 'white',
        })
    }
    return responseDataSet;
}

//meow meow
function getGraphData(yAxisLabel, state, years){
    let stateAbbr = stateListMaster[state].abbr; 
    if(yAxisLabel === TOTALCO2EMISSIONSLABEL){
        let totalCO2emissionsObj = sumCO2emissions(stateListMaster[state].abbr, years);
        return Object.keys(totalCO2emissionsObj).map(year => totalCO2emissionsObj[year]); 
    } else if(yAxisLabel === CO2EMISSIONSPERGDPLABEL){
        let gdpCO2ratio = globalState[stateAbbr].gdpPerCO2emissions; 
        return Object.keys(gdpCO2ratio).map(year => gdpCO2ratio[year])
    }
}

function sumCO2emissions(stateAbbr, years){
    let totalCO2emissionsObj = {}; 
    let stateEnergyObj = globalState[stateAbbr].energyType; 
    let energy = Object.keys(stateEnergyObj); 
    years.map(year => {
        let sum = 0; 
        energy.forEach(eType => { 
            sum += stateEnergyObj[eType][year]; 
        })
        return totalCO2emissionsObj[year] = sum
    })
    return totalCO2emissionsObj; 
}

