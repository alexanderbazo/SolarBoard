/* eslint-env browser */
/* global Chart */
var DataWidgets = DataWidgets || {},
  // TODO:Move colors to config or theme file
  DEFAULT_COLORS = {
    blue: "rgba(39, 85, 108, 1)",
    orange: "rgba(205, 111, 0, 1)",
    red: "rgba(205, 46, 0, 1)",
    green: "rgba(0, 145, 67, 1)",
    purple: "rgba(26, 24, 29, 1)",
    white: "rgba(255, 255, 255, 1)",
    black: "rgba(0, 0, 0, 1)",
  };
DataWidgets.Widgets = DataWidgets.Widgets || {};
DataWidgets.Widgets.count = 0;

DataWidgets.Widgets.GraphWidget = function(title, description, color, colors) {
  "use strict";
  this.id = "widget-" + DataWidgets.Widgets.count;
  this.type = "graph";
  this.title = title || "";
  this.description = description || "";
  this.color = color || "";
  this.colors = colors || DEFAULT_COLORS;
  this.el = undefined;
  this.style = DataWidgets.Styles.Default;
  this.offset = 5;
  DataWidgets.Widgets.count++;
};

DataWidgets.Widgets.GraphWidget.prototype.filterValuesForLastDays = function(
  values,
  days) {
  "use strict";
  var delta, diffDays, date, now = new Date(),
    result = values.filter(function(obj) {
      date = new Date(obj.date);
      delta = Math.abs(now.getTime() - date.getTime());
      diffDays = Math.ceil(delta / (1000 * 3600 * 24));
      if (diffDays <= days) {
        return true;
      }
      return false;
    });
  return result;
};

DataWidgets.Widgets.GraphWidget.prototype.createLabels = function(data) {
  "use strict";
  var i, date, labels = [],
    source = this.filterValuesForLastDays(data.series[0].values, 2);
  for (i = 0; i < source.length; i++) {
    date = new Date(source[i].date);
    labels.push(date.getUTCDate() + "/" + (parseInt(date.getUTCMonth()) + 1) +
      " " + date.getHours() + ":00");
  }
  return labels;
};

DataWidgets.Widgets.GraphWidget.prototype.createDatasets = function(data) {
  "use strict";
  var i, series, sets = [],
    source = data.series;
  for (i = 0; i < source.length; i++) {
    series = {
      data: this.filterValuesForLastDays(source[i].values, 2).map(function(
        obj) {
        return obj.value / 1000;
      }),
      label: source[i].label + " (kwH)",
      backgroundColor: this.colors[source[i].color].replace("1)", "0.8)"),
      borderColor: this.colors[source[i].color],
      borderWidth: 2,
      cubicInterpolationMode: "monotone",
      fill: true,
    };
    sets.push(series);
  }
  return sets;
};

DataWidgets.Widgets.GraphWidget.prototype.renderGraph = function(data) {
  "use strict";
  /* eslint-disable */
  var chart = new Chart(this.context, {
    type: "line",
    data: {
      labels: this.createLabels(data),
      datasets: this.createDatasets(data),
    },
    options: {
      title: {
        display: true,
        text: "Werte der letzen zwei Tage",
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
          },
          gridLines: {
            diplay: false,
          },
        }, ],
        xAxes: [{
          gridLines: {
            diplay: false,
          },
        }, ],
      },
    },
  });
  /* eslint-enable */
};

DataWidgets.Widgets.GraphWidget.prototype.renderData = function(data) {
  "use strict";
  this.data = data;
  this.renderGraph(data);
};

DataWidgets.Widgets.GraphWidget.prototype.getNode = function() {
  "use strict";
  this.el = this.el || (function(that) {
    var el = document.createElement("div");
    el.innerHTML =
      "<li class='data-widgets-widget data-widgets-graph-widget' data-id='" +
      that.id +
      "'data-rows='1' data-cols='2'>\
      <canvas class='data-widgets-graph-canvas' width='716' height='620'></canvas></li>";
    return el.firstChild;
  }(this));
  this.canvas = this.el.querySelector(".data-widgets-graph-canvas");
  this.context = this.canvas.getContext("2d");
  return this.el;
};
