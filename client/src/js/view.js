/* eslint-env browser */
/* global DataWidgets, InfoWidgets */

var App = App || {};
App.View = (function() {
  "use strict";

  var that = {},
    DEFAULT_UPDATE_TEXT = "Aktualisiert vor {{DELTA}} min",
    widgets,
    graphs,
    battery,
    power,
    load,
    week,
    grid,
    statsGraph,
    weather;

  function updateGaugeWidget(widget, value, maxValue, icon, delta) {
    var max = maxValue || 100;
    widget.setValue(value, max);
    widget.setStatusIcon(icon);
    widget.setStatusText(DEFAULT_UPDATE_TEXT.replace("{{DELTA}}", delta));
  }

  function updateWeatherWidget(widget, weather, forecast3h,
    forecastTomorrow) {
    widget.setWeatherInformation({
      temp: weather.temp,
      status: weather.status,
      id: weather.weatherCode,
    });
    widget.setForecastInformationForNext3Hours({
      temp: forecast3h.temp,
      status: forecast3h.status,
    });
    widget.setForecastInformationForTomorrow({
      temp: forecastTomorrow.temp,
      status: forecastTomorrow.status,
    });
  }

  function updateBarWidget(widget, data, delta, description) {
    widget.setStatusText(DEFAULT_UPDATE_TEXT.replace("{{DELTA}}", delta));
    widget.renderData(data);
    widget.setDescription(description);
  }

  function updateGraphWidget(widget, data, description) {
    var i,
      graphData = {
        series: data.meters,
        timeUnit: data.timeUnit,
        title: "Verlauf der letzen Woche",
        unit: data.unit,
      };
    for (i = 0; i < graphData.series.length; i++) {
      switch (graphData.series[i].type) {
        case "Production":
          graphData.series[i].color = "orange";
          graphData.series[i].label = "Produktion";
          break;
        case "Consumption":
          graphData.series[i].color = "red";
          graphData.series[i].label = "Verbrauch";
          break;
        case "Purchased":
          graphData.series[i].color = "blue";
          graphData.series[i].label = "Eingekauft";
          break;
        case "FeedIn":
          graphData.series[i].color = "green";
          graphData.series[i].label = "Eingespeist";
          break;
        case "SelfConsumption":
          graphData.series[i].color = "white";
          graphData.series[i].label = "Eigenverbrauch";
          break;
        default:
          break;
      }
    }
    widget.renderData(graphData);
  }

  function init() {
    initWidgets();
    that.updateBatteryWidget = updateGaugeWidget.bind(this, battery);
    that.updatePowerWidget = updateGaugeWidget.bind(this, power);
    that.updateLoadWidget = updateGaugeWidget.bind(this, load);
    that.updateGridWidget = updateGaugeWidget.bind(this, grid);
    that.updateWeatherWidget = updateWeatherWidget.bind(this, weather);
    that.updateWeekWidget = updateBarWidget.bind(this, week);
    that.updateGraphWidget = updateGraphWidget.bind(this, statsGraph);
    return that;
  }

  function initWidgets() {
    battery = new DataWidgets.Widgets.GaugeWidget("Batterie",
      "Aktueller Ladestand der Batterie", "percentage", 0, "green");
    power = new DataWidgets.Widgets.GaugeWidget("Leistung",
      "Aktuelle Produktionsleistung der PV-Anlage", "kw", 0, "orange");
    load = new DataWidgets.Widgets.GaugeWidget("Verbrauch",
      "Aktueller Gesamtverbrauch des Haushalts", "kw", 0, "red");
    grid = new DataWidgets.Widgets.GaugeWidget("Netz",
      "Aktuelle Last zwischen Netz und Anlage", "kw", 0,
      "blue");
    week = new DataWidgets.Widgets.BarWidget("Werte der letzten Woche",
      "", "purple");
    weather = new InfoWidgets.Widgets.WeatherWidget();
    statsGraph = new DataWidgets.Widgets.GraphWidget("Verlauf", "Verlauf",
      "purple");
    widgets = DataWidgets.createContainer(document.querySelector(
      ".widget-container-stats"));
    graphs = DataWidgets.createContainer(document.querySelector(
      ".widget-container-graphs"));
    widgets.addWidget(power);
    widgets.addWidget(load);
    widgets.addWidget(battery);
    widgets.addWidget(grid);
    widgets.addWidget(week);
    widgets.render();
    graphs.addWidget(statsGraph);
    graphs.render();
    InfoWidgets.renderWidgetIn(weather, document.querySelector(
      ".widget-container-weather"));
  }

  that.init = init;
  return that;
}());
