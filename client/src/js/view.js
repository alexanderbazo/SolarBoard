/* eslint-env browser */
/* global DataWidgets, InfoWidgets */

var App = App || {};
App.View = (function() {
  "use strict";

  var that = {},
    DEFAULT_UPDATE_TEXT = "Aktualisiert vor {{DELTA}} min",
    widgets,
    battery,
    power,
    load,
    week,
    grid,
    weather;

  function updateGaugeWidget(widget, value, maxValue, icon, delta) {
    var max = maxValue || 100;
    widget.setValue(value, max);
    widget.setStatusIcon(icon);
    widget.setStatusText(DEFAULT_UPDATE_TEXT.replace("{{DELTA}}", delta));
  }

  function updateWeatherWidget(widget, temp, status, weatherCode) {
    widget.setWeatherInformation({
      temp: temp,
      status: status,
      id: weatherCode,
    });
  }

  function updateBarWidget(widget, data, delta) {
    widget.setStatusText(DEFAULT_UPDATE_TEXT.replace("{{DELTA}}", delta));
    widget.renderData(data);
  }

  function init() {
    initWidgets();
    that.updateBatteryWidget = updateGaugeWidget.bind(this, battery);
    that.updatePowerWidget = updateGaugeWidget.bind(this, power);
    that.updateLoadWidget = updateGaugeWidget.bind(this, load);
    that.updateGridWidget = updateGaugeWidget.bind(this, grid);
    that.updateWeatherWidget = updateWeatherWidget.bind(this, weather);
    that.updateWeekWidget = updateBarWidget.bind(this, week);
    return that;
  }

  function initWidgets() {
    battery = new DataWidgets.Widgets.GaugeWidget("Batterie",
      "Aktueller Batteriereserve", "percentage", 0, "green");
    power = new DataWidgets.Widgets.GaugeWidget("Leistung",
      "Aktuelle Leistung der PV-Anlage", "kw", 0, "orange");
    load = new DataWidgets.Widgets.GaugeWidget("Verbrauch",
      "Aktueller Gesamtverbrauch des Haushalts", "kw", 0, "red");
    grid = new DataWidgets.Widgets.GaugeWidget("Netz",
      "Aktuelle Last zwischen Netz und Anlage", "kw", 0,
      "blue");
    week = new DataWidgets.Widgets.BarWidget("Werte der letzten Woche",
      "Produktions- und Verbrauchswerte der letzen 7 Tage", "purple");
    weather = new InfoWidgets.Widgets.WeatherWidget();
    widgets = DataWidgets.createContainer(document.querySelector(
      ".widget-container-stats"));
    widgets.addWidget(power);
    widgets.addWidget(load);
    widgets.addWidget(battery);
    widgets.addWidget(grid);
    widgets.addWidget(week);
    widgets.render();
    InfoWidgets.renderWidgetIn(weather, document.querySelector(
      ".widget-container-weather"));
  }

  that.init = init;
  return that;
}());
