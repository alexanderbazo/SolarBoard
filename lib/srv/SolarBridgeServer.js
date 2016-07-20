/* eslint-env node */
"use strict";
var express = require("express"),
  xmlbuilder = require("xmlbuilder"),
  Site = require("./Site.js"),
  SiteService = require("./SiteService.js"),
  SolarBridgeServer = function(config) {
    var that = {},
      sites,
      app;

    function init() {
      var index;
      sites = new SiteService();
      for (index = 0; index < config.sites.length; index++) {
        sites.registerSite(new Site(config.sites[index]));
      }
    }

    function getContentType(format) {
      switch (format) {
        case "json":
          return "application/json";
        case "xml":
          return "application/xml";
        default:
          return "application/json";
      }
    }

    function getFormatedResponse(obj, format) {
      var result;
      switch (format) {
        case "xml":
          result = xmlbuilder.create({ site: obj, });
          result = result.end({ pretty: true, });
          break;
        case "json":
        default:
          result = JSON.stringify(obj);
          break;
      }
      return result;
    }

    function onSiteRequest(req, res) {
      sites.getSite(req.params.id).then(function(result) {
        var responseObject, securedObject = JSON.parse(JSON.stringify(
            result)),
          responseType = getContentType(req.query.format || "json");
        delete securedObject.key;
        responseObject = getFormatedResponse(securedObject, req.query.format || "json");
        res.set("Content-Type", responseType);
        res.send(responseObject);
      }).catch(function(reason) {
        res.send({
          error: "Site not found",
        });
      });
    }

    function start() {
      app = express();
      app.get("/api/site/:id", onSiteRequest);
      app.listen(config.port);
    }

    that.init = init;
    that.start = start;
    return that;
  };

module.exports = SolarBridgeServer;
