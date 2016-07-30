/* eslint-env browser */
/* global SolarBoard, Time */

var App = App || {};
App = (function() {
  "use strict";

  var that = {},
    sb,
    view;

  function onTick() {
    if (!sb) {
      return;
    }
    sb.update().then(function(result) {
      onDataAvailable(result);
    });
  }

  function getEnergyLabel(type) {
    switch(type) {
      case "Purchased":
        return "Gekauft";
      case "Consumption":
        return "Verbraucht";
      case "Production":
        return "Produziert";
      case "FeedIn":
        return "Eingespeist";
    }
    return "Unkown";
  }

  function getEneryColor(type) {
    switch(type) {
      case "Purchased":
        return "blue";
      case "Consumption":
        return "red";
      case "Production":
        return "orange";
      case "FeedIn":
        return "green";
    }
    return "Unkown";
  }

  function getEneryPosition(type) {
    switch(type) {
      case "Purchased":
        return 3;
      case "Consumption":
        return 1;
      case "Production":
        return 0;
      case "FeedIn":
        return 2;
    }
    return -1;
  }

  function getWeekData(energyDetails) {
    var meterIndex, label, color, position, valueIndex, valueSum, data = [];
    for (meterIndex = 0; meterIndex < energyDetails.meters.length; meterIndex++) {
      if(energyDetails.meters[meterIndex].type === "SelfConsumption") {
        continue;
      }
      label = getEnergyLabel(energyDetails.meters[meterIndex].type);
      color = getEneryColor(energyDetails.meters[meterIndex].type);
      position = getEneryPosition(energyDetails.meters[meterIndex].type);
      valueSum = 0;
      for (valueIndex = 0; valueIndex < energyDetails.meters[meterIndex].values
        .length; valueIndex++) {
        valueSum += (energyDetails.meters[meterIndex].values[valueIndex].value || 0);
      }
      valueSum = parseInt((valueSum/1000).toFixed(0));
      data[position] = { label: label, value: valueSum, unit: "K" + energyDetails.unit, color: color};
    }
    return data;
  }

  function onDataAvailable(data) {
    console.log(data);
    var peakPower = data.peakPower,
      currentPower = parseFloat(data.siteCurrentPowerFlow.PV.currentPower.toFixed(1)),
      currentLoad = parseFloat(data.siteCurrentPowerFlow.LOAD.currentPower.toFixed(1)),
      currentGridPower = parseFloat(data.siteCurrentPowerFlow.GRID.currentPower.toFixed(
        2)),
      currentBatteryLevel = data.siteCurrentPowerFlow.STORAGE.chargeLevel,
      currentPowerStatus = "pv-" + data.siteCurrentPowerFlow.PV.status.toLowerCase(),
      currentBatteryStatus = "battery-" + data.siteCurrentPowerFlow.STORAGE
      .status
      .toLowerCase(),
      currentGridStatus = (currentGridPower > 0) ? "grid-selling" :
      "grid-buying",
      lastPowerFlowUpdateDelta = Date.now() - data.lastUpdateOfPowerFlowInformation,
      lastEnergyDetailsUpdateDelta = Date.now() - data.lastUpdateOfEnergyInformation,
      updateDeltaInMinutes = parseInt((lastPowerFlowUpdateDelta / 60000).toFixed(0)),
      energyUpdateInMinutes = (lastEnergyDetailsUpdateDelta / 60000).toFixed(
        0),
      currentTemp = parseInt(data.currentWeather.main.temp.toFixed(0)),
      currentWeatherStatus = data.currentWeather.weather[0].description,
      currentWeatherCode = data.currentWeather.weather[0].id,
      weekData = getWeekData(data.energyDetails);

    console.log(weekData);
    if (currentGridPower === 0) {
      currentGridStatus = "";
    }
    view.updateWeekWidget(weekData, energyUpdateInMinutes);
    view.updatePowerWidget(currentPower, peakPower, currentPowerStatus,
      updateDeltaInMinutes);
    view.updateBatteryWidget(currentBatteryLevel, undefined,
      currentBatteryStatus, updateDeltaInMinutes);
    view.updateLoadWidget(currentLoad, peakPower, "", updateDeltaInMinutes);
    view.updateGridWidget(Math.abs(currentGridPower), peakPower,
      currentGridStatus, updateDeltaInMinutes);
    view.updateWeatherWidget(currentTemp, currentWeatherStatus,
      currentWeatherCode);
  }

  function init() {
    initView();
    initClient(@@SITE_ID);
    Time.startTicker(300000, onTick.bind(this));
  }

  function initView() {
    view = App.View.init();
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
