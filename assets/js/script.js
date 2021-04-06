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
var key = "b6f7470ccc41512fa39f1b4e891505a0";
// Check if searched city stored from storage
function checking(c) {
    for (var i = 0; i < sCity.length; i++) {
        if (c.toUpperCase() === sCity[i]) {
            return -1;
        }
    }
    return 1;
}
// Current weather
function currentWeather(city) {
    // query to get data from server side.
    var queryURL = "api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID" + key;
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function(response) {
        console.log(response);
        var wIcon = response.weather[0].icon;
        var iconURL = "http://openweathermap.org/img/wn/" + wIcon + "@2x.png";
        var date = new Date(response.dt * 1000).toLocaleDateString();
        // Parse the response for city, date and icon
        $(currentCity).html(response.name + "(" + date + ")" + "<img scr =" + iconURL + ">");

        var tempC = (response.main.temp - 273.15);
        $(currentTemp).html((tempC).toFixed(2) + "&#8451");
        // Display Humidity
        $(currentHumidity).html(response.main.humidity + "%");
        // Display wind speed
        var windS = response.wind.speed;
        var wsKMH = (windS).toFixed(1);
        $(currentWindS).html(wsKMH + "Km/h");
        // Display UV index.
        UVIndex(response.coord.lon, response.coord.lat);
    })
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
    var queryUV = "https://api.openweathermap.org/data/2.5/uvi?appid=" + key + "&lat=" + lt + "&lon" + ln;
    $.ajax({
        url: queryUV,
        method: "GET"
    }).then(function(response) {
        $(currentUV).html(response.value);
    });
}
// Add to list function
function addToList(c) {
    var listEl = $("<li>" + c.toUpperCase() + "</li>");
    $(listEl).attr("class", "list-group-item");
    $(listEl).attr("data-value", c.toUpperCase());
    $(".list-group").append(listEl);
}
// Buttons
$("#search-button").on("click", displayWeather);