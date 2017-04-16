/* eslint-env browser */
var SolarBoard = SolarBoard || {};
SolarBoard.Client = SolarBoard.Client || {};

SolarBoard.Client.SolarBoardClient = function(url, id) {
  "use strict";
  this.url = url;
  this.id = id;
};

SolarBoard.Client.SolarBoardClient.get = function(url, callback) {
  "use strict";
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
      callback(xmlHttp.responseText);
    }
  };
  xmlHttp.open("GET", url, true);
  xmlHttp.send(null);
};

SolarBoard.Client.SolarBoardClient.prototype.update = function() {
  "use strict";
  var promise = function() {
    var that = this;
    this.result = undefined;
    this.listener = undefined;
    this.resolved = false;
    this.then = function(callback) {
      if (that.result && that.resolved === false) {
        callback(that.result);
        that.resolved = true;
      } else {
        that.listener = callback;
      }
    };
  };
  promise = new promise();
  SolarBoard.Client.SolarBoardClient.get(this.url + "/api/site/" + this.id, function(
    result) {
    var resultObject = JSON.parse(result);
    if (promise.listener) {
      promise.listener(resultObject);
      promise.resolved = true;
    } else {
      promise.result = resultObject;
    }
  });
  return promise;
};
