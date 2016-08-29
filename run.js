/* eslint-env node */

var shell = require("shelljs"),
  os = require("os");
(function() {
  "use strict";
  var that = {};

  function getOperatingSystemType() {
    return os.type();
  }

  function update() {
    var result = shell.exec("git remote -v  update");
    if (result.stderr.indexOf("[up to date]") === -1) {
      return true;
    }
    return false;
  }

  function build() {
    shell.exec("grunt srv && grunt www");
  }

  function startServer(callback) {
    shell.exec("cd build && npm start &", function(code, stdoutm, stderr) {
      if (callback) {
        callback();
      }
    });
  }

  function startClient() {
    var os = getOperatingSystemType();
    switch (os) {
      case "Darwin":
        shell.exec("open -a 'Google Chrome' http://localhost:8888");
        break;
      case "Widows_NT":
        shell.exec("start chrome --kiosk http://localhost:8888");
        break;
      default:
        console.log("Could not start client automattically. Open http://localhost:8888 in your browser.");
        break;
    }
  }

  function onServerClosed() {

  }

  function run() {
    let wasUpdated = update();
    if (wasUpdated) {
      build();
    }
    startServer(onServerClosed);
    setTimeout(startClient, 5000);
  }

  that.run = run;
  return that;
}().run());
