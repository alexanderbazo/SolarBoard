/* eslint-env node */
"use strict";

var Promise = require("promise"),
  request = require("request"),
  TIME = require("./Time.js"),
  API = require("./SolarEdgeApiHelper.js");

class SiteService {

  constructor() {
    this.UPDATE_RANGE_WEEKLY = 7;
    this.UPDATE_RANGE_HOURLY = 1;
    this.sites = {};
    this.updateTargets = {};
    this.updateTargets[API.AVAILABLE_ENDPOINTS.GENERAL.key] = this.updateSiteInformation
      .bind(this);
    this.updateTargets[API.AVAILABLE_ENDPOINTS.ENERGY.key] = this.updateEnergyInformation
      .bind(this);
    this.updateTargets[API.AVAILABLE_ENDPOINTS.FLOW.key] = this.updatePowerFlow
      .bind(this);
    this.updateTargets[API.AVAILABLE_ENDPOINTS.WEATHER.key] = this.updateWeatherInformation
      .bind(this);
    this.updateTargets[API.AVAILABLE_ENDPOINTS.FORECAST.key] = this.updateForecastInformation
      .bind(this);
    Object.freeze(this.updateTargets);
  }

  registerSite(site, targets) {
    if (this.sites.hasOwnProperty(site.id)) {
      return undefined;
    }
    this.sites[site.id] = {
      id: site.id,
      site: site,
      targets: targets || API.getAvailableEndpointKeys(),
    };
    return site.id;
  }

  deregisterSite(site) {
    if (!this.sites.hasOwnProperty(site.id)) {
      return undefined;
    }
    delete this.sites[site.id];
    return site.id;
  }

  getSite(id, cached) {
    var that = this,
      sitePromise = new Promise(function(resolve, reject) {
        if (!that.sites[id]) {
          reject(undefined);
        }
        if (cached === true) {
          resolve(that.sites[id].site);
        } else {
          that.updateSite(id).then(function(result) {
            resolve(result);
          });
        }
      });
    return sitePromise;
  }

  getUpdateTargets() {
    return this.updateTarget;
  }

  updateSiteState(site, state) {
    var property;
    for (property in state) {
      if (state.hasOwnProperty(property)) {
        site[property] = state[property];
      }
    }
  }

  updateSite(id) {
    var index, that = this,
      now = Date.now(),
      lastUpdate,
      defaultUpdateInterval,

      updateTargets = this.sites[id].targets || API.getAvailableEndpointKeys(),
      promises = [];

    if (!this.sites[id]) {
      return undefined;
    }

    for (index = 0; index < updateTargets.length; index++) {
      if (this.updateTargets[updateTargets[index]]) {
        lastUpdate = this.sites[id].site.getTimeOfLastUpdateForTarget(
          updateTargets[
            index]);
        defaultUpdateInterval = API.getDefaultUpdateIntervalForEndpoint(
          updateTargets[index]);

        if (!lastUpdate || (now - lastUpdate) >= defaultUpdateInterval) {
          promises.push(this.updateTargets[updateTargets[index]](this.sites[
              id]
            .site));
        } else {
          console.log("Information for [" + updateTargets[index] +
            "] requested but cached version will be served.");
        }
      }
    }
    return new Promise(function(resolve, reject) {
      Promise.all(promises).then(function(result) {
        for (index = 0; index < result.length; index++) {
          that.updateSiteState(that.sites[id].site, result[index].data);
        }
        resolve(that.sites[id].site);
      });
    });
  }

  updateSiteInformation(site) {
    var updatePromise = new Promise(function(resolve, reject) {
      var route = API.createSiteInformationRoute({
        id: site.id,
        key: site
          .key,
      });
      request(route, function(error, response, body) {
        var result;
        if (error) {
          reject();
        }
        result = JSON.parse(body).details;
        result.location = result.location || {};
        resolve({
          type: API.AVAILABLE_ENDPOINTS.GENERAL.key,
          data: {
            name: result.name,
            accountId: result.accountId,
            status: result.status,
            peakPower: result.peakPower,
            lastUpdateTime: result.lastUpdateTime,
            lastUpdateOfGeneralInformation: Date.now(),
            currency: result.currency,
            installationDate: result.installationDate,
            notes: result.notes,
            type: result.type,
            location: {
              country: result.location.country,
              city: result.location.city,
              address: result.location.address,
              address2: result.location.address2,
              zip: result.location.zip,
              timeZone: result.location.timeZone,
              countryCode: result.location.countryCode,
            },
            alertQuantity: result.alertQuantity,
            alertSeverity: result.alertSeverity,
          },
        });
      });
    });
    return updatePromise;
  }

