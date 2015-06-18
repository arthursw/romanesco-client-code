// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['utils', 'SpeedPath'], function(utils, SpeedPath) {
    var PaintGun;
    PaintGun = (function(_super) {
      __extends(PaintGun, _super);

      function PaintGun() {
        return PaintGun.__super__.constructor.apply(this, arguments);
      }

      PaintGun.label = 'Paint gun';

      PaintGun.rdescription = "The stroke width is function of the drawing speed: the faster the wider.";

      PaintGun.initializeParameters = function() {
        var parameters;
        parameters = PaintGun.__super__.constructor.initializeParameters.call(this);
        delete parameters['Style'].fillColor;
        parameters['Edit curve'].showSpeed["default"] = false;
        if (parameters['Parameters'] == null) {
          parameters['Parameters'] = {};
        }
        parameters['Parameters'].step = {
          type: 'slider',
          label: 'Step',
          min: 1,
          max: 100,
          "default": 11,
          simplified: 20,
          step: 1
        };
        parameters['Parameters'].trackWidth = {
          type: 'slider',
          label: 'Track width',
          min: 0.1,
          max: 3,
          "default": 0.25
        };
        parameters['Parameters'].roundEnd = {
          type: 'checkbox',
          label: 'Round end',
          "default": false
        };
        parameters['Parameters'].inverseThickness = {
          type: 'checkbox',
          label: 'Inverse thickness',
          "default": false
        };
        return parameters;
      };

      PaintGun.parameters = PaintGun.initializeParameters();

      PaintGun.createTool(PaintGun);

      PaintGun.prototype.getDrawingBounds = function() {
        var width;
        width = 0;
        if (!this.data.inverseThickness) {
          width = this.speeds.max() * this.data.trackWidth / 2;
        } else {
          width = Math.max(this.maxSpeed - this.speeds.min(), 0) * this.data.trackWidth / 2;
        }
        return this.getBounds().expand(width);
      };

      PaintGun.prototype.beginDraw = function() {
        var point;
        this.initializeDrawing(true);
        point = this.controlPath.firstSegment.point;
        point = this.projectToRaster(point);
        this.context.moveTo(point.x, point.y);
        this.previousTop = point;
        this.previousBottom = point;
        this.previousMidTop = point;
        this.previousMidBottom = point;
        this.maxSpeed = this.speeds.length > 0 ? this.speeds.max() / 1.5 : this.constructor.maxSpeed / 6;
      };

      PaintGun.prototype.drawStep = function(offset, step, end) {
        var bottom, delta, midBottom, midTop, normal, point, speed, top;
        if (end == null) {
          end = false;
        }
        point = this.controlPath.getPointAt(offset);
        normal = this.controlPath.getNormalAt(offset).normalize();
        speed = this.speedAt(offset);
        point = this.projectToRaster(point);
        if (!this.data.inverseThickness) {
          delta = normal.multiply(speed * this.data.trackWidth / 2);
        } else {
          delta = normal.multiply(Math.max(this.maxSpeed - speed, 0) * this.data.trackWidth / 2);
        }
        top = point.add(delta);
        bottom = point.subtract(delta);
        if (!end) {
          midTop = this.previousTop.add(top).multiply(0.5);
          midBottom = this.previousBottom.add(bottom).multiply(0.5);
        } else {
          midTop = top;
          midBottom = bottom;
        }
        this.context.fillStyle = this.data.strokeColor;
        this.context.beginPath();
        this.context.moveTo(this.previousMidTop.x, this.previousMidTop.y);
        this.context.lineTo(this.previousMidBottom.x, this.previousMidBottom.y);
        this.context.quadraticCurveTo(this.previousBottom.x, this.previousBottom.y, midBottom.x, midBottom.y);
        this.context.lineTo(midTop.x, midTop.y);
        this.context.quadraticCurveTo(this.previousTop.x, this.previousTop.y, this.previousMidTop.x, this.previousMidTop.y);
        this.context.fill();
        this.context.stroke();
        if (step) {
          this.previousTop = top;
          this.previousBottom = bottom;
          this.previousMidTop = midTop;
          this.previousMidBottom = midBottom;
        }
      };

      PaintGun.prototype.updateDraw = function(offset, step) {
        this.drawStep(offset, step);
      };

      PaintGun.prototype.endDraw = function() {
        var point;
        this.drawStep(this.controlPath.length, false, true);
        if (this.data.roundEnd) {
          point = this.controlPath.lastSegment.point;
          point = this.projectToRaster(point);
          this.context.beginPath();
          this.context.fillStyle = this.data.strokeColor;
          this.context.arc(point.x, point.y, this.speeds.last() * this.data.trackWidth / 2, 0, 2 * Math.PI);
          this.context.fill();
        }
      };

      return PaintGun;

    })(SpeedPath);
    return PaintGun;
  });

}).call(this);

//# sourceMappingURL=PaintGun.map