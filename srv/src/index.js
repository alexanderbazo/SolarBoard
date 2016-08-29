/* eslint-env node */
"use strict";

(function() {
  var os = require("os"),
    exec = require("child_process").exec,
    SolarBridgeServer = require("./lib/SolarBridgeServer.js"),
    config = require("./config.json"),
    server = new SolarBridgeServer(config);
  console.log("Starting SolarBridgeServer");

  server.init();
  server.start();
  
}());
