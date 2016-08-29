/* eslint-env browser */
var DataWidgets = DataWidgets || {};
DataWidgets.Widgets = DataWidgets.Widgets || {};
DataWidgets.Widgets.count = 0;

DataWidgets.Widgets.GraphWidget = function(title, description, color) {
  "use strict";
  this.id = "widget-" + DataWidgets.Widgets.count;
  this.type = "graph";
  this.title = title || "";
  this.description = description || "";
  this.color = color || "";
  this.el = undefined;
  DataWidgets.Widgets.count++;
};

DataWidgets.Widgets.GraphWidget.prototype.setTitle = function(title) {
  "use strict";
  this.title = title;
  this.el.querySelector(".data-widgets-graph-widget-title").innerHTML =
    title;
};

DataWidgets.Widgets.GraphWidget.prototype.setDescription = function(description) {
  "use strict";
  this.description = description;
  this.el.querySelector(".data-widgets-graph-widget-description").innerHTML =
    description;
};

DataWidgets.Widgets.GraphWidget.prototype.renderData = function(data) {
  "use strict";
  console.log(data);
  console.log(this.context);
};

DataWidgets.Widgets.GraphWidget.prototype.getNode = function() {
  "use strict";
  this.el = this.el || (function(that) {
    var el = document.createElement("div");
    el.innerHTML =
      "<li class='data-widgets-widget data-widgets-graph-widget' data-id='" +
      that.id +
      "' data-rows='1' data-cols='2'>\
     <span class='data-widgets-graph-widget-title data-widgets-colors-" +
      that.color + "'>" + that.title +
      "</span>\
      <span class='data-widgets-graph-widget-description'>" +
      that.description +
      "</span>\
      <canvas class='data-widgets-graph-canvas'></canvas>\
    </li>";
    return el.firstChild;
  }(this));
  this.canvas = this.el.querySelector(".data-widgets-graph-canvas");
  this.context = this.canvas.getContext("2d");
  return this.el;
};
