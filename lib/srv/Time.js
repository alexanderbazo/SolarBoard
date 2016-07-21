/* eslint-env node */
"use strict";

var Time = (function() {
  var that = {},
    DAY_IN_MILLISECONDS = 86400000,
    HOUR_IN_MILLISECONDS = 3600000,
    MINUTE_IN_MILLISECONDS = 60000;

  function daysToMilliseconds(days) {
    return days * DAY_IN_MILLISECONDS;
  }

  function hoursToMilliseconds(hours) {
    return hours * HOUR_IN_MILLISECONDS;
  }

  function minutesToMilliseconds(minutes) {
    return minutes * MINUTE_IN_MILLISECONDS;
  }

  that.daysToMilliseconds = daysToMilliseconds;
  that.hoursToMilliseconds = hoursToMilliseconds;
  that.minutesToMilliseconds = minutesToMilliseconds;
  return that;
}());

module.exports = Time;
