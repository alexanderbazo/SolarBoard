/* eslint-env browser */

var InfoWidgets = InfoWidgets || (function() {
  "use strict";
  var I = {};
  
  function renderWidgetIn(widget, el) {
    el.appendChild(widget.getNode());
    widget.updateTime();
  }

  I.renderWidgetIn = renderWidgetIn;
  return I;
}());

InfoWidgets.Widgets = {};
