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
    switch (type) {
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
    switch (type) {
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
    switch (type) {
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
    var x = 0,
      meterIndex, label, color, position, valueIndex, date, valueSum, data = [];
    for (meterIndex = 0; meterIndex < energyDetails.meters.length; meterIndex++) {
      if (energyDetails.meters[meterIndex].type === "SelfConsumption") {
        continue;
      }
      label = getEnergyLabel(energyDetails.meters[meterIndex].type);
      color = getEneryColor(energyDetails.meters[meterIndex].type);
      position = getEneryPosition(energyDetails.meters[meterIndex].type);
      valueSum = 0;
      for (valueIndex = energyDetails.meters[meterIndex].values
        .length - 1; valueIndex >= 0; valueIndex--) {
        date = new Date(energyDetails.meters[meterIndex].values[valueIndex]
          .date);
        if (date.getDay() === 1 && date.getHours() === 0) {
          data.lastDateInDataSet = date;
          break;
        }
        valueSum += (energyDetails.meters[meterIndex].values[valueIndex].value ||
          0);
      }
      valueSum = parseInt((valueSum / 1000).toFixed(0));
      data[position] = {
        label: label,
        value: valueSum,
        unit: "k" + energyDetails.unit,
        color: color
      };
    }
    return data;
  }

  function getWeatherForecastForTomorrow(forecast) {
    var forecastIndex, status, maxTemp = -100,
      statusFrequence = {},
      mostFrequentStatus = "",
      maxStatusFrequence = 0,
      description, count = 0,
      date, now = new Date();
    for (forecastIndex = 0; forecastIndex < forecast.length; forecastIndex++) {
      date = new Date(forecast[forecastIndex].dt * 1000);
      if (date.getDay() === now.getDay()) {
        continue;
      }
      if (count >= 8) {
        break;
      }
      if (forecast[forecastIndex].main.temp > maxTemp) {
        maxTemp = forecast[forecastIndex].main.temp;
      }
      description = forecast[forecastIndex].weather[0].description;
      if (!statusFrequence[description]) {
        statusFrequence[description] = 0;
      }
      statusFrequence[description]++;
      count++;
    }
    for (status in statusFrequence) {
      if (statusFrequence.hasOwnProperty(status)) {
       if(statusFrequence[status] > maxStatusFrequence) {
        maxStatusFrequence = statusFrequence[status];
        mostFrequentStatus = status;
       }
      }
    }
    return {
      temp: parseInt(maxTemp.toFixed(0)),
      status: mostFrequentStatus,
    };
  }

  function onDataAvailable(data) {
    var peakPower = data.peakPower,
      currentPower = parseFloat(data.siteCurrentPowerFlow.PV.currentPower.toFixed(
        1)),
      currentLoad = parseFloat(data.siteCurrentPowerFlow.LOAD.currentPower.toFixed(
        1)),
      currentGridPower = parseFloat(data.siteCurrentPowerFlow.GRID.currentPower
        .toFixed(
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
      updateDeltaInMinutes = parseInt((lastPowerFlowUpdateDelta / 60000).toFixed(
        0)),
      energyUpdateInMinutes = (lastEnergyDetailsUpdateDelta / 60000).toFixed(
        0),
      currentTemp = parseInt(data.currentWeather.main.temp.toFixed(0)),
      currentWeatherStatus = data.currentWeather.weather[0].description,
      currentWeatherCode = data.currentWeather.weather[0].id,
      forecast3hTemp = parseInt(data.forecast.list[0].main.temp.toFixed(0)),
      forecast3hWeatherStatus = data.forecast.list[0].weather[0].description,
      forecastTomorrow = getWeatherForecastForTomorrow(data.forecast.list),
      weekData = getWeekData(data.energyDetails),
      weekDataDescription = Time.getFormatedDate(weekData.lastDateInDataSet,
        "Daten seit wd, DD. mo HH:MM Uhr");
    if (currentGridPower === 0) {
      currentGridStatus = "";
    }
    view.updateWeekWidget(weekData, energyUpdateInMinutes,
      weekDataDescription);
    view.updatePowerWidget(currentPower, peakPower, currentPowerStatus,
      updateDeltaInMinutes);
    view.updateBatteryWidget(currentBatteryLevel, undefined,
      currentBatteryStatus, updateDeltaInMinutes);
    view.updateLoadWidget(currentLoad, peakPower, "", updateDeltaInMinutes);
    view.updateGridWidget(Math.abs(currentGridPower), peakPower,
      currentGridStatus, updateDeltaInMinutes);
    view.updateWeatherWidget({
      temp: currentTemp,
      status: currentWeatherStatus,
      weatherCode: currentWeatherCode,
    }, {
      temp: forecast3hTemp,
      status: forecast3hWeatherStatus,
    }, forecastTomorrow);
    view.updateGraphWidget(data.energyDetails);
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
    sb = SolarBoard.connect("", siteID);
    sb.update().then(function(result) {
      onDataAvailable(result);
    });
  }

  that.init = init;
  return that;
}());
