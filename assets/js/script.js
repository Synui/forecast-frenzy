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
        apiFiveDay(city);
        cities.unshift({city});
        searchCityEl.value = "";
    } else {
        alert("Please select a city!");
    }
    save();
    past(city);
};

var save = function() {
    localStorage.setItem("cities", JSON.stringify(cities));
};

var apiCity = function(city) {
    var apiURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=9882a057eea878ea35630ccacdb0f7f1';

    fetch(apiURL)
        .then(function(response) {
            response.json()
                .then(function(data) {
                    weatherDisplay(data, city);
            });
    });
};

var weatherDisplay = function(weather, selectedCity) {
    // delete old content
    currentDayEl.textContent = "";
    currentCityEL.textContent = selectedCity;

    console.log(weather);

    // create span to contain current date
    var today = document.createElement("span")
    today.textContent = " (" + moment(weather.value).format("MMMM Do YYYY") + ") ";
    currentCityEL.appendChild(today);

    // create image to represent current weather
    var iconEl = document.createElement("img");
    iconEl.setAttribute("src", 'https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png');
    currentCityEL.appendChild(iconEl);

    // create span for temperature
    var temperatureEl = document.createElement("span");
    temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";

    // create span for humidity
    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";

    var windEl = document.createElement("span");
    windEl.textContent = "Wind Speed: " + weather.wind.spead + " MPH";

    currentDayEl.appendChild(temperatureEl);
    currentDayEl.appendChild(humidityEl);
    currentDayEl.appendChild(windEl);

    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    infoUV(lat, lon);
}

var infoUV = function(lat, lon) {
    var apiURL = 'https://api.openweathermap.org/data/2.5/uvi?appid=9882a057eea878ea35630ccacdb0f7f1&lat=' + lat + '&lon=' + lon;

    fetch(apiURL)
        .then(function(response) {
            response.json()
                .then(function(data) {
                    uvIndex(data)
            });
        });
};

var uvIndex = function(index) {
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: "

    uvIndexVal = document.createElement("span")
    uvIndexVal.textContent = index.value

    if (index.value <= 2) {
        uvIndexVal.classList = "minimal"
    } else if(index.value >= 3 && index.value <= 5) {
        uvIndexVal.classList = "low"
    } else if (index.value >= 6 && index.value <= 8) {
        uvIndexVal.classList = "moderate"
    } else if (index.value > 8) {
        uvIndexVal.classList = "severe"
    }
};

uvIndexEl.appendChild(uvIndexVal);
citiesEl.appendChild(uvIndexEl)

searchFormEl.addEventListener("submit", formSubmit);