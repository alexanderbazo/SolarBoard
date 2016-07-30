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
       <span class='data-widgets-status-text'></span>\
   <span class='data-widgets-status-icon'></span>\
    </li>";
    return el.firstChild;
  }(this));
  return this.el;
};
