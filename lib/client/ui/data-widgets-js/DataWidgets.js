/* eslint-env browser */

var DataWidgets = DataWidgets || (function() {
  "use strict";
  var D = {},
    containers = [];

  function createContainer(el) {
    var container = new DataWidgets.Widgets.WidgetContainer(el);
    container.init();
    containers.push(container);
    return container;
  }

  D.createContainer = createContainer;
  return D;
}());

DataWidgets.Widgets = {};
