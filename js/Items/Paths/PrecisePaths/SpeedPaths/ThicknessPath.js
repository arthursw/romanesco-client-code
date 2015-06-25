// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['Items/Paths/PrecisePaths/SpeedPaths/SpeedPath'], function(SpeedPath) {
    var ThicknessPath;
    ThicknessPath = (function(_super) {
      __extends(ThicknessPath, _super);

      function ThicknessPath() {
        return ThicknessPath.__super__.constructor.apply(this, arguments);
      }

      ThicknessPath.label = 'Thickness path';

      ThicknessPath.description = "The stroke width is function of the drawing speed: the faster the wider.";

      ThicknessPath.iconURL = 'static/images/icons/inverted/rollerBrush.png';

      ThicknessPath.iconAlt = 'roller brush';

      ThicknessPath.initializeParameters = function() {
        var parameters;
        parameters = ThicknessPath.__super__.constructor.initializeParameters.call(this);
        parameters['Style'].strokeWidth["default"] = 0;
        parameters['Style'].strokeColor.defaultCheck = false;
        parameters['Style'].fillColor.defaultCheck = true;
        if (parameters['Parameters'] == null) {
          parameters['Parameters'] = {};
        }
        parameters['Parameters'].step = {
          type: 'slider',
          label: 'Step',
          min: 30,
          max: 300,
          "default": 30,
          simplified: 30,
          step: 1
        };
        parameters['Parameters'].trackWidth = {
          type: 'slider',
          label: 'Track width',
          min: 0.1,
          max: 3,
          "default": 0.5
        };
        parameters['Parameters'].useCanvas = {
          type: 'checkbox',
          label: 'Use canvas',
          "default": false
        };
        return parameters;
      };

      ThicknessPath.parameters = ThicknessPath.initializeParameters();

      ThicknessPath.createTool(ThicknessPath);

      ThicknessPath.prototype.beginDraw = function() {
        this.initializeDrawing(false);
        this.path = this.addPath();
        this.path.add(this.controlPath.firstSegment.point);
        this.path.add(this.controlPath.firstSegment.point);
      };

      ThicknessPath.prototype.updateDraw = function(offset, step) {
        var bottom, delta, normal, point, speed, top;
        point = this.controlPath.getPointAt(offset);
        normal = this.controlPath.getNormalAt(offset).normalize();
        if (!step) {
          if (this.path.segments.length <= 1) {
            return;
          }
          this.path.firstSegment.point = point;
          return;
        }
        speed = this.speedAt(offset);
        delta = normal.multiply(speed * this.data.trackWidth / 2);
        top = point.add(delta);
        bottom = point.subtract(delta);
        this.path.firstSegment.remove();
        this.path.add(top);
        this.path.insert(0, bottom);
        this.path.insert(0, point);
        this.path.smooth();
      };

      ThicknessPath.prototype.endDraw = function() {
        this.path.add(this.controlPath.lastSegment.point);
        this.path.closed = true;
        this.path.smooth();
        this.path.selected = false;
      };

      return ThicknessPath;

    })(SpeedPath);
    return ThicknessPath;
  });

}).call(this);

//# sourceMappingURL=ThicknessPath.map
