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
  this.style = DataWidgets.Styles.Default;
  this.offset = 5;
  // TODO: Load colors from css
  this.colors = {
    blue: "rgb(39, 85, 108)",
    green: "rgb(0, 145, 67)",
    red: "rgb(205, 46, 0)",
    orange: "rgb(205, 111, 0)",
    purple: "rgb(26, 24, 29)",
    white: "rgb(255,255,255)",
  };
  DataWidgets.Widgets.count++;
};

DataWidgets.Widgets.GraphWidget.prototype.setTitle = function(title) {
  "use strict";
  this.title = title;
};

DataWidgets.Widgets.GraphWidget.prototype.setDescription = function(description) {
  "use strict";
  this.description = description;
};

DataWidgets.Widgets.GraphWidget.prototype.clearCanvas = function() {
  "use strict";
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

DataWidgets.Widgets.GraphWidget.prototype.prepareCanvas = function() {
  "use strict";
  var canvasWidth = parseInt(this.canvas.getAttribute("width")),
    canvasHeight = parseInt(this.canvas.getAttribute("height"));
  this.box = {};
  this.box.corners = [];
  this.box.corners[0] = { x: this.offset, y: this.offset, name: "bottom-left", };
  this.box.corners[1] = {
    x: canvasWidth - 2 * this.offset,
    y: this.offset,
    name: "bottom-right",
  };
  this.box.corners[2] = {
    x: canvasWidth - 2 * this.offset,
    y: canvasHeight -
      2 * this.offset,
    name: "top-right",
  };
  this.box.corners[3] = {
    x: this.offset,
    y: canvasHeight - 2 * this.offset,
    name: "top-left",
  };
  this.box.origin = this.box.corners[0];
  this.context.translate(0, canvasHeight);
  this.context.scale(1, -1);
  this.axis = {
    x: {
      length: canvasWidth - 2 * this.offset,
    },
    y: {
      length: canvasHeight - 2 * this.offset,
    },
  };
};

DataWidgets.Widgets.GraphWidget.prototype.loadStyle = function(style) {
  "use strict";
  var loadedStyle = style || this.style;
  this.context.strokeStyle = loadedStyle.lineColor;
  this.context.lineWidth = loadedStyle.lineWidth;
  this.context.fillStyle = loadedStyle.pointColor;
};

DataWidgets.Widgets.GraphWidget.prototype.drawCircle = function(center, radius,
  style) {
  "use strict";
  this.loadStyle(style);
  this.context.beginPath();
  this.context.arc(center.x, center.y, radius, 0, 2 * Math.PI);
  this.context.fill();
  this.context.closePath();
};

DataWidgets.Widgets.GraphWidget.prototype.drawLine = function(start, end, style) {
  "use strict";
  this.loadStyle(style);
  this.context.beginPath();
  this.context.moveTo(start.x, start.y);
  this.context.lineTo(end.x, end.y);
  this.context.stroke();
  this.context.closePath();
};

DataWidgets.Widgets.GraphWidget.prototype.drawTick = function(position, height,
  orientation, style) {
  "use strict";
  var start, end,
    tickOrientation = orientation || "vertical";
  start = {
    x: position.x,
    y: position.y,
  };
  end = {
    x: position.x,
    y: position.y,
  };
  if (tickOrientation === "vertical") {
    start.y += height / 2;
    end.y -= height / 2;
  } else if (tickOrientation === "horizontal") {
    start.x -= height / 2;
    end.x += height / 2;
  }
  this.drawLine(start, end, style);
  this.loadStyle(style);
};

DataWidgets.Widgets.GraphWidget.prototype.drawPointedLineBetween = function(
  start, end, style) {
  "use strict";
  this.drawLine(start, end, style);
  this.drawCircle(start, style.pointRadius, style);
};

DataWidgets.Widgets.GraphWidget.prototype.drawAxis = function(tickSizeX,
  tickSizeY) {
  "use strict";
  var i;
  this.drawLine(this.box.corners[0], this.box.corners[1]);
  this.drawLine(this.box.corners[0], this.box.corners[3]);
  for (i = 0; i < this.series.maxValues; i++) {
    if (i % 2 !== 0) {
      continue;
    }
    this.drawTick({ x: this.offset + i * tickSizeX, y: this.offset, }, this.style
      .tickHeight, "vertical");
  }
  for (i = 0; i < this.series.maxValue; i++) {
    if (i % 50 !== 0) {
      continue;
    }
    this.drawTick({ x: this.offset, y: this.offset + +i * tickSizeY, }, this.style
      .tickHeight, "horizontal");
  }
};

DataWidgets.Widgets.GraphWidget.prototype.drawSeries = function(series,
  tickSizeY, tickSizeX, smooth) {
  "use strict";
  var i, start, end, currentValue, nextValue,
    smoothValue = smooth || 1,
    style = {
      lineColor: series.color,
      lineWidth: 2,
      pointColor: series.color,
      pointRadius: 1,
    };

  for (i = 0; i < series.values.length - smoothValue; i++) {
    if (i % smoothValue !== 0) {
      continue;
    }
    currentValue = series.values[i];
    nextValue = series.values[i + smoothValue];
    start = {
      x: this.box.corners[0].x + currentValue.position * tickSizeX,
      y: this.box.corners[0].y + currentValue.value * tickSizeY,
    };
    end = {
      x: this.box.corners[0].x + nextValue.position * tickSizeX,
      y: this.box.corners[0].y + nextValue.value * tickSizeY,
    };
    this.drawPointedLineBetween(start, end, style);
  }
};

DataWidgets.Widgets.GraphWidget.prototype.createSeriesData = function(data) {
  "use strict";
  var i, j, currentSeries, currentValue, currentDate, series = [],
    maxValues = 0,
    maxValue,
    firstDate,
    lastDate;
  for (i = 0; i < data.series.length; i++) {
    currentSeries = data.series[i];
    if (maxValues < currentSeries.values.length) {
      maxValues = currentSeries.values.length;
    }
    for (j = 0; j < currentSeries.values.length; j++) {
      currentValue = currentSeries.values[j];
      currentDate = new Date(currentValue.date);
      currentValue.position = j;
      if (maxValue === undefined || maxValue < currentValue.value) {
        maxValue = currentValue.value;
      }
      if (firstDate === undefined || firstDate > currentDate) {
        firstDate = currentDate;
      }
      if (lastDate === undefined || lastDate < currentDate) {
        lastDate = currentDate;
      }
    }
    series.push({
      type: currentSeries.type,
      label: currentSeries.label,
      unit: data.unit,
      timeUnit: data.timeUnit,
      values: currentSeries.values,
      originalColor: currentSeries.color,
      color: this.colors[currentSeries.color],
    });
  }
  series.maxValues = maxValues;
  series.firstDate = firstDate;
  series.lastDate = lastDate;
  series.maxValue = maxValue;
  series.title = data.title;
  return series;
};

DataWidgets.Widgets.GraphWidget.prototype.addDescription = function(series) {
  "use strict";
  var i,
    el = document.createElement("div"),
    seriesLabelString = "";
  for (i = 0; i < series.length; i++) {
    seriesLabelString +=
      "<li class='data-widgets-graph-legend-entry'><span class='data-widgets-graph-legend-series-value data-widgets-colors-"+series[i].originalColor+"'></span><span class='data-widgets-graph-legend-series-name'>"+series[i].label+"</span></li>";
  }
  el.innerHTML =
    "<ul class='data-widgets-graph-legend'><span class='data-widgets-graph-legend-title'>" +
    series.title + "</span>" + seriesLabelString + "</ul>";
  el = el.firstChild;
  this.el.appendChild(el);
};

DataWidgets.Widgets.GraphWidget.prototype.renderData = function(data) {
  "use strict";
  var i, tickSizeX, tickSizeY;
  this.series = this.createSeriesData(data);
  tickSizeX = this.axis.x.length / this.series.maxValues;
  tickSizeY = this.axis.y.length / this.series.maxValue;
  this.clearCanvas();
  this.drawAxis(tickSizeX, tickSizeY);
  for (i = 0; i < this.series.length; i++) {
    this.drawSeries(this.series[i], tickSizeY, tickSizeX, 2);
  }
  this.addDescription(this.series);
};

DataWidgets.Widgets.GraphWidget.prototype.getNode = function() {
  "use strict";
  this.el = this.el || (function(that) {
    var el = document.createElement("div");
    el.innerHTML =
      "<li class='data-widgets-widget data-widgets-graph-widget' data-id='" +
      that.id +
      "' data-rows='1' data-cols='2'>\
      <canvas class='data-widgets-graph-canvas' width='716' height='620'></canvas>\
    </li>";
    return el.firstChild;
  }(this));
  this.canvas = this.el.querySelector(".data-widgets-graph-canvas");
  this.context = this.canvas.getContext("2d");
  this.prepareCanvas();
  return this.el;
};
