/* eslint-env node */
"use strict";

var API_BASE_ROUTE = "https://monitoringapi.solaredge.com",
  TIME = require("./Time.js"),
  SolarEdgeApiHelper = (function() {
    var that = {},
      AVAILABLE_TIME_UNITS = {
        HOURLY: "HOUR",
      },
      AVAILABLE_ENDPOINTS = {
        GENERAL: {
          key: "GENERAL",
          endpoint: "/site/{id}/details?api_key={key}",
          defaultUpdateInterval: TIME.daysToMilliseconds(1),
        },
        ENERGY: {
          key: "ENERGY",
          endpoint: "/site/{id}/energyDetails?timeUnit={timeUnit}&startTime={startTime}&endTime={endTime}&api_key={key}",
          defaultUpdateInterval: TIME.hoursToMilliseconds(1),
        },
        FLOW: {
          key: "FLOW",
          endpoint: "/site/{id}/currentPowerFlow?api_key={key}",
          defaultUpdateInterval: TIME.minutesToMilliseconds(15),
        },
        STORAGE: {
          key: "STORAGE",
          endpoint: "/site/{id}/storageData?startTime={startTime}&endTime={endTime}&api_key={key}",
          defaultUpdateInterval: TIME.hoursToMilliseconds(1),
        },
      };

    function getAvailableEndpointKeys() {
      return [AVAILABLE_ENDPOINTS.GENERAL.key, AVAILABLE_ENDPOINTS.ENERGY.key,
        AVAILABLE_ENDPOINTS.FLOW.key, AVAILABLE_ENDPOINTS.STORAGE.key,
      ];
    }

    function getDefaultUpdateIntervalForEndpoint(key) {
      return AVAILABLE_ENDPOINTS[key].defaultUpdateInterval;
    }

    function getRoute(endpoint) {
      if (!AVAILABLE_ENDPOINTS[endpoint]) {
        return undefined;
      }
      return API_BASE_ROUTE + AVAILABLE_ENDPOINTS[endpoint].endpoint;
    }

    function createRoute(endpointKey, params) {
      var routeParam,
        route = getRoute(endpointKey);
      if (!route) {
        return undefined;
      }
      for (routeParam in params) {
        if (params.hasOwnProperty(routeParam)) {
          route = route.replace("{" + routeParam + "}", params[routeParam]);
        }
      }
      return route;
    }

    function createStorageInformationRoute(params) {
      return createRoute(AVAILABLE_ENDPOINTS.STORAGE.key, params);
    }

    function createPowerFlowRoute(params) {
      return createRoute(AVAILABLE_ENDPOINTS.FLOW.key, params);
    }

    function createSiteEnergyRoute(params) {
      return createRoute(AVAILABLE_ENDPOINTS.ENERGY.key, params);
    }

    function createSiteInformationRoute(params) {
      return createRoute(AVAILABLE_ENDPOINTS.GENERAL.key, params);
    }

    function getFormattedDateForApiCall(date) {
      return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() +
        "%20" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }

    that.AVAILABLE_TIME_UNITS = AVAILABLE_TIME_UNITS;
    that.AVAILABLE_ENDPOINTS = AVAILABLE_ENDPOINTS;
    that.createStorageInformationRoute = createStorageInformationRoute;
    that.createPowerFlowRoute = createPowerFlowRoute;
    that.createSiteEnergyRoute = createSiteEnergyRoute;
    that.createSiteInformationRoute = createSiteInformationRoute;
    that.getAvailableEndpointKeys = getAvailableEndpointKeys;
    that.getDefaultUpdateIntervalForEndpoint = getDefaultUpdateIntervalForEndpoint;
    that.getFormattedDateForApiCall = getFormattedDateForApiCall;
    return that;
  }());

module.exports = SolarEdgeApiHelper;
