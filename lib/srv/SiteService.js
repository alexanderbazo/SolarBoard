/* eslint-env node */
"use strict";

var Promise = require("promise"),
  request = require("request"),
  apiRoutes = {
    details: "https://monitoringapi.solaredge.com/site/{id}/details?api_key={key}",
    power: "https://monitoringapi.solaredge.com/site/{id}/powerDetails?startTime={startTime}&endTime={endTime}&timeUnit{timeUnit}&api_key={key}",
  };

function createRoute(route, params) {
  var routeParam, result = apiRoutes[route];
  if (!result) {
    return undefined;
  }
  for (routeParam in params) {
    if (params.hasOwnProperty(routeParam)) {
      result = result.replace("{" + routeParam + "}", params[routeParam]);
    }
  }
  return result;
}

class SiteService {

  constructor() {
    this.sites = {};
  }

  registerSite(site) {
    if (this.sites.hasOwnProperty(site.id)) {
      return undefined;
    }
    this.sites[site.id] = {
      id: site.id,
      site: site,
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

  updateSiteState(site, state) {
    var property;
    for (property in state) {
      if (state.hasOwnProperty(property)) {
        site[property] = state[property];
      }
    }
  }

  updateSite(id) {
    var that = this,
      promises = [];
    if (!this.sites[id]) {
      return undefined;
    }
    promises.push(this.updateSiteInformation(this.sites[id].site));
    promises.push(this.updatePowerInformation(this.sites[id].site));
    promises.push(this.updateEnergyInformation(this.sites[id].site));
    return new Promise(function(resolve, reject) {
      Promise.all(promises).then(function(result) {
        that.updateSiteState(that.sites[id].site, result[0].data);
        that.updateSiteState(that.sites[id].site, result[1].data);
        resolve(that.sites[id].site);
      });
    });
  }

  updateSiteInformation(site) {
    var updatePromise = new Promise(function(resolve, reject) {
      var route = createRoute("details", { id: site.id, key: site.key, });
      request(route, function(error, response, body) {
        var result = JSON.parse(body).details;
        result.location = result.location || {};
        resolve({
          type: "site",
          data: {
            name: result.name,
            accountId: result.accountId,
            status: result.status,
            peakPower: result.peakPower,
            lastUpdateTime: result.lastUpdateTime,
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

  updatePowerInformation(site) {
    var updatePromise = new Promise(function(resolve, reject) {
      var route, now = new Date(),
        startTime, endTime, startMonth = now.getMonth();
      if (startMonth === 0) {
        startMonth = 12;
      }
      startTime = now.getFullYear() + "-" + startMonth + "-" + now.getDate() +
        "%20" + now.getHours() + ":00:00";
      endTime = now.getFullYear() + "-" + (startMonth + 1) + "-" + now.getDate() +
        "%20" + now.getHours() + ":00:00";

      route = createRoute("power", {
        id: site.id,
        key: site.key,
        startTime: startTime,
        endTime: endTime,
      });
      request(route, function(error, response, body) {
        var result = JSON.parse(body).powerDetails;
        resolve({
          type: "power",
          data: {
            powerDetails: result,
          },
        });
      });
    });
    return updatePromise;
  }

  updateEnergyInformation(site) {
    var updatePromise = new Promise(function(resolve, reject) {
      resolve({ type: "energy", data: {}, });
    });
    return updatePromise;
  }

}

module.exports = SiteService;
