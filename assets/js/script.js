var API = '5ec45324b97dfab94d81259ceb9c7461'
var ipAPIUrl = 'https://ipapi.co/json/'
var openWeatherMapCurrent = 'https://api.openweathermap.org/data/2.5/weather'
var openWeatherUV = 'https://api.openweathermap.org/data/2.5/uvi?'
var openWeatherForecast = 'https://api.openweathermap.org/data/2.5/forecast?'
var locationInput
var timestamp

function timeFormat(timestamp){
  timestamp = new Date(timestamp * 1000);
  var month = timestamp.getMonth() // coming back as 1 instead of 2 ?
  var date = timestamp.getDate()
  var hours = timestamp.getHours()
  if (hours > 12){
    var AMPM = 'PM'
    hours = hours-12
  } else {
    var AMPM = 'AM'
  }
  var minutes = "0" + timestamp.getMinutes()
  return hours + ':' + minutes.substr(-2) + ' ' + AMPM
}
function dayFormat(timestamp){
  
}
function clearWeather (){
  $(".weather_city").empty()
  $(".weather_image").empty()
  $(".weather_temp").empty()
  $(".weather_humidity").empty()
  $(".weather_wind").empty()
  $(".weather_date").empty()
  $(".weather_uv").empty()
}
function weatherSearch(locationInput) {
  if (locationInput){
    $(':focus').blur()
    $("#searchInput").val('')
    //console.log('Searching: '+locationInput)
    clearWeather()
    if ($.isNumeric(locationInput)){
      //console.log('Number with '+ locationInput.toString().length+' character(s)')
      if (locationInput.toString().length === 5 && $.isNumeric(locationInput)){
        $.getJSON(openWeatherMapCurrent, {
          zip: locationInput,
          units: 'imperial',
          APPID: API
        }).done(function(weather) {
          //console.log(weather)
          $("#weather_city_current").append('<h2>'+weather.name+'</h2>')
          $("#weather_image_current").append('<img src="https://openweathermap.org/img/wn/'+weather.weather[0].icon+'@2x.png" />')
          $("#weather_temp_current").append('<h4>'+Math.round(weather.main.temp)+'<span class="temp_unit">° F</span></h4>')
          $("#weather_humidity_current").append(Math.round(weather.main.humidity)+'% Humidity')
          $("#weather_wind_current").append(Math.round(weather.wind.speed)+' mph winds')
          timestamp = weather.dt
          $("#weather_date_current").append('Updated: ' + timeFormat(timestamp))
          $.getJSON(openWeatherUV, { // UV Index
            lat: weather.coord.lat,
            lon: weather.coord.lon,
            units: 'imperial',
            APPID: API
          }).done(function(uv) {
            $("#weather_uv_current").append('UV Index: '+Math.round(uv.value))
          })
          $.getJSON(openWeatherForecast, { // 5 day Forecast
            lat: weather.coord.lat,
            lon: weather.coord.lon,
            units: 'imperial',
            APPID: API
          }).done(function(forecast) {
            //console.log(forecast)
            forecast.list.slice(0, 6).forEach(renderDay)
          })
        })
        
      } else {
        console.log('ERROR: Zip code is not 5 digits')
      }
    } else {
      $.getJSON(openWeatherMapCurrent, {
        q: locationInput,
        units: 'imperial',
        APPID: API
      }).done(function(weather) {
        //console.log(weather)
        $("#weather_city_current").append('<h2>'+weather.name+'</h2>')
        $("#weather_image_current").append('<img src="https://openweathermap.org/img/wn/'+weather.weather[0].icon+'@2x.png" />')
        $("#weather_temp_current").append('<h4>'+Math.round(weather.main.temp)+'<span class="temp_unit">° F</span></h4>')
        $("#weather_humidity_current").append(Math.round(weather.main.humidity)+'% Humidity')
        $("#weather_wind_current").append(Math.round(weather.wind.speed)+' mph winds')
        timestamp = weather.dt
        $("#weather_date_current").append('Updated: '+timeFormat(timestamp))
        $.getJSON(openWeatherUV, { // UV Index
          lat: weather.coord.lat,
          lon: weather.coord.lon,
          units: 'imperial',
          APPID: API
        }).done(function(uv) {
          $("#weather_uv_current").append('UV Index: '+Math.round(uv.value))
        })
        $.getJSON(openWeatherForecast, { // 5 day Forecast
          lat: weather.coord.lat,
          lon: weather.coord.lon,
          units: 'imperial',
          APPID: API
        }).done(function(forecast) {
          //console.log(forecast)
          forecast.list.slice(0, 6).forEach(renderDay)
        })
      })
    }
  } else {
    //console.log(locationInput+' Showing by IP location')
    $.getJSON(ipAPIUrl).done(function(location) {
      console.log('IP: '+location.ip)
      console.log('City: '+location.city)
      clearWeather()
      $.getJSON(openWeatherMapCurrent, {
        q: location.city,
        units: 'imperial',
        APPID: API
      }).done(function(weather) {
        //console.log(weather)
        $("#weather_city_current").append('<h2>'+weather.name+'</h2>')
        $("#weather_image_current").append('<img src="https://openweathermap.org/img/wn/'+weather.weather[0].icon+'@2x.png" />')
        $("#weather_temp_current").append('<h4>'+Math.round(weather.main.temp)+'<span class="temp_unit">° F</span></h4>')
        $("#weather_humidity_current").append(Math.round(weather.main.humidity)+'% Humidity')
        $("#weather_wind_current").append(Math.round(weather.wind.speed)+' mph winds')
        timestamp = weather.dt
        $("#weather_date_current").append('Updated: '+timeFormat(timestamp))
        $.getJSON(openWeatherUV, { // UV Index
          lat: weather.coord.lat,
          lon: weather.coord.lon,
          units: 'imperial',
          APPID: API
        }).done(function(uv) {
          $("#weather_uv_current").append('UV Index: '+Math.round(uv.value))
        })
        $.getJSON(openWeatherForecast, { // 5 day Forecast
          lat: weather.coord.lat,
          lon: weather.coord.lon,
          units: 'imperial',
          APPID: API
        }).done(function(forecast) {
          //console.log(forecast)
          forecast.list.slice(0, 6).forEach(renderDay)
        })
      })
    })
  }
}
function renderDay(item, index){
  //Wconsole.log(item)

  $("#weather_image_day"+index).append('<img src="https://openweathermap.org/img/wn/'+item.weather[0].icon+'@2x.png" />')
  $("#weather_temp_day"+index).append('<h4>'+Math.round(item.main.temp)+'<span class="temp_unit">° F</span></h4>')
  $("#weather_humidity_day"+index).append(Math.round(item.main.humidity)+'% Humidity')
  $("#weather_wind_day"+index).append(Math.round(item.wind.speed)+' mph winds')
  timestamp = item.dt_txt
  //$("#weather_date_day"+index).append(''+ timestamp.slice(0, 10))

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
  // Get the weather by IP on page load
  $.getJSON(ipAPIUrl).done(function(location) {
    console.log('IP: '+location.ip)
    console.log('City: '+location.city)
    clearWeather()
    $.getJSON(openWeatherMapCurrent, {
      q: location.city,
      units: 'imperial',
      APPID: API
    }).done(function(weather) {
      //console.log(weather)
      $("#weather_city_current").append('<h2>'+weather.name+'</h2>')
      $("#weather_image_current").append('<img src="https://openweathermap.org/img/wn/'+weather.weather[0].icon+'@2x.png" />')
      $("#weather_temp_current").append('<h4>'+Math.round(weather.main.temp)+'<span class="temp_unit">° F</span></h4>')
      $("#weather_humidity_current").append(Math.round(weather.main.humidity)+'% Humidity')
      $("#weather_wind_current").append(Math.round(weather.wind.speed)+' mph winds')
      timestamp = weather.dt
      $("#weather_date_current").append('Updated '+timeFormat(timestamp))
      $.getJSON(openWeatherUV, { // UV Index
        lat: weather.coord.lat,
        lon: weather.coord.lon,
        units: 'imperial',
        APPID: API
      }).done(function(uv) {
        $("#weather_uv_current").append('UV Index: '+Math.round(uv.value))
      })
      $.getJSON(openWeatherForecast, { // 5 day Forecast
        lat: weather.coord.lat,
        lon: weather.coord.lon,
        units: 'imperial',
        APPID: API
      }).done(function(forecast) {
        //console.log(forecast)
        forecast.list.slice(0, 6).forEach(renderDay)
      })
    })
  })
})
