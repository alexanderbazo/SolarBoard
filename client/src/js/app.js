/* eslint-env browser */
/* global DataWidgets, InfoWidgets, SolarBoard, Time */

var App = App || {};
App.SolarBoard = (function() {
  "use strict";

  var that = {},
    sb,
    widgets,
    battery,
    power,
    load,
    week,
    grid,
    weather;

  function onTick(clockEl, dateEl, date) {
    if (!sb) {
      return;
    }
    sb.update().then(function(result) {
      onDataAvailable(result);
    });
  }

  function onDataAvailable(data) {
    var peakPower = data.peakPower,
      currentPower = data.siteCurrentPowerFlow.PV.currentPower,
      currentLoad = data.siteCurrentPowerFlow.LOAD.currentPower,
      currentGridPower = data.siteCurrentPowerFlow.GRID.currentPower,
      currentBatteryLevel = data.siteCurrentPowerFlow.STORAGE.chargeLevel,
      lastPowerFlowUpdateDelta = Date.now() - data.lastUpdateOfPowerFlowInformation,
      lastEnergyDetailsUpdateDelta = Date.now() - data.lastUpdateOfEnergyInformation,
      updateDeltaInMinutes = (lastPowerFlowUpdateDelta / 60000).toFixed(0),
      energyUpdateInMinutes = (lastEnergyDetailsUpdateDelta / 60000).toFixed(
        0);
    console.log(data);
    week.setStatusText("Aktualisiert vor " + energyUpdateInMinutes + " min");

    power.setValue(currentPower.toFixed(1), peakPower);
    power.setStatusIcon("pv-" + data.siteCurrentPowerFlow.PV.status.toLowerCase());
    power.setStatusText("Aktualisiert vor " + updateDeltaInMinutes + " min");

    battery.setValue(currentBatteryLevel);
    battery.setStatusIcon("battery-" + data.siteCurrentPowerFlow.STORAGE.status
      .toLowerCase());
    battery.setStatusText("Aktualisiert vor " + updateDeltaInMinutes +
      " min");

    load.setValue(currentLoad.toFixed(1), peakPower);
    load.setStatusText("Aktualisiert vor " + updateDeltaInMinutes + " min");

    grid.setValue(Math.abs(currentGridPower.toFixed(2)), peakPower);
    grid.setStatusIcon("");
    grid.setStatusText("Aktualisiert vor " + updateDeltaInMinutes + " min");
    if (currentGridPower > 0) {
      grid.setStatusIcon("grid-selling");
    } else if (currentGridPower < 0) {
      grid.setStatusIcon("grid-buying");
    }
    weather.setWeatherInformation({
      temp: data.currentWeather.main.temp.toFixed(0),
      status: data.currentWeather.weather[0].description,
      id: data.currentWeather.weather[0].id,
    });
  }

  function init() {
    initWidgets();
    initClient(@@SITE_ID);
    Time.startTicker(60000, onTick.bind(this));
  }

  function initWidgets() {
    widgets = DataWidgets.createContainer(document.querySelector(
      ".widget-container-stats"));
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
    widgets.addWidget(power);
    widgets.addWidget(load);
    widgets.addWidget(battery);
    widgets.addWidget(grid);
    widgets.addWidget(week);
    widgets.render();

    weather = new InfoWidgets.Widgets.WeatherWidget();
    InfoWidgets.renderWidgetIn(weather, document.querySelector(
      ".widget-container-weather"));
  }

  function initClient(siteID) {
    sb = SolarBoard.connect("http://localhost:8888", siteID);
    sb.update().then(function(result) {
      onDataAvailable(result);
    });
  }

  that.init = init;
  return that;
}());

App.SolarBoard.init();
