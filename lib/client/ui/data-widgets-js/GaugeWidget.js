/* eslint-env browser */
var DataWidgets = DataWidgets || {};
DataWidgets.Widgets = DataWidgets.Widgets || {};
DataWidgets.Widgets.count = 0;

DataWidgets.Widgets.GaugeWidget = function(title, description, unit, value,
  color) {
  "use strict";
  this.id = "widget-" + DataWidgets.Widgets.count;
  this.type = "gauge";
  this.title = title || "";
  this.description = description || "";
  this.unit = unit || "percentage";
  this.value = value || 0;
  this.color = color || "blue";
  this.el = undefined;
  DataWidgets.Widgets.count++;
};

DataWidgets.Widgets.GaugeWidget.prototype.setValue = function(currentValue,
  maxValue) {
  "use strict";
  var deg = (180 / 100) * ((currentValue / (maxValue || 100)) * 100);
  this.value = currentValue;
  this.el.querySelector(".data-widgets-gauge-graph-value").innerHTML =
    currentValue;
  this.el.querySelector(".data-widgets-gauge-graph-indicator").style[
    "transform"] = "rotate(" + deg + "deg)";
};

DataWidgets.Widgets.GaugeWidget.prototype.setTitle = function(title) {
  "use strict";
  this.title = title;
  this.el.querySelector(".data-widgets-gauge-widget-title").innerHTML = title;
};

DataWidgets.Widgets.GaugeWidget.prototype.setDescription = function(description) {
  "use strict";
  this.description = description;
  this.el.querySelector(".data-widgets-gauge-widget-description").innerHTML =
    description;
};

DataWidgets.Widgets.GaugeWidget.prototype.setStatusIcon = function(icon) {
  "use strict";
  var el = this.el.querySelector(".data-widgets-status-icon"),
    classes = el.className.split(" ").filter(function(c) {
      return c.lastIndexOf("data-widgets-status-type-", 0) !== 0;
    });
  el.className = classes.join(" ").trim() + " data-widgets-status-type-" +
    icon;
};

DataWidgets.Widgets.GaugeWidget.prototype.setStatusText = function(text) {
  "use strict";
  var el = this.el.querySelector(".data-widgets-status-text");
  el.innerHTML = text;
};

DataWidgets.Widgets.GaugeWidget.prototype.getNode = function() {
  "use strict";
  this.el = this.el || (function(that) {
    var el = document.createElement("div");
    el.innerHTML = "<li class='data-widgets-widget data-widgets-gauge-widget' data-id='" + that.id +
      "' data-rows='1' data-cols='1'>\
  <span class='gauge-widget data-widgets-gauge-graph'>\
    <span class='gauge-widget data-widgets-gauge-graph-background'></span>\
    <span class='gauge-widget data-widgets-gauge-graph-indicator data-widgets-colors-" +
      that.color +
      "'></span>\
    <span class='gauge-widget data-widgets-gauge-graph-value " +
      that.unit + " data-widgets-colors-" + that.color + "'>" + that.value +
      "</span>\
  </span>\
  <span class='data-widgets-gauge-widget-title data-widgets-colors-" +
      that.color + "'>" + that.title +
      "</span>\
  <span class='data-widgets-gauge-widget-description'>" +
      that.description +
      "</span>\
  <span class='data-widgets-status-text'></span>\
  <span class='data-widgets-status-icon'></span></li>";
    return el.firstChild;
  }(this));
  this.setValue(this.value);
  return this.el;
};
