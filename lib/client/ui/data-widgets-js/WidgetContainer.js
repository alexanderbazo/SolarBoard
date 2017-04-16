/* eslint-env browser */
var DataWidgets = DataWidgets || {};
DataWidgets.Widgets = DataWidgets.Widgets || {};

DataWidgets.Widgets.WidgetContainer = function(el) {
  "use strict";
  this.el = el;
  this.widgets = [];
  this.widgetsList;
};

DataWidgets.Widgets.WidgetContainer.prototype.init = function() {
  "use strict";
  this.el.setAttribute("data-widget-type", "container");
  this.widgetsList = document.createElement("ul");
  this.widgetsList.classList.add("data-widgets-widget-list");
  this.el.appendChild(this.widgetsList);
};

DataWidgets.Widgets.WidgetContainer.prototype.render = function() {
  "use strict";
  var i, w;
  for (i = 0; i < this.widgets.length; i++) {
    w = this.widgetsList.querySelector("[data-id='" + this.widgets[i].id +
      "']");
    if (!w) {
      this.widgetsList.appendChild(this.widgets[i].getNode());
    }
  }
};

DataWidgets.Widgets.WidgetContainer.prototype.addWidget = function(widget) {
  "use strict";
  this.widgets.push(widget);
};
