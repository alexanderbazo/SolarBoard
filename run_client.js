/* eslint-env node */

var shell = require("shelljs"),
  os = require("os");
(function() {
  "use strict";
  var that = {};

  function getOperatingSystemType() {
    return os.type();
  }

  function startClient() {
    console.log("Starting client");
    var os = getOperatingSystemType();
    switch (os) {
      case "Darwin":
        shell.exec("open -a 'Google Chrome' http://localhost:8888");
        break;
      case "Windows_NT":
        shell.exec("start chrome --kiosk http://localhost:8888");
        break;
      default:
        console.log(
          "Could not start client automattically. Open http://localhost:8888 in your browser."
        );
        break;
    }
  }

  function run() {
    startClient();
  }

  that.run = run;
  return that;
}().run());
