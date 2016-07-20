/* eslint-env node */
"use strict";

var Time = (function() {
  var that = {},
    DAY_IN_MILLISECONDS = 86400000,
    HOUR_IN_MILLISECONDS = 3600000;

  function daysToMilliseconds(days) {
    return days * DAY_IN_MILLISECONDS;
  }

  function hoursToMilliseconds(hours) {
    return hours * HOUR_IN_MILLISECONDS;
  }

  that.daysToMilliseconds = daysToMilliseconds;
  that.hoursToMilliseconds = hoursToMilliseconds;
  return that;
}());

module.exports = Time;
