/* eslint-env node */

var shell = require("shelljs"),
  APP_DIR = "";

try {
  process.chdir(APP_DIR);
  console.log("New directory: " + process.cwd());
} catch (err) {
  console.log("chdir: " + err);
  process.exit();
}

(function() {
  "use strict";
  var that = {};

  function update() {
    console.log("Checking for updates");
    var result = shell.exec("git remote -v  update");
    if (result.stderr.indexOf("[up to date]") === -1) {
      return true;
    }
    return false;
  }

  function build() {
    console.log("Building server and client");
    shell.exec("grunt srv && grunt www");
  }

  function startServer(callback) {
    console.log("Starting server");
    shell.exec("cd build && npm start &", function(code, stdoutm, stderr) {
      if (callback) {
        callback();
      }
    });
  }

  function onServerClosed() {

  }

  function run() {
    let wasUpdated = update();
    if (wasUpdated) {
      build();
    }
    startServer(onServerClosed);
  }

  that.run = run;
  return that;
}().run());
