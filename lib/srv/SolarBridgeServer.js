/* eslint-env node */
"use strict";
var express = require("express"),

  xmlbuilder = require("xmlbuilder"),
  basicAuth = require("basic-auth"),
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
        responseObject = getFormatedResponse(securedObject, req.query.format ||
          "json");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.set("Content-Type", responseType);
        res.send(responseObject);
      }).catch(function(reason) {
        res.send({
          error: "Site not found",
        });
      });
    }

    function getHttpAuth(auth) {
      var httpAuth;
      if (!auth.enabled) {
        return undefined;
      }
      httpAuth = function(req, res, next) {
        var user;

        function unauthorized(res) {
          res.set("WWW-Authenticate", "Basic realm=Authorization Required");
          return res.send(401);
        }

        user = basicAuth(req);

        if (!user || !user.name || !user.pass) {
          return unauthorized(res);
        }

        if (user.name === auth.user && user.pass === auth.password) {
          return next();
        }
        return unauthorized(res);
      };
      return httpAuth;
    }

    function start() {
      var auth;
      app = express();
      if (config.http_auth) {
        auth = getHttpAuth(config.http_auth);
      }
      if (auth) {
        app.use("/", auth, express.static(config.www));
      } else {

        app.use("/", express.static(config.www));
      }
      app.get("/api/site/:id", onSiteRequest);
      app.listen(config.port);
    }

    that.init = init;
    that.start = start;
    return that;
  };

module.exports = SolarBridgeServer;