  updateEnergyInformation(site) {
    var that = this,
      updatePromise = new Promise(function(resolve, reject) {
        var route,
          endTime = new Date(),
          startTime = new Date(endTime.getTime() - TIME.daysToMilliseconds(
            that.UPDATE_RANGE_WEEKLY));
        route = API.createSiteEnergyRoute({
          id: site.id,
          key: site.key,
          timeUnit: API.AVAILABLE_TIME_UNITS.HOURLY,
          startTime: API.getFormattedDateForApiCall(startTime),
          endTime: API.getFormattedDateForApiCall(endTime),
        });
        request(route, function(error, response, body) {
          var result;
          if (error) {
            reject();
          }
          result = JSON.parse(body).energyDetails;
          resolve({
            type: API.AVAILABLE_ENDPOINTS.ENERGY.key,
            data: {
              energyDetails: result,
              lastUpdateOfEnergyInformation: Date.now(),
            },
          });
        });
      });
    return updatePromise;
  }

  updatePowerFlow(site) {
    var updatePromise = new Promise(function(resolve, reject) {
      var route = API.createPowerFlowRoute({
        id: site.id,
        key: site.key,
      });
      request(route, function(error, response, body) {
        var result;
        if (error) {
          reject();
        }
        result = JSON.parse(body).siteCurrentPowerFlow;
        resolve({
          type: API.AVAILABLE_ENDPOINTS.FLOW.key,
          data: {
            siteCurrentPowerFlow: result,
            lastUpdateOfPowerFlowInformation: Date.now(),
          },
        });
      });
    });
    return updatePromise;
  }

  updateStorageInformation(site) {
    var that = this,
      updatePromise = new Promise(function(resolve, reject) {
        var route,
          endTime = new Date(),
          startTime = new Date(endTime.getTime() - TIME.hoursToMilliseconds(
            that.UPDATE_RANGE_HOURLY));
        route = API.createStorageInformationRoute({
          id: site.id,
          key: site.key,
          startTime: API.getFormattedDateForApiCall(startTime),
          endTime: API.getFormattedDateForApiCall(endTime),
        });
        request(route, function(error, response, body) {
          var result;
          if (error) {
            reject();
          }
          result = JSON.parse(body).storageData;
          resolve({
            type: API.AVAILABLE_ENDPOINTS.STORAGE.key,
            data: {
              storageDetails: result,
              lastUpdateOfStorageInformation: Date.now(),
            },
          });
        });
      });
    return updatePromise;
  }

  updateWeatherInformation(site) {
    var updatePromise = new Promise(function(resolve, reject) {
      var route = API.createWeatherInformationRoute({
        city: site.location.city,
        key: site.weatherKey,
        lang: site.language,
      });
      request(route, function(error, response, body) {
        var result;
        if (error) {
          reject();
        }
        result = JSON.parse(body);
        resolve({
          type: API.AVAILABLE_ENDPOINTS.WEATHER.key,
          data: {
            currentWeather: result,
            lastUpdateOfWeatherInformation: Date.now(),
          },
        });
      });
    });
    return updatePromise;
  }

  updateForecastInformation(site) {
    var updatePromise = new Promise(function(resolve, reject) {
      var route = API.createForecastInformationRoute({
        city: site.location.city,
        key: site.weatherKey,
        lang: site.language,
      });
      request(route, function(error, response, body) {
        var result;
        if (error) {
          reject();
        } 
        result = JSON.parse(body);
        resolve({
          type: API.AVAILABLE_ENDPOINTS.FORECAST.key,
          data: {
            forecast: result,
            lastUpdateOfForecastInformation: Date.now(),
          },
        });
      });
    });
    return updatePromise;
  }

}

module.exports = SiteService;
