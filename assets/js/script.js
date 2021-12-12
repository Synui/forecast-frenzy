var cities = [];
var searchFormEl = document.querySelector("#search-city-form");
var searchCityEl = document.querySelector("#search-city");
var citiesEl = document.querySelector("#cities");
var currentCityEL = document.querySelector("#current-city");
var currentDayEl = document.querySelector("#current-day");
var fiveDayForecastEl = document.querySelector("#five-day-forecast");
var fiveDayEl = document.querySelector("#five-day");

var formSubmit = function(event) {
    event.preventDefault();
    var city = searchCityEl.value.trim();
    if(city) {
        apiCity(city);
        // apiFiveDay(city);
        cities.unshift({city});
        searchCityEl.value = "";
    } else {
        alert("Please select a city!");
    }
    save();
    // past(city);
};

var save = function() {
    localStorage.setItem("cities", JSON.stringify(cities));
};

var apiCity = function(city) {
    var apiKey = "9882a057eea878ea35630ccacdb0f7f1"
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}"

    fetch(apiURL)
        .then(function(response) {
            response.json()
                .then(function(data) {
            });
    });
};

searchFormEl.addEventListener("submit", formSubmit);