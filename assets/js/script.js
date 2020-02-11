var API = '5ec45324b97dfab94d81259ceb9c7461'
var ipAPIUrl = 'https://ipapi.co/json/'
var openWeatherMapCurrent = 'https://api.openweathermap.org/data/2.5/weather'
var openWeatherUV = 'https://api.openweathermap.org/data/2.5/uvi?'
var openWeatherForecast = 'https://api.openweathermap.org/data/2.5/forecast?'
var locationInput
var timestamp
var searchHistory = new Array
var searchCombine = new Set([])
var city
var zip
var navCity
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
  $('#carousel-wrapper').empty()
  $(".weather_city").empty()
  $(".weather_image").empty()
  $(".weather_temp").empty()
  $(".weather_humidity").empty()
  $(".weather_wind").empty()
  $(".weather_date").empty()
  $(".weather_uv").empty()
}
function clearCities (){
  confirm("Remove search history?")
  localStorage.removeItem("weather_locations");
  M.toast({html: '<span style="color:#ec6e4c;font-weight:bold;padding-right:5px;">EMPTIED</span>&nbsp; No stored cities'})
}
function saveSearch(searchTerm){
	var searchHistory = new Set()
	var searchCombine = new Set()
	var searchTerm = searchTerm.trim() // Remove Whitespace
	if (!searchTerm){
    M.toast({html: '<span style="color:#ec6e4c;font-weight:bold;padding-right:5px;">ERROR</span>&nbsp; No criteria provided'})
  }
	if (JSON.parse(localStorage.getItem('weather_locations'))){
		searchHistory = JSON.parse(localStorage.getItem('weather_locations'))
		//searchHistory = ['San Francisco', 'Austin', 'Denver', 'Cleveland']
	}
	// Add the new search term
  searchHistory = Array.from(searchHistory)
  if (searchHistory.includes(searchTerm)){
    //M.toast({html: ''+searchTerm+' already stored'})
  } else {
    M.toast({html: '<span style="color:#15a548;font-weight:bold;padding-right:5px;">Saved</span>&nbsp; '+searchTerm+' Added'})
  }
	//searchHistory.push(searchTerm) // Either push, then remove duplicate on Set conversion
	searchCombine = new Set(searchHistory)
  searchCombine.add(searchTerm) // Or use add after Set conversion
  //console.log(searchCombine.size) // .size is .length for Sets
  if (searchCombine.size > 1){
    $(".carouselNav").show()
  } else {
    $(".carouselNav").hide()
  }
  console.log(searchCombine)
  localStorage.setItem('weather_locations', JSON.stringify(Array.from(searchCombine)))
}
function weatherSearch(locationInput) {
  if (locationInput){
    $(':focus').blur()
    $("#searchInput").val('')
    clearWeather()
    if ($.isNumeric(locationInput)){
      if (locationInput.toString().length === 5 && $.isNumeric(locationInput)){
        city = undefined
        getWeather(city, locationInput)        
      } else {
        M.toast({html: '<span style="color:#ec6e4c;font-weight:bold;padding-right:5px;">ERROR</span>&nbsp; Zip code is not 5 digits'})
      }
    } else {
      zip = undefined
      getWeather(locationInput, zip)
    }
  } else {
    M.toast({html: 'Fetching location by IP'})
    $.getJSON(ipAPIUrl).done(function(location) {
      //console.log('IP: '+location.ip)
      //console.log('City: '+location.city)
      clearWeather()
      zip = undefined
      getWeather(location.city, zip)
    })
  }
}
if (JSON.parse(localStorage.getItem('weather_locations'))){
  $(".carouselNav").show()
  searchHistory = JSON.parse(localStorage.getItem('weather_locations'))
  //searchHistory = ['San Francisco', 'Austin', 'Denver', 'Cleveland']
  for (let nameFetch of Array.from(searchHistory).reverse()) {
    weatherSearch(nameFetch)
  }
  console.log(searchHistory)
}
function getCarousel(name, icon, temp, humidity, wind, timestamp){
  city = name.toLowerCase().replace(/\s/g, '')
  $('#item_'+city).remove()
  $('#carousel-wrapper').append($('<div>', {id: 'item_'+city}))
  $('#item_'+city).attr('class', 'carousel-item');
  $('.carousel-item').append($('<div>', {class: 'weather-wrapper-current'}))
  $('#item_'+city+' .weather-wrapper-current').append($('<div>', {id: 'weather_city_'+city}))
  $('#weather_city_'+city).addClass("weather_city");
  $('#item_'+city+' .weather-wrapper-current').append($('<div>', {id: 'weather_image_'+city}))
  $('#weather_city_'+city).addClass("responsive-img weather_image");
  $('#item_'+city+' .weather-wrapper-current').append($('<div>', {id: 'weather_temp_'+city}))
  $('#weather_city_'+city).addClass("weather_temp");
  $('#item_'+city+' .weather-wrapper-current').append($('<div>', {id: 'weather_humidity_'+city}))
  $('#weather_city_'+city).addClass("weather_humidity");
  $('#item_'+city+' .weather-wrapper-current').append($('<div>', {id: 'weather_wind_'+city}))
  $('#weather_city_'+city).addClass("weather_wind");
  $('#item_'+city+' .weather-wrapper-current').append($('<div>', {id: 'weather_uv_'+city}))
  $('#weather_city_'+city).addClass("weather_uv");
  $('#item_'+city+' .weather-wrapper-current').append($('<div>', {id: 'weather_date_'+city}))
  $('#weather_city_'+city).addClass("weather_date");
  $("#weather_city_"+city).append('<h2>'+name+'</h2>')
  if (icon){
   $("#weather_image_"+city).append('<img src="https://openweathermap.org/img/wn/'+icon+'@2x.png" />')
  }
  $("#weather_temp_"+city).append('<h4>'+Math.round(temp)+'<span class="temp_unit">° F</span></h4>')
  $("#weather_humidity_"+city).append(Math.round(humidity)+'% Humidity')
  $("#weather_wind_"+city).append(Math.round(wind)+' mph winds')
  $("#weather_date_"+city).append('@'+timeFormat(timestamp))
  $(document).ready(function(){
    $('.carousel').carousel(
      {
        dist: 110,
        padding: 0,
        fullWidth: false,
        indicators: false,
        duration: 100,
      }
    )
  })
}
$(window).resize(function(){
  $('.carousel').carousel(
    {
      dist: 110,
      padding: 0,
      fullWidth: false,
      indicators: false,
      duration: 100,
    }
  )
})
$(".carouselLeft").click(function(){
  var instance = M.Carousel.getInstance($('.carousel'))
  instance.prev()
  if (city){
    getWeather(city)
    // weatherSearch(city)
  } else {
    //M.toast({html: '<span style="color:#ec6e4c;font-weight:bold;padding-right:5px;">ERROR</span>&nbsp; Only one city has been saved'})
  }
})
$(".carouselRight").click(function(){
  var instance = M.Carousel.getInstance($('.carousel'))
  instance.next()
  console.log(instance)
  if (city){
    getWeather(city)
    // weatherSearch(city)
  } else {
    //M.toast({html: '<span style="color:#ec6e4c;font-weight:bold;padding-right:5px;">ERROR</span>&nbsp; Only one city has been saved'})
  }
})
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
/*  console.log('AVG Avg: '+forecastAvg)
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
}
$(document).ready(function(){
  //console.log(JSON.parse(localStorage.getItem('weather_locations')))
  if (JSON.parse(localStorage.getItem('weather_locations'))){
    searchHistory = JSON.parse(localStorage.getItem('weather_locations'))
    //console.log(searchHistory)
    //searchHistory = ['San Francisco', 'Austin', 'Denver', 'Cleveland']
    for (let nameFetch of Array.from(searchHistory).reverse()) {
      weatherSearch(nameFetch)
    }
	} else {
    // Get the weather by IP on page load
    $(".carouselNav").hide()
    $.getJSON(ipAPIUrl).done(function(location) {
      //console.log('IP: '+location.ip)
      //console.log('City: '+location.city)
      clearWeather()
      weatherSearch(location.city)
    })
  }
  // Detect enter key press
  $('#searchInput').keypress(function(event){
    dayCount = 1
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
      event.preventDefault()
      $(".carouselNav").hide()
      locationInput = $.trim($("#searchInput").val())
      weatherSearch(locationInput)
    }
  })
  // Detect click on submit button
  $("#searchButton").click(function(event){
    dayCount = 1
    event.preventDefault()
    $(".carouselNav").hide()
    locationInput = $.trim($("#searchInput").val())
    weatherSearch(locationInput)
  })
})
function getWeather(city, zip){
  var openWeatherMapSettings
  if(zip){
    openWeatherMapSettings = {
      zip: zip,
      units: 'imperial',
      APPID: API
    }
  } else if (!city && !zip) {
    M.toast({html: '<span style="color:#ec6e4c;font-weight:bold;padding-right:5px;">ERROR</span>&nbsp; Missing city or zip'})
  } else {
    openWeatherMapSettings = {
      q: city,
      units: 'imperial',
      APPID: API
    }
  }
  $.getJSON(openWeatherMapCurrent, openWeatherMapSettings).done(function(weather) {
    //console.log(weather)
    city = weather.name
    city = city.toLowerCase().replace(/\s/g, '')
    getCarousel(weather.name, weather.weather[0].icon, weather.main.temp, weather.main.humidity, weather.wind.speed, weather.dt)
    $.getJSON(openWeatherUV, { // UV Index
      lat: weather.coord.lat,
      lon: weather.coord.lon,
      units: 'imperial',
      APPID: API
    }).done(function(uv) {
      $("#weather_uv_"+city).empty()
      $("#weather_uv_"+city).append('UV Index: '+Math.round(uv.value))
    })
    $.getJSON(openWeatherForecast, { // 5 day Forecast
      lat: weather.coord.lat,
      lon: weather.coord.lon,
      units: 'imperial',
      APPID: API
    }).done(function(forecast) {
      forecast.list.slice(0, 8).forEach(renderDay)
      forecast.list.slice(8, 16).forEach(renderDay)
      forecast.list.slice(16, 24).forEach(renderDay)
      forecast.list.slice(24, 32).forEach(renderDay)
      forecast.list.slice(32, 40).forEach(renderDay)
      $(".forecast-title").html('5 Day Forecast for '+weather.name)
    })
    saveSearch(weather.name)
  })
}