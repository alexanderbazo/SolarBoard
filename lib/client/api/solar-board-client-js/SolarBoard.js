/* eslint-env browser */

var SolarBoard = SolarBoard || (function() {
  "use strict";
  var S = {};

  function connect(url, id) {
    return new SolarBoard.Client.SolarBoardClient(url, id);
  }

  S.connect = connect;
  return S;
}());

SolarBoard.Client = {};
