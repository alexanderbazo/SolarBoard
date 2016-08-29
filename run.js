/* eslint-env node */

var shell = require("shelljs");
(function() {
  "use strict";
  var that = {};

  function start() {

  }

  function checkForUpdates() {
    var result = shell.exec("git remote -v  update");
    console.log(result);
  }

  function update() {

  }

  function build() {

  }

  function run() {
    console.log("Starting SolarBoard");
    checkForUpdates();
  }

  that.run = run;
  return that;
}().run());
