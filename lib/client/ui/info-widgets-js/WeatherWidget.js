/* eslint-env browser */
/* global Time */
var InfoWidgets = InfoWidgets || {};
InfoWidgets.Widgets = InfoWidgets.Widgets || {};
InfoWidgets.Widgets.count = 0;

InfoWidgets.Widgets.WeatherWidget = function() {
  "use strict";
  this.id = "widget-" + InfoWidgets.Widgets.count;
  this.time = new Date();
  this.tick = Time.startTicker(InfoWidgets.Widgets.WeatherWidget.INTERNAL_UPDATE_INTERVAL,
    this.updateTime.bind(this));
  this.el = undefined;
  InfoWidgets.Widgets.count++;
};

InfoWidgets.Widgets.WeatherWidget.INTERNAL_UPDATE_INTERVAL = 1000;

InfoWidgets.Widgets.WeatherWidget.WEATHER_CODES = {
  "thunderstorm": [200, 232, ],
  "drizzle": [300, 321, ],
  "rain": [500, 522, ],
  "snow": [600, 621, ],
  "clear": [800, 800, ],
  "clouds": [801, 804, ],
};

InfoWidgets.Widgets.WeatherWidget.weatherIdToIcon = function(id) {
  "use strict";
  var key, range, codes = InfoWidgets.Widgets.WeatherWidget.WEATHER_CODES;
  for (key in codes) {
    if (codes.hasOwnProperty(key)) {
      range = codes[key];
      if ((id >= range[0]) && (id <= range[1])) {
        return "info-widgets-weather-widget-icon-" + key;
      }
    }
  }
  return undefined;
};

InfoWidgets.Widgets.WeatherWidget.prototype.setPosition = function(position) {
  "use strict";
  this.position = position;
  this.el.style.top = this.position.top || "";
  this.el.style.bottom = this.position.bottom || "";
  this.el.style.left = this.position.left || "";
  this.el.style.right = this.position.right || "";
};

InfoWidgets.Widgets.WeatherWidget.prototype.updateTime = function() {
  "use strict";
  var date = new Date();
  if(!this.el) {
    return;
  }
  this.clockEl = this.clockEl || this.el.querySelector(
    ".info-widgets-weather-widget-clock");
  this.dateEl = this.dateEl || this.el.querySelector(
    ".info-widgets-weather-widget-date");
  this.clockEl.innerHTML = Time.getFormatedDate(date, "HH:MM");
  this.dateEl.innerHTML = Time.getFormatedDate(date, "wd, DD. mo");
};

InfoWidgets.Widgets.WeatherWidget.prototype.setWeatherInformation = function(
  weather) {
  "use strict";
  this.tempEl = this.tempEl || this.el.querySelector(
    ".info-widgets-weather-widget-temp");
  this.statusEl = this.statusEl || this.el.querySelector(
    ".info-widgets-weather-widget-status");
  this.iconEl = this.iconEl || this.el.querySelector(
    ".info-widgets-weather-widget-icon");

  this.tempEl.innerHTML = weather.temp;
  this.statusEl.innerHTML = weather.status;
  this.iconEl.className = "info-widgets-weather-widget-icon " + InfoWidgets.Widgets
    .WeatherWidget.weatherIdToIcon(weather.id);
};

InfoWidgets.Widgets.WeatherWidget.prototype.setForecastInformationForNext3Hours = function(
  weather) {
  "use strict";
  this.forecast3hTemp = this.forecast3hTemp || this.el.querySelector(
    ".info-widgets-weather-widget-forecast-information.next .forecast-temp");
  this.forecast3hStatus = this.forecast3hStatus || this.el.querySelector(
    ".info-widgets-weather-widget-forecast-information.next .forecast-status");

  this.forecast3hTemp.innerHTML = weather.temp;
  this.forecast3hStatus.innerHTML = weather.status;
};

InfoWidgets.Widgets.WeatherWidget.prototype.setForecastInformationForTomorrow = function(
  weather) {
  "use strict";
  this.forecastTomorrowTemp = this.forecastTomorrowTemp || this.el.querySelector(
    ".info-widgets-weather-widget-forecast-information.tomorrow .forecast-temp");
  this.forecastTomorrowStatus = this.forecastTomorrowStatus || this.el.querySelector(
    ".info-widgets-weather-widget-forecast-information.tomorrow .forecast-status");

  this.forecastTomorrowTemp.innerHTML = weather.temp;
  this.forecastTomorrowStatus.innerHTML = weather.status;
};

InfoWidgets.Widgets.WeatherWidget.prototype.getNode = function() {
  "use strict";
  this.el = this.el || (function(that) {
    var el = document.createElement("div");
    el.innerHTML =
      "<div class='info-widgets-weather-widget' data-id=''>\
                <span class='info-widgets-weather-widget-clock'></span>\
                <span class='info-widgets-weather-widget-date'></span>\
                <span class='info-widgets-weather-widget-weather-information'>\
                    <span class='info-widgets-weather-widget-icon'></span>\
                    <span class='info-widgets-weather-widget-temp'></span>\
                    <span class='info-widgets-weather-widget-status'></span>\
                </span>\
                <span class='info-widgets-weather-widget-forecast-information next'>\
                <span class='forecast-label'>Demnächst:</span>\
                <span class='forecast-status'></span>\
                <span class='forecast-temp'></span>\
                </span>\
                 <span class='info-widgets-weather-widget-forecast-information tomorrow'>\
                <span class='forecast-label'>Morgen:</span>\
                <span class='forecast-status'></span>\
                <span class='forecast-temp'></span>\
                </span>\
            </div>";
    that.updateTime();
    return el.firstChild;
  }(this));
  return this.el;
};
