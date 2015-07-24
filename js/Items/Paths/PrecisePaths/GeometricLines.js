// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['Items/Paths/PrecisePaths/StepPath'], function(StepPath) {
    var GeometricLines;
    GeometricLines = (function(_super) {
      __extends(GeometricLines, _super);

      function GeometricLines() {
        return GeometricLines.__super__.constructor.apply(this, arguments);
      }

      GeometricLines.label = 'Geometric lines';

      GeometricLines.description = "Draws a line between pair of points which are close enough.";

      GeometricLines.iconURL = 'static/images/icons/inverted/links.png';

      GeometricLines.initializeParameters = function() {
        var parameters;
        parameters = GeometricLines.__super__.constructor.initializeParameters.call(this);
        parameters['Style'].strokeColor.defaultFunction = null;
        parameters['Style'].strokeColor["default"] = "rgba(39, 158, 224, 0.21)";
        delete parameters['Style'].fillColor;
        if (parameters['Parameters'] == null) {
          parameters['Parameters'] = {};
        }
        parameters['Parameters'].step = {
          type: 'slider',
          label: 'Step',
          min: 5,
          max: 100,
          "default": 11,
          simplified: 20,
          step: 1
        };
        parameters['Parameters'].distance = {
          type: 'slider',
          label: 'Distance',
          min: 5,
          max: 250,
          "default": 150,
          simplified: 100
        };
        return parameters;
      };

      GeometricLines.parameters = GeometricLines.initializeParameters();

      GeometricLines.createTool(GeometricLines);

      GeometricLines.prototype.beginDraw = function() {
        this.initializeDrawing(true);
        this.points = [];
      };

      GeometricLines.prototype.updateDraw = function(offset, step) {
        var distMax, normal, point, pt, _i, _len, _ref;
        if (!step) {
          return;
        }
        point = this.controlPath.getPointAt(offset);
        normal = this.controlPath.getNormalAt(offset).normalize();
        point = this.projectToRaster(point);
        this.points.push(point);
        distMax = this.data.distance * this.data.distance;
        _ref = this.points;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          pt = _ref[_i];
          if (point.getDistance(pt, true) < distMax) {
            this.context.beginPath();
            this.context.moveTo(point.x, point.y);
            this.context.lineTo(pt.x, pt.y);
            this.context.stroke();
          }
        }
      };

      GeometricLines.prototype.endDraw = function() {};

      return GeometricLines;

    })(StepPath);
    return GeometricLines;
  });

}).call(this);
