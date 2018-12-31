'use strict'; 

/*
API Docs: https://developer.nrel.gov/docs/cleap/emissions/

Will have to change the interval type
Will depend upon the highest number on record, 
round to nearest 0 or 5 number, then divide by 10

Be able to select multiple energy types
Give each energy type its own line
See CO2 emissions per capita 
--(will have to call other API that gives state population by year)

*/

const apiKey = 'Q3oXtmNbQIEm2zNEjnbmU0OFyfRI2sgRbBQp9g8t'

function clearChart(){
    $("#chart").empty(); 
}

function fetchData(state, energyType){
    console.log(energyType)
        let urls = state.map(key => {
        return `https://developer.nrel.gov/api/cleap/v1/state_co2_emissions?state_abbr=${key}&type=${energyType}&api_key=${apiKey}`;
    })   

    Promise.all(urls.map(url =>
        fetch(url)
            .then(checkStatus)
            .then(parseJSON)
            .then(getDataObj)
            .catch(err => console.log("There was an error", err))
        ))
        .then(data => display(data, state, energyType))
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










// function fetchData(state, energyType){  
//     let urls = state.map(key => {
//         return `https://developer.nrel.gov/api/cleap/v1/state_co2_emissions?state_abbr=${key}&type=${energyType}&api_key=${apiKey}`;
//     })   
//     Promise.all(urls.map(url =>
//         fetch(url)
//           .then(checkStatus)                 
//           .then(parseJSON)
//           .then(getDataObj)
//           .catch(error => console.log('There was a problem!', error))
//       ))
//       .then(data => {
//           display(data, state, energyType)  
//       })
// }
  
// function checkStatus(response) {
//     if (response.ok) {
//       return Promise.resolve(response);
//     } else {
//       return Promise.reject(new Error(response.statusText));
//     }
//   }

//   function parseJSON(response) {
//     return response.json(); 
//   }

//   function getDataObj(response){
//     return response.result[0]; 
// }

function createTitle(energyType, state){
    let title = `${energyType.charAt(0).toUpperCase() + energyType.slice(1)} Carbon Dioxide Emissions: ${state.join(", ")}`;
    $("#chart-title").append(`<h3>${title}</h3>`); 
}

function createDataSet(state, response){
    let responseDataSet = [];
    let lineColors = ["#4286f4", "#f44141", "#3ea84c", "#eaea19", "#ffa100"]
    for(let i=0; i<state.length; i++){
        let responseData = response[i].data; 
        responseDataSet.push({
            label: `${state[i]}`, 
            fill: false, 
            borderColor: lineColors[i],
            data: Object.values(responseData),
            pointBackgroundColor: lineColors[i],
            pointBorderWidth: 1
        })
    }
    return responseDataSet
}

function createChart(){
    $("#chart").append("<div id='chart-title'></div><canvas id='chart-canvas'></canvas>")
}

function display(response, state, energyType){ 
    createTitle(energyType, state)  
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

function addEventListener(){
    $("#add-state").on("click", function(e){
        e.preventDefault(); 
        let newStateEntry = $("#first-state").clone().removeAttr("id"); 
        $("#state-container").append(newStateEntry); 
        $(".state").last().val("") 
       
    })

    $("#submit").on("click", function(e){
        e.preventDefault();
        clearChart(); 
        createChart(); 
        let state = $(".state").map(function(){
            return $(this).val(); 
        }).get(); 
        let energyType = $("input[name=energy]:checked")[0].id; 
        fetchData(state, energyType);
    })
}

function launchApp(){
    addEventListener();
}


$(launchApp)