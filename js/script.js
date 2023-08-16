var currentDay = $('#currentDay'); //variable that points to the day in the DOM
var currentTime = $('#currentTime'); //variable that points to the time in the DOM

var gpsButton = $('#use-location'); //points to the gps icon in the DOM
let inputButton = $('#input-btn'); //points to the input (SEARCH) botton in the DOM
let cityInput = $('#input-box'); //captures the city entered in the input box
let cityName = '';
let zipCode = '';

const todaysWeatherEL = document.getElementById('todays-container'); //points to today's weather in the DOM
const forecastEL = document.getElementById('five-day'); //points to the forecast in the DOM
let textArray = []; //array for local data


var currentHour = dayjs().hour(); //gets the current hour

const apiKey = 'd76c91059df9d7069e6671bf4641cd06'; //api key for open weather map api
let newCityName = ''; //holds the city name pulled from the api objust after data is retrieved
let cityHistory=[]; //holds the array of past cities
//Function that sets the current time. 
setInterval(function () {
    var dateInterval = dayjs(); //js constructor to create a new date object.
    currentTime.text(dateInterval.format('MMM,DD YYYY hh:mm:ss a'));
}, 1000);


function addInputToArray(){}

function setWeatherData(data) {


    let todayForecast = '';
    let nextDayForecast = '';
    // data.list.array.forEach(element => {
    newCityName = data.city.name;

    data.list.forEach((day, idx) => {
        if (idx == 0) {
            console.log('We are in the loop', idx);

            todayForecast += `
            <div class="todays-container" id="todays-temp">
            <img src="https://openweathermap.org/img/wn/10d@2x.png" alt="weather icon" id="today-icon" class="w-icon">
            <div id="current-city">${newCityName}</div>
            <div class="today-info">
                <div class="day">Monday</div>
                <div class="temp">Temp:${day.main.temp}F</div>
                <div class="wind">Wind ${day.wind.speed} MPH</div>
                <div class="humidity">Humidity ${day.main.humidity}%</div>

            </div>
        </div>
            `



        } else if (idx <= 5) {
            console.log('We are in the next loop', idx);
            nextDayForecast += `
            
            <div id="day1" class = "column forecast-containers">
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">  
            <div class="day">Sat</div>
            <div class="temp">Temp: ${day.main.temp}F</div>
            <div class="wind">Wind ${day.wind.speed} MPH</div>
            <div class="humidity">Humid: ${day.main.humidity}%</div>
        </div >`
            console.log(day.main.temp);
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
    } else if (checker === 'Zip Code'){
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

    })
}

// function clearInput(){
//     cityInput.
// }

function getWeatherDataCity() { //function that gets weather data from open weather man api

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial`).then(res => res.json()).then(data => {
        console.log(data)
        setWeatherData(data);

    })
}

// function getLatLog(city){


// }


function getWeatherData() { //function that gets weather data from open weather man api
    navigator.geolocation.getCurrentPosition((success) => {
        let { latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`).then(res => res.json()).then(data => {
            console.log(data)
            setWeatherData(data);
            
        })

    })
}


