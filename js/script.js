var currentDay = $('#currentDay'); //variable that points to the day in the DOM
var currentTime = $('#currentTime'); //variable that points to the time in the DOM

var gpsButton = $('#use-location'); //points to the gps icon in the DOM
let inputButton = $('#input-btn'); //points to the input (SEARCH) botton in the DOM
let cityInput = $('#input-box'); //captures the city entered in the input box
let cityName = '';
let zipCode = '';

let printCity = document.getElementById('print-city-history');
const todaysWeatherEL = document.getElementById('todays-container'); //points to today's weather in the DOM
const forecastEL = document.getElementById('five-day'); //points to the forecast in the DOM
let textArray = []; //array for local data

var currentHour = dayjs().hour(); //gets the current hour

const apiKey = 'd76c91059df9d7069e6671bf4641cd06'; //api key for open weather map api
let newCityName = ''; //holds the city name pulled from the api objust after data is retrieved
let cityHistory = []; //holds the array of past cities
//Function that sets the current time. 
setInterval(function () {
    var dateInterval = dayjs(); //js constructor to create a new date object.
    currentTime.text(dateInterval.format('MMM,DD YYYY hh:mm:ss a'));
}, 1000);


function addInputToArray() {

    textArray[textArray.length] = newCityName;
    console.log(' the city array is :', textArray);

}

function printToHistory() {
    // Clear the existing buttons
    printCity.innerHTML = '';
    textArray.forEach(cityInArray =>{
        console.log('printing ', cityInArray);
        // printCity.

        const button = document.createElement('button'); //creates a button
       
        button.innerText = cityInArray; //changes the inner text of the button
        button.classList.add('past-city');
        button.classList.add('button');
        button.classList.add('is-info');
        button.classList.add('is-rounded');
        button.classList.add('is-small');
        button.addEventListener('click', function() {
            getWeatherDataHistory(button.innerText)
        });


       

        // button.addEventListener('click', () => selectAnswer(answer.correct));
        printCity.appendChild(button);
        // printCity += `<button class="past-city button is-info is-rounded is-small">${cityInArray}</button>`
    saveUserData(textArray);
    } 
    ) 
}

//function that converts the array into a JSON value so it can be used in local storage
function saveUserData(arr) {
    var jasonVal = JSON.stringify(arr);
    localStorage.setItem('cities', jasonVal);
}

//function that gets the JSON array from the local storage and converts it to a JavaScript array
function addToArray() {
    var rawData = localStorage.getItem('cities');
    var parse = JSON.parse(rawData) || [];

    return parse;
}


function setWeatherData(data) {


    let todayForecast = '';
    let nextDayForecast = '';
    newCityName = data.city.name;

    data.list.forEach((day, idx) => {
        if (idx == 2) {
            console.log('We are in the loop', idx);
            let timestamp = day.dt*1000;

            todayForecast += `
            <div class="todays-container" id="todays-temp">
            <img src="https://openweathermap.org/img/wn/10d@4x.png" alt="weather icon" id="today-icon" class="w-icon">
            <div id="current-city">${newCityName}</div>
            <div class="today-info">
                <div class="day">${dayjs(timestamp).format('dddd')}</div>
                <div class="temp">Temp:${day.main.temp}F</div>
                <div class="wind">Wind ${day.wind.speed} MPH</div>
                <div class="humidity">Humidity ${day.main.humidity}%</div>

            </div>
        </div>
            `



        } else if (idx <= 27) {
            console.log('We are in the next loop', idx);
            let timestamp = day.dt*1000;
            console.log('today is :', dayjs(timestamp));
           

            if(idx==7||idx==12||idx==17||idx==22||idx==27){
            nextDayForecast += `
            
            <div id="day1" class = "column forecast-containers">
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">  
            <div class="day">${dayjs(timestamp).format('dddd')}</div>
            <div class="temp">Temp: ${day.main.temp}F</div>
            <div class="wind">Wind ${day.wind.speed} MPH</div>
            <div class="humidity">Humid: ${day.main.humidity}%</div>
        </div >`
            console.log(day.main.temp);}
        }


    })
    todaysWeatherEL.innerHTML = todayForecast;
    forecastEL.innerHTML = nextDayForecast;
}



$(gpsButton).on('click', function () {
    getWeatherData();
    console.log('button clicked');
});

$(inputButton).on('click', function () {
    cityName = cityInput.val();
    var checker = checkInput(cityName);
    if (checker === 'City Name') {
        console.log("thats a city son!")
        getWeatherDataCity();
        console.log('input entered');
    } else if (checker === 'Zip Code') {
        getWeatherDataZip();
        console.log("that's a zip code kid");
    }

    cityInput.val('');

});



function checkInput(input) {
    // Regular expressions for zip codes and city names
    const zipCodeCheck = /^\d{5}$/; // Assumes a 5-digit zip code
    const cityNameCheck = /^[A-Za-z\s]+$/; // Allows letters and spaces for city name

    if (zipCodeCheck.test(input)) {
        return 'Zip Code';
    } else if (cityNameCheck.test(input)) {
        return 'City Name';
    } else {
        return 'Unknown';
    }
}

function getWeatherDataZip() { //function that gets weather data from open weather man api

    fetch(`https://api.openweathermap.org/data/2.5/forecast?zip=${cityName}&appid=${apiKey}&units=imperial`).then(res => res.json()).then(data => {
        console.log(data)
        setWeatherData(data);
        addInputToArray();
        printToHistory();

    })
}


function getWeatherDataCity() { //function that gets weather data from open weather man api

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial`).then(res => res.json()).then(data => {
        console.log(data)
        setWeatherData(data);
        addInputToArray();
        printToHistory();
    })
}

function getWeatherDataHistory(repeatCity) { //function that gets weather data from open weather man api

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${repeatCity}&appid=${apiKey}&units=imperial`).then(res => res.json()).then(data => {
        console.log(data)
        setWeatherData(data);
        addInputToArray();
        printToHistory();
    })
}



function getWeatherData() { //function that gets weather data from open weather man api
    navigator.geolocation.getCurrentPosition((success) => {
        let { latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`).then(res => res.json()).then(data => {
            console.log(data)
            setWeatherData(data);
            addInputToArray();
            printToHistory();
        })

    })
}



//Runs when page loads to get past cities from history and create buttons for them
textArray =addToArray();
printToHistory();
