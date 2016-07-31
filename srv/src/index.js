/* eslint-env node */
"use strict";

(function() {
  var open = require("open"),
    SolarBridgeServer = require("./lib/SolarBridgeServer.js"),
    config = require("./config.json"),
    server = new SolarBridgeServer(config);
  console.log("Starting SolarBridgeServer");
  server.init();
  server.start();
  open("http://localhost:" + config.port);
}());
