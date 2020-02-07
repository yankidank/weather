var API = '5ec45324b97dfab94d81259ceb9c7461'
var getIP = 'http://ip-api.com/json/'
var openWeatherMap = 'http://api.openweathermap.org/data/2.5/weather'
var openWeatherUV = 'https://api.openweathermap.org/data/2.5/uvi?'
var locationInput;

function renderWeather(locationInput) {
  $("#weather_city").empty()
  $("#weather_image").empty()
  $("#weather_temp").empty()
  $("#weather_humidity").empty()
  $("#weather_wind").empty()
  $("#weather_date").empty()
  $("#weather_uv").empty()

  $.getJSON(getIP).done(function(location) {
    $.getJSON(openWeatherMap, {
      lat: location.lat,
      lon: location.lon,
      units: 'imperial',
      APPID: API
    }).done(function(weather) {
      $("#weather_city").append('<h3>'+weather.name+'</h3>')
      $("#weather_image").append('<img src="https://openweathermap.org/img/wn/'+weather.weather[0].icon+'@2x.png" />')
      $("#weather_temp").append(weather.main.temp+'° F')
      $("#weather_humidity").append('Humidity: '+weather.main.humidity)
      $("#weather_wind").append('Wind: '+weather.wind.speed)
      $("#weather_date").append('Date: '+weather.dt)
      console.log(weather)
    })
    $.getJSON(openWeatherUV, { // UV Index
      lat: location.lat,
      lon: location.lon,
      units: 'imperial',
      APPID: API
    }).done(function(uv) {
      $("#weather_uv").append('UV Index: '+uv.value)
    })
  })
}

$(document).ready(function(){
  // Detect enter key press
  $('#searchInput').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
      event.preventDefault()
      locationInput = $("#searchInput").val()
      console.log(locationInput)
      renderWeather(locationInput)
    }
  })
  // Detect click on submit button
  $("#searchButton").click(function(event){
    event.preventDefault()
    locationInput = $("#searchInput").val()
    console.log(locationInput)
    renderWeather(locationInput)
  })
})
