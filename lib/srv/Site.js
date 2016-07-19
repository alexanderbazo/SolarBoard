/* eslint-env node */
"use strict";

var Promise = require("promise");

class Site {

  constructor(initialParams) {
    var params = initialParams || {};
    this.id = params.id || undefined;
    this.key = params.key || undefined;
    this.name = params.name || undefined;
    this.lastUpdate = params.lastUpdate || undefined;
    this.accountId = params.accountId || undefined;
    this.status = params.status || undefined;
    this.peakPower = params.peakPower || undefined;
    this.currency = params.currency || undefined;
    this.installationDate = params.installationDate || undefined;
    this.notes = params.notes || undefined;
    this.type = params.type || undefined;
    this.location = params.location || undefined;
    this.alertQuantity = params.alertQuantity || undefined;
    this.alertSeverity = params.alertSeverity || undefined;
  }

}

module.exports = Site;