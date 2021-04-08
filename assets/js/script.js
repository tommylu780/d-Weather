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

// Check if searched city stored from storage
function checking(c) {
    for (var i = 0; i < sCity.length; i++) {
        if (c.toUpperCase() === sCity[i]) {
            return -1;
        }
    }
    return 1;
}
// API key
var APIkey = "e714c11c1fa1548077fe1386e9ba5477";
// Display weather
function displayWeather(event) {
    event.preventDefault();
    if (searchCity.val().trim() !== "") {
        city = searchCity.val().trim();
        currentWeather(city);
    }
}
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
        forecast(response.id);
        if (response.cod == 200) {
            sCity = JSON.parse(localStorage.getItem("cityname"));
            console.log(sCity);
            if (sCity == null) {
                sCity = [];
                sCity.push(city.toUpperCase());
                localStorage.setItem("cityname", JSON.stringify(sCity));
                addToList(city);
            } else {
                if (checking(city) > 0) {
                    sCity.push(city.toUpperCase());
                    localStorage.setItem("cityname", JSON.stringify(sCity));
                    addToList(city);
                }
            }
        }
    });
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
// 5 day forecast
function forecast(cityid) {
    var dayover = false;
    var queryforcastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityid + "&appid=" + APIkey;
    $.ajax({
        url: queryforcastURL,
        method: "GET"
    }).then(function(response) {

        for (i = 0; i < 5; i++) {
            var date = new Date((response.list[((i + 1) * 8) - 1].dt) * 1000).toLocaleDateString();
            var iconcode = response.list[((i + 1) * 8) - 1].weather[0].icon;
            var iconurl = "https://openweathermap.org/img/wn/" + iconcode + ".png";
            var tempC = response.list[((i + 1) * 8) - 1].main.temp;
            var tempF = (((tempC - 273.5) * 1.80) + 32).toFixed(2);
            var humidity = response.list[((i + 1) * 8) - 1].main.humidity;

            $("#f-date" + i).html(date);
            $("#f-img" + i).html("<img src=" + iconurl + ">");
            $("#f-temp" + i).html(tempF + "&#8457");
            $("#f-humidity" + i).html(humidity + "%");
        }

    });
}
// Add to list function
function addToList(c) {
    var listEl = $("<li>" + c.toUpperCase() + "</li>");
    $(listEl).attr("class", "list-group-item");
    $(listEl).attr("data-value", c.toUpperCase());
    $(".list-group").append(listEl);
}

function invokePastSearch(event) {
    var liEl = event.target;
    if (event.target.matches("li")) {
        city = liEl.textContent.trim();
        currentWeather(city);
    }

}
// render function
function loadLastCity() {
    $("ul").empty();
    var sCity = JSON.parse(localStorage.getItem("cityname"));
    if (sCity !== null) {
        sCity = JSON.parse(localStorage.getItem("cityname"));
        for (i = 0; i < sCity.length; i++) {
            addToList(sCity[i]);
        }
        city = sCity[i - 1];
        currentWeather(city);
    }

}
// Clear history function
function clearData(event) {
    event.preventDefault();
    sCity = [];
    localStorage.removeItem("cityname");
    document.location.reload();
}
// Buttons
$("#search-button").on("click", displayWeather);
$(document).on("click", invokePastSearch);
$(window).on("load", loadLastCity);
$("#clear-button").on("click", clearData);