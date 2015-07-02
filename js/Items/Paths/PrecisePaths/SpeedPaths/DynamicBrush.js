// Generated by CoffeeScript 1.7.1
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['Items/Paths/PrecisePaths/SpeedPaths/SpeedPath'], function(SpeedPath) {
    var DynamicBrush;
    DynamicBrush = (function(_super) {
      __extends(DynamicBrush, _super);

      function DynamicBrush() {
        this.onFrame = __bind(this.onFrame, this);
        return DynamicBrush.__super__.constructor.apply(this, arguments);
      }

      DynamicBrush.label = 'Dynamic brush';

      DynamicBrush.description = "The stroke width is function of the drawing speed: the faster the wider.";

      DynamicBrush.polygonMode = false;

      DynamicBrush.initializeParameters = function() {
        var parameters;
        parameters = DynamicBrush.__super__.constructor.initializeParameters.call(this);
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
          "default": 5,
          simplified: 20,
          step: 1
        };
        parameters['Parameters'].trackWidth = {
          type: 'slider',
          label: 'Track width',
          min: 0.0,
          max: 10.0,
          "default": 0.5
        };
        parameters['Parameters'].mass = {
          type: 'slider',
          label: 'Mass',
          min: 1,
          max: 200,
          "default": 40
        };
        parameters['Parameters'].drag = {
          type: 'slider',
          label: 'Drag',
          min: 0,
          max: 0.4,
          "default": 0.1
        };
        parameters['Parameters'].maxSpeed = {
          type: 'slider',
          label: 'Max speed',
          min: 0,
          max: 100,
          "default": 35
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
        parameters['Parameters'].fixedAngle = {
          type: 'checkbox',
          label: 'Fixed angle',
          "default": false
        };
        parameters['Parameters'].simplify = {
          type: 'checkbox',
          label: 'Simplify',
          "default": true
        };
        parameters['Parameters'].angle = {
          type: 'slider',
          label: 'Angle',
          min: 0,
          max: 360,
          "default": 0
        };
        return parameters;
      };

      DynamicBrush.parameters = DynamicBrush.initializeParameters();

      DynamicBrush.createTool(DynamicBrush);

      DynamicBrush.prototype.getDrawingBounds = function() {
        var width;
        width = this.data.inverseThickness ? Utils.Array.max(this.speeds) : Utils.Array.min(this.speeds);
        width = this.data.inverseThickness ? width : this.data.maxSpeed - width;
        width *= this.data.trackWidth;
        return this.getBounds().expand(2 * width);
      };

      DynamicBrush.prototype.beginDraw = function(redrawing) {
        if (redrawing == null) {
          redrawing = false;
        }
        this.initializeDrawing(true);
        this.point = this.controlPath.firstSegment.point;
        this.currentPosition = this.point;
        this.previousPosition = this.currentPosition;
        this.previousMidPosition = this.currentPosition;
        this.previousMidDelta = new P.Point();
        this.previousDelta = new P.Point();
        this.context.fillStyle = 'black';
        this.context.strokeStyle = this.data.fillColor;
        if (!redrawing) {
          this.velocity = new P.Point();
          this.velocities = [];
          this.controlPathReplacement = this.controlPath.clone();
          this.setAnimated(true);
        }
      };

      DynamicBrush.prototype.drawSegment = function(currentPosition, width, delta) {
        var midBottom, midDelta, midPosition, midTop, previousBottom, previousMidBottom, previousMidTop, previousTop;
        if (delta == null) {
          delta = null;
        }
        width = this.data.inverseThickness ? width : this.data.maxSpeed - width;
        width *= this.data.trackWidth;
        if (width < 0.1) {
          width = 0.1;
        }
        if (this.data.fixedAngle) {
          delta = new P.Point(1, 0);
          delta.angle = this.data.angle;
        } else {
          delta = delta.normalize();
        }
        delta = delta.multiply(width);
        midPosition = currentPosition.add(this.previousPosition).divide(2);
        midDelta = delta.add(this.previousDelta).divide(2);
        previousMidTop = this.projectToRaster(this.previousMidPosition.add(this.previousMidDelta));
        previousMidBottom = this.projectToRaster(this.previousMidPosition.subtract(this.previousMidDelta));
        previousTop = this.projectToRaster(this.previousPosition.add(this.previousDelta));
        previousBottom = this.projectToRaster(this.previousPosition.subtract(this.previousDelta));
        midTop = this.projectToRaster(midPosition.add(midDelta));
        midBottom = this.projectToRaster(midPosition.subtract(midDelta));
        this.context.beginPath();
        this.context.moveTo(previousMidTop.x, previousMidTop.y);
        this.context.lineTo(previousMidBottom.x, previousMidBottom.y);
        this.context.quadraticCurveTo(previousBottom.x, previousBottom.y, midBottom.x, midBottom.y);
        this.context.lineTo(midTop.x, midTop.y);
        this.context.quadraticCurveTo(previousTop.x, previousTop.y, previousMidTop.x, previousMidTop.y);
        this.context.fill();
        this.context.stroke();
        this.previousDelta = delta;
        this.previousMidPosition = midPosition;
        this.previousMidDelta = midDelta;
      };

      DynamicBrush.prototype.updateForce = function() {
        var acceleration, force;
        force = this.point.subtract(this.currentPosition);
        if (force.length < 0.1) {
          return false;
        }
        acceleration = force.divide(this.data.mass);
        this.velocity = this.velocity.add(acceleration);
        if (this.velocity.length < 0.1) {
          return false;
        }
        this.velocity = this.velocity.multiply(1.0 - this.data.drag);
        this.previousPosition = this.currentPosition;
        this.currentPosition = this.currentPosition.add(this.velocity);
        return true;
      };

      DynamicBrush.prototype.drawStep = function() {
        var continueDrawing, v;
        if (this.finishedDrawing) {
          return;
        }
        continueDrawing = this.updateForce();
        if (!continueDrawing) {
          return;
        }
        v = this.velocity.length;
        this.controlPathReplacement.add(this.currentPosition);
        this.velocities.push(v);
        this.drawSegment(this.currentPosition, v, new P.Point(-this.velocity.y, this.velocity.x));

        /*
        			width = if @data.inverseThickness then v else (10-v)
        			width *= @data.trackWidth
        
        			if not @data.fixedAngle
        				delta = new P.Point(-@velocity.y, @velocity.x)
        			else
        				delta = new P.Point(1,0)
        				delta.angle = @data.angle
        			delta = delta.normalize().multiply(width)
        
        			a = @projectToRaster(@previousPosition.add(@previousDelta))
        			b = @projectToRaster(@previousPosition.subtract(@previousDelta))
        			c = @projectToRaster(@currentPosition.subtract(delta))
        			d = @projectToRaster(@currentPosition.add(delta))
        
        			 * @path.add(c)
        			 * @path.insert(0, d)
         */
      };

      DynamicBrush.prototype.onFrame = function() {
        var i, _i;
        for (i = _i = 0; _i <= 2; i = ++_i) {
          this.drawStep();
        }
      };

      DynamicBrush.prototype.updateDraw = function(offset, step, redrawing) {
        var v;
        this.point = this.controlPath.getPointAt(offset);
        if (redrawing) {
          v = this.speedAt(offset);
          this.drawSegment(this.point, v, this.controlPath.getNormalAt(offset));
          this.previousPosition = this.point;

          /*
          				width = if @data.inverseThickness then v else (10-v)
          				width *= @data.trackWidth
          
          				if not @data.fixedAngle
          					delta = @controlPath.getNormalAt(offset).normalize()
          				else
          					delta = new P.Point(1,0)
          					delta.angle = @data.angle
          
          				delta = delta.multiply(width)
          				top = @point.add(delta)
          				bottom = @point.subtract(delta)
          
          				@path.add(top)
          				@path.insert(0, bottom)
           */
        }
      };

      DynamicBrush.prototype.endDraw = function(redrawing) {
        var f, i, length, location, offset;
        if (redrawing == null) {
          redrawing = false;
        }
        if (!redrawing) {
          this.setAnimated(false);
          this.finishedDrawing = true;
          length = this.controlPathReplacement.length;
          offset = 0;
          this.speeds = [];
          while (offset < length) {
            location = this.controlPathReplacement.getLocationAt(offset);
            i = location.segment.index;
            f = location.parameter;
            if (i < this.velocities.length - 1) {
              this.speeds.push(Utils.linearInterpolation(this.velocities[i], this.velocities[i + 1], f));
            } else {
              this.speeds.push(this.velocities[i]);
            }
            offset += this.constructor.speedStep;
          }
          this.velocities = [];
          if (this.data.simplify) {
            this.controlPathReplacement.simplify();
          }
          this.controlPathReplacement.insert(0, this.controlPathReplacement.firstSegment.point);
          this.controlPathReplacement.insert(0, this.controlPathReplacement.firstSegment.point);
          this.controlPath.segments = this.controlPathReplacement.segments;
          this.controlPathReplacement.remove();
        }
      };

      DynamicBrush.prototype.remove = function() {
        clearInterval(this.timerId);
        DynamicBrush.__super__.remove.call(this);
      };

      return DynamicBrush;

    })(SpeedPath);
    return DynamicBrush;
  });

}).call(this);
