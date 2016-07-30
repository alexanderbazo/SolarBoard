/* eslint-env browser */
var DataWidgets = DataWidgets || {};
DataWidgets.Widgets = DataWidgets.Widgets || {};
DataWidgets.Widgets.count = 0;

DataWidgets.Widgets.BarWidget = function(title, description, color) {
  "use strict";
  this.id = "widget-" + DataWidgets.Widgets.count;
  this.type = "bar";
  this.title = title || "";
  this.color = color || "green";
  this.description = description || "";
  this.el = undefined;
  DataWidgets.Widgets.count++;
};

DataWidgets.Widgets.BarWidget.prototype.setTitle = function(title) {
  "use strict";
};

DataWidgets.Widgets.BarWidget.prototype.setDescription = function(description) {
  "use strict";
};

DataWidgets.Widgets.BarWidget.prototype.setStatusText = function(text) {
  "use strict";
  var el = this.el.querySelector(".data-widgets-status-text");
  el.innerHTML = text;
};

DataWidgets.Widgets.BarWidget.prototype.renderData = function(data) {
  "use strict";
  var BAR_LENGTH_MAX = 225,
    barLengthRatio, index, barEl, maxValue = 0;
  if (!data || data.length === 0) {
    return;
  }
  this.bars = this.bars || this.el.querySelector(
    ".data-widgets-bar-widget-bars");
  this.bars.innerHTML = "";
  for (index = 0; index < data.length; index++) {
    console.log(data[index].value, maxValue);
    if (data[index].value > maxValue) {
      maxValue = data[index].value;
    }

    console.log(maxValue);
  }
  barLengthRatio = BAR_LENGTH_MAX / maxValue;
  console.log(maxValue);
  console.log(barLengthRatio);
 
  for (index = 0; index < data.length; index++) {
    barEl = document.createElement("div");
    barEl.innerHTML =
      "<li class='data-widgets-bar-widget-container' data-label='" + data[
        index].label +
      "'>\
      <span class='data-widgets-bar-widget-label'>" + data[index].label +
      "</span>\
      <span class='data-widgets-bar-widget-bar data-widgets-colors-" +
      data[index].color +
      "'></span>\
      <span class='data-widgets-bar-widget-value'>" + data[
        index].value + " " + data[index].unit + "</span>\
      </li>";
    this.bars.appendChild(barEl.firstChild);
    this.bars.lastChild.querySelector(".data-widgets-bar-widget-bar").style.width =
      (data[index].value * barLengthRatio) + "px";
  }

};

DataWidgets.Widgets.BarWidget.prototype.getNode = function() {
  "use strict";
  this.el = this.el || (function(that) {
    var el = document.createElement("div");
    el.innerHTML =
      "<li class='data-widgets-widget data-widgets-bar-widget' data-id='" +
      that.id +
      "' data-rows='1' data-cols='2'>\
     <span class='data-widgets-bar-widget-title data-widgets-colors-" +
      that.color + "'>" + that.title +
      "</span>\
      <span class='data-widgets-bar-widget-description'>" +
      that.description +
      "</span>\
      <ul class='data-widgets-bar-widget-bars'>\
      </ul>\
       <span class='data-widgets-status-text'></span>\
   <span class='data-widgets-status-icon'></span>\
    </li>";
    return el.firstChild;
  }(this));
  return this.el;
};
