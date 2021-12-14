var cities = [];
var searchFormEl = document.querySelector("#search-city-form");
var searchCityEl = document.querySelector("#search-city");
var cityEl = document.querySelector("#cities");
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
    formSearches();
    citySearches(city);
};

var formSearches = function() {
    localStorage.setItem("cities", JSON.stringify(cities));
};

var citySearches = function (citySearches) {
    citySearchesEl = document.createElement("button");
    citySearchesEl.textContent = citySearches;
    citySearchesEl.setAttribute("data-city", citySearches);
    citySearchesEl.setAttribute("type", "submit");
    citySearchesEl.classList = "list-group city-btn";

    cityEl.prepend(citySearchesEl);
};

var cityContainer = function(event) {
    var city = event.target.getAttribute("data-city")
    if (city) {
        apiCity(city);
        apiFiveDay(city);
    }
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

    // console.log(weather);

    document.getElementById("current-div").style.border = "solid black";
    
    // create span to contain current date
    var today = document.createElement("span")
    today.textContent = " (" + moment(weather.value).format("MMM Do YYYY") + ") ";
    currentCityEL.appendChild(today);

    // create image to represent current weather
    var iconEl = document.createElement("img");
    iconEl.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    iconEl.classList = "img-1"
    currentCityEL.appendChild(iconEl);

    // create span for temperature
    var temperatureEl = document.createElement("span");
    temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
    temperatureEl.classList = "weather-dis"
    currentDayEl.appendChild(temperatureEl);

    // create span for wind speed
    var windEl = document.createElement("span");
    windEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    windEl.classList = "weather-dis"
    currentDayEl.appendChild(windEl);

    // create span for humidity
    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    humidityEl.classList = "weather-dis"
    currentDayEl.appendChild(humidityEl);

    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    infoUV(lat, lon);
};

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
    uvIndexEl.classList = "weather-dis uv"

    uvIndexVal = document.createElement("span")
    uvIndexVal.textContent = index.value

    if (index.value <= 2) {
        uvIndexVal.classList = "minimal"
    } else if(index.value >= 2 && index.value <= 6) {
        uvIndexVal.classList = "low"
    } else if (index.value >= 6 && index.value <= 8) {
        uvIndexVal.classList = "moderate"
    } else if (index.value > 8) {
        uvIndexVal.classList = "severe"
    };
    uvIndexEl.appendChild(uvIndexVal);
    currentDayEl.appendChild(uvIndexEl);
};

var apiFiveDay = function(city) {
    var apiURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=imperial&appid=9882a057eea878ea35630ccacdb0f7f1';

    fetch(apiURL)
        .then(function(response) {
            response.json()
                .then(function(data) {
                    fiveDay(data)
                });
        });
};

var fiveDay = function(weather) {
    fiveDayEl.textContent = "";
    fiveDayForecastEl.textContent = "5 Day Forecast";

    var forecast = weather.list;
        for (var i=5; i < forecast.length; i=i+8) {
            var daysForecast = forecast[i];

            var daysForecastEl = document.createElement("div");
            daysForecastEl.classList = "card days";

            // create date per different day
            var daysForecastDate = document.createElement("h3");
            daysForecastDate.textContent = moment.unix(daysForecast.dt).format("MMM Do YYYY");
            daysForecastDate.classList = "card-header text-center";
            daysForecastEl.appendChild(daysForecastDate);

            // create image per different day
            var daysIcon = document.createElement("img");
            daysIcon.classList = "card-body text-center img-2";
            daysIcon.setAttribute("src", `https://openweathermap.org/img/wn/${daysForecast.weather[0].icon}@2x.png`);  
            daysForecastEl.appendChild(daysIcon);

            // create temperature per different day
            var daysTemperatureEl = document.createElement("span");
            daysTemperatureEl.textContent = "Temperature: " + daysForecast.main.temp + " °F";
            daysTemperatureEl.classList = "card-body";
            daysForecastEl.appendChild(daysTemperatureEl);

            // create span for wind speed
            var daysWindEl = document.createElement("span");
            daysWindEl.textContent = "Wind Speed: " + daysForecast.wind.speed + " MPH";
            daysWindEl.classList = "card-body";
            daysForecastEl.appendChild(daysWindEl);

            // create humidity per different day
            var daysHumidityEl = document.createElement("span");
            daysHumidityEl.textContent = "Humidity: " + daysForecast.main.humidity + " %";
            daysHumidityEl.classList = "card-body";
            daysForecastEl.appendChild(daysHumidityEl);

            fiveDayEl.appendChild(daysForecastEl);
        }
};

searchFormEl.addEventListener("submit", formSubmit);
cityEl.addEventListener("click", cityContainer);