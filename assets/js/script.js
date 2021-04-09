// Variables
var city = "";
var searchCity = $("#search-city");
var searchBtn = $("#search-button");
var clearBtn = $("#clear-button");
var currentCity = $("#current-city");
var currentTemp = $("#temperature")
var currentHumidity = $("#humidity");
var currentWindS = $("#wind-speed");
var currentUV = $("#uv-index");
var sCity = [];

// API key
var APIkey = "e714c11c1fa1548077fe1386e9ba5477";

// Current weather
function currentWeather(city) {
    // query to get data from server side.
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIkey;
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function(response) {
        console.log(response);
        var wIcon = response.weather[0].icon;
        var iconURL = "https://openweathermap.org/img/wn/" + wIcon + "@2x.png";
        var date = new Date(response.dt * 1000).toLocaleDateString();
        // Parse the response for city, date and icon
        $(currentCity).html(response.name + "(" + date + ")" + "<img src=" + iconURL + ">");

        // Convert to Celsius
        var tempC = (response.main.temp - 273.15);
        $(currentTemp).html((tempC).toFixed(2) + "&#8451");
        // Display Humidity
        $(currentHumidity).html(response.main.humidity + "%");
        // Display wind speed, infomation for wind convert to km/h: https://atoc.colorado.edu/~cassano/wx_calculator/formulas/windConversion.html
        // The wind from reponse is default by m/s
        var windS = response.wind.speed;
        var wsKMH = (windS).toFixed(1);
        $(currentWindS).html(wsKMH * 3.6 + " Km/h");
        // Display UV index.
        UVIndex(response.coord.lon, response.coord.lat);
    });
}
// Display weather
function displayWeather(event) {
    event.preventDefault();
    if (searchCity.val().trim() !== "") {
        city = searchCity.val().trim();
        currentWeather(city);
    }
}

// Function return UVIndex response
function UVIndex(ln, lt) {
    var queryUV = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIkey + "&lat=" + lt + "&lon=" + ln;
    $.ajax({
        url: queryUV,
        method: "GET"
    }).then(function(response) {
        $(currentUV).html(response.value);
    });
}

// Buttons
$("#search-button").on("click", displayWeather);