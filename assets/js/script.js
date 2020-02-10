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
    console.log('Searching: '+locationInput)
    clearWeather()
    if ($.isNumeric(locationInput)){
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
            console.log(forecast)
            forecast.list.slice(0, 8).forEach(renderDay)
            forecast.list.slice(8, 16).forEach(renderDay)
            forecast.list.slice(16, 24).forEach(renderDay)
            forecast.list.slice(24, 32).forEach(renderDay)
            forecast.list.slice(32, 40).forEach(renderDay)
          })
        })
        
      } else {
        M.toast({html: '<span style="color:#ec6e4c;font-weight:bold;padding-right:5px;">ERROR</span>&nbsp; Zip code is not 5 digits'})
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
          console.log(forecast)
          forecast.list.slice(0, 8).forEach(renderDay)
          forecast.list.slice(8, 16).forEach(renderDay)
          forecast.list.slice(16, 24).forEach(renderDay)
          forecast.list.slice(24, 32).forEach(renderDay)
          forecast.list.slice(32, 40).forEach(renderDay)
        })
      })
    }
  } else {
    console.log(locationInput+' Showing by IP location')
    $.getJSON(ipAPIUrl).done(function(location) {
      //console.log('IP: '+location.ip)
      //console.log('City: '+location.city)
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
          console.log(forecast)
          forecast.list.slice(0, 8).forEach(renderDay)
          forecast.list.slice(8, 16).forEach(renderDay)
          forecast.list.slice(16, 24).forEach(renderDay)
          forecast.list.slice(24, 32).forEach(renderDay)
          forecast.list.slice(32, 40).forEach(renderDay)
        })
      })
    })
  }
}
function dayOfWeek(i){
  var day=new Date();
  var weekday=new Array(7);
  weekday[0]="Sunday";
  weekday[1]="Monday";
  weekday[2]="Tuesday";
  weekday[3]="Wednesday";
  weekday[4]="Thursday";
  weekday[5]="Friday";
  weekday[6]="Saturday";
  dayOfWeekReturn = weekday[(day.getDay()) + i % 7]
  return dayOfWeekReturn
}
$("#DoW_1").append(dayOfWeek(1))
$("#DoW_2").append(dayOfWeek(2))
$("#DoW_3").append(dayOfWeek(3))
$("#DoW_4").append(dayOfWeek(4))
$("#DoW_5").append(dayOfWeek(5))
var trackTemp = new Array();
var trackHumidity = new Array();
var trackWind = new Array();
var trackIcon = new Array();
var dayCount = 1
function renderDay(item, index){
  if (index === 0){
    trackTemp.push(item.main.temp)
    trackHumidity.push(item.main.humidity)
    trackWind.push(item.wind.speed)
    trackIcon.push(item.weather[0].icon)
  } else if (index < 7) {
    trackTemp.push(item.main.temp)
    trackHumidity.push(item.main.humidity)
    trackWind.push(item.wind.speed)
    trackIcon.push(item.weather[0].icon)
  } else {
    trackTemp.push(item.main.temp)
    trackHumidity.push(item.main.humidity)
    trackWind.push(item.wind.speed)
    trackIcon.push(item.weather[0].icon)
    var forecastHigh = new Array();
    var forecastLow = new Array();
    var forecastHumidity = new Array();
    var forecastWind = new Array();
    forecastHigh = Math.round(Math.max.apply(Math, trackTemp.toString().split(",")))
    forecastLow = Math.round(Math.min.apply(Math, trackTemp.toString().split(",")))
    forecastAvg = Math.round(trackTemp.reduce((a,b) => a + b, 0) / trackTemp.length)
    forecastHumidity = Math.round(trackHumidity.reduce((a,b) => a + b, 0) / trackHumidity.length)
    forecastWind = Math.round(trackWind.reduce((a,b) => a + b, 0) / trackWind.length)
/*     console.log('AVG Avg: '+forecastAvg)
    console.log('AVG High: '+forecastHigh)
    console.log('AVG Low: '+forecastLow)
    console.log('AVG Humidity: '+forecastHumidity)
    console.log('AVG Wind: '+forecastWind)
    console.log("#weather_image_day"+dayCount)  */
    $("#weather_image_day"+dayCount).append('<img src="https://openweathermap.org/img/wn/'+item.weather[0].icon+'@2x.png" />')
    $("#weather_temp_day"+dayCount).append('<h4><span class="temp_high">'+ forecastHigh +'°</span> <span class="temp_low">'+ forecastLow +'°</span></h4>')
    $("#weather_humidity_day"+dayCount).append(forecastHumidity + '% Humidity')
    $("#weather_wind_day"+dayCount).append(forecastWind+' mph winds') 
    trackTemp = []
    trackHumidity = []
    trackWind = []
    dayCount = dayCount+1
  }
  timestamp = item.dt_txt
  //$("#weather_date_day"+index).append(''+ timestamp.slice(0, 10))
}
$(document).ready(function(){
  // Detect enter key press
  $('#searchInput').keypress(function(event){
    dayCount = 1
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
      event.preventDefault()
      locationInput = $.trim($("#searchInput").val())
      weatherSearch(locationInput)
    }
  })
  // Detect click on submit button
  $("#searchButton").click(function(event){
    dayCount = 1
    event.preventDefault()
    locationInput = $.trim($("#searchInput").val())
    weatherSearch(locationInput)
  })
  // Get the weather by IP on page load
  $.getJSON(ipAPIUrl).done(function(location) {
/*  console.log('IP: '+location.ip)
    console.log('City: '+location.city) */
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
        console.log(forecast)
        forecast.list.slice(0, 8).forEach(renderDay)
        forecast.list.slice(8, 16).forEach(renderDay)
        forecast.list.slice(16, 24).forEach(renderDay)
        forecast.list.slice(24, 32).forEach(renderDay)
        forecast.list.slice(32, 40).forEach(renderDay)
      })
    })
  })
})
$(document).ready(function(){
  $('.carousel').carousel();
});