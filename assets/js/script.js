var API = '5ec45324b97dfab94d81259ceb9c7461'
var getIP = 'http://ip-api.com/json/'
var openWeatherMapURL = 'http://api.openweathermap.org/data/2.5/weather'
var openWeatherUV = 'https://api.openweathermap.org/data/2.5/uvi?'
var locationInput
var cityLat
var cityLon
var timestamp

function timeFormat(timestamp){
  timestamp = new Date(timestamp * 1000);
  var month = timestamp.getMonth() // coming back as 1 instead of 2 ?
  var date = timestamp.getDate()
  var hours = timestamp.getHours()
  var minutes = "0" + timestamp.getMinutes()
  var seconds = "0" + timestamp.getSeconds()
  //return '' + month + ' / ' + date + ' at ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)
  return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)
}
function clearWeather (){
  $("#weather_city").empty()
  $("#weather_image").empty()
  $("#weather_temp").empty()
  $("#weather_humidity").empty()
  $("#weather_wind").empty()
  $("#weather_date").empty()
  $("#weather_uv").empty()
}
function weatherSearch(locationInput) {
  if (locationInput){
    console.log('Searching: '+locationInput)
    clearWeather()
    if ($.isNumeric(locationInput)){
      console.log('Number with '+ locationInput.toString().length+' character(s)')
      if (locationInput.toString().length === 5 && $.isNumeric(locationInput)){
        $.getJSON(openWeatherMapURL, {
          zip: locationInput,
          units: 'imperial',
          APPID: API
        }).done(function(weather) {
          //console.log(weather)
          $("#weather_city").append('<h3>'+weather.name+'</h3>')
          $("#weather_image").append('<img src="https://openweathermap.org/img/wn/'+weather.weather[0].icon+'@2x.png" />')
          $("#weather_temp").append(weather.main.temp+'° F')
          $("#weather_humidity").append('Humidity: '+weather.main.humidity)
          $("#weather_wind").append('Wind: '+weather.wind.speed)
          timestamp = weather.dt
          $("#weather_date").append('Updated: ' + timeFormat(timestamp))
          cityLat = weather.coord.lat
          cityLon = weather.coord.lon
          //console.log('Lat: '+cityLat+', Lon: '+cityLon)
          $.getJSON(openWeatherUV, { // UV Index
            lat: cityLat,
            lon: cityLon,
            units: 'imperial',
            APPID: API
          }).done(function(uv) {
            $("#weather_uv").append('UV Index: '+uv.value)
          })
        })
        
      } else {
        console.log('ERROR: Zip code is not 5 digits')
      }
    } else {
      $.getJSON(openWeatherMapURL, {
        q: locationInput,
        units: 'imperial',
        APPID: API
      }).done(function(weather) {
        //console.log(weather)
        $("#weather_city").append('<h3>'+weather.name+'</h3>')
        $("#weather_image").append('<img src="https://openweathermap.org/img/wn/'+weather.weather[0].icon+'@2x.png" />')
        $("#weather_temp").append(weather.main.temp+'° F')
        $("#weather_humidity").append('Humidity: '+weather.main.humidity)
        $("#weather_wind").append('Wind: '+weather.wind.speed)
        timestamp = weather.dt
        $("#weather_date").append('Updated: '+timeFormat(timestamp))
        $.getJSON(openWeatherUV, { // UV Index
          q: locationInput,
          units: 'imperial',
          APPID: API
        }).done(function(uv) {
          $("#weather_uv").append('UV Index: '+uv.value)
        })
      })
    }
  } else {
    console.log(locationInput+' : Showing by IP location')
    $.getJSON(getIP).done(function(location) {
      console.log('Lat: '+location.lat+', Lon: '+location.lon)
      clearWeather()
      $.getJSON(openWeatherMapURL, {
        lat: location.lat,
        lon: location.lon,
        units: 'imperial',
        APPID: API
      }).done(function(weather) {
        //console.log(weather)
        $("#weather_city").append('<h3>'+weather.name+'</h3>')
        $("#weather_image").append('<img src="https://openweathermap.org/img/wn/'+weather.weather[0].icon+'@2x.png" />')
        $("#weather_temp").append(weather.main.temp+'° F')
        $("#weather_humidity").append('Humidity: '+weather.main.humidity)
        $("#weather_wind").append('Wind: '+weather.wind.speed)
        timestamp = weather.dt
        $("#weather_date").append('Updated: '+timeFormat(timestamp))
        $.getJSON(openWeatherUV, { // UV Index
          lat: location.lat,
          lon: location.lon,
          units: 'imperial',
          APPID: API
        }).done(function(uv) {
          $("#weather_uv").append('UV Index: '+uv.value)
        })
      })
    })
  }
}

$(document).ready(function(){
  // Detect enter key press
  $('#searchInput').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
      event.preventDefault()
      locationInput = $.trim($("#searchInput").val())
      //console.log(locationInput)
      weatherSearch(locationInput)
    }
  })
  // Detect click on submit button
  $("#searchButton").click(function(event){
    event.preventDefault()
    locationInput = $.trim($("#searchInput").val())
    
    //console.log(locationInput)
    weatherSearch(locationInput)
  })
})
