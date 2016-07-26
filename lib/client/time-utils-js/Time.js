/* eslint-env browser */

var Time = Time || (function() {
  "use strict";
  var T = {},
    MONTHS = {
      de: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli",
        "August", "September", "Oktober", "November", "Dezember",
      ],
    },
    DAYS = {
      de: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag",
        "Freitag", "Samstag",
      ],
    },
    FORMAT_PLACEHOLERS = {
      YY: "Year",
      MO: "Month",
      mo: "Month-Named",
      WD: "Weekday",
      wd: "Weekday-Named",
      DD: "Day",
      HH: "Hours",
      MM: "Minutes",
      SS: "Seconds",
    },
    tickers = [];

  function checkDigits(t) {
    if (t < 10) {
      return "0" + t;
    }
    return t;
  }

  function getFormatedDate(date, format) {
    var preparedFormat = format;
    preparedFormat = preparedFormat.replace("YY", "{{Y}}");
    preparedFormat = preparedFormat.replace("MO", "{{MO}}");
    preparedFormat = preparedFormat.replace("mo", "{{mo}}");
    preparedFormat = preparedFormat.replace("WD", "{{WD}}");
    preparedFormat = preparedFormat.replace("wd", "{{wd}}");
    preparedFormat = preparedFormat.replace("DD", "{{D}}");
    preparedFormat = preparedFormat.replace("HH", "{{H}}");
    preparedFormat = preparedFormat.replace("MM", "{{M}}");
    preparedFormat = preparedFormat.replace("{{Y}}", date.getFullYear());
    preparedFormat = preparedFormat.replace("{{MO}}", date.getMonth);
    preparedFormat = preparedFormat.replace("{{mo}}", MONTHS.de[date.getMonth()]);
    preparedFormat = preparedFormat.replace("{{WD}}", date.getDay());
    preparedFormat = preparedFormat.replace("{{wd}}", DAYS.de[date.getDay()]);
    preparedFormat = preparedFormat.replace("{{D}}", checkDigits(date.getDate()));
    preparedFormat = preparedFormat.replace("{{H}}", checkDigits(date.getHours()));
    preparedFormat = preparedFormat.replace("{{M}}", checkDigits(date.getMinutes()));
    return preparedFormat;
  }

  function startTicker(delay, callback) {
    var i = setInterval(function() {
      callback(new Date());
    }, delay);
    tickers.push(i);
  }

  function stopTicker(id) {
    clearInterval(id);
  }

  function stopAllTickers() {
    var i;
    for(i = 0; i < tickers.length; i++) {
      stopTicker(tickers[i]);
    }
    tickers = [];
  }

  T.getFormatedDate = getFormatedDate;
  T.startTicker = startTicker;
  T.stopTicker = stopTicker;
  T.stopAllTickers = stopAllTickers;
  return T;
}());
