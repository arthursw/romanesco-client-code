// Generated by CoffeeScript 1.7.1
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['Items/Paths/Shapes/Shape'], function(Shape) {
    var SpiralShape;
    SpiralShape = (function(_super) {
      __extends(SpiralShape, _super);

      function SpiralShape() {
        this.onFrame = __bind(this.onFrame, this);
        return SpiralShape.__super__.constructor.apply(this, arguments);
      }

      SpiralShape.Shape = P.Path.Ellipse;

      SpiralShape.category = 'Shape/Animated/Spiral';

      SpiralShape.label = 'Spiral';

      SpiralShape.description = "The spiral shape can have an intern radius, and a custom number of sides.";

      SpiralShape.iconURL = 'static/images/icons/inverted/spiral.png';

      SpiralShape.initializeParameters = function() {
        var parameters;
        parameters = SpiralShape.__super__.constructor.initializeParameters.call(this);
        if (parameters['Parameters'] == null) {
          parameters['Parameters'] = {};
        }
        parameters['Parameters'].minRadius = {
          type: 'slider',
          label: 'Minimum radius',
          min: 0,
          max: 100,
          "default": 0
        };
        parameters['Parameters'].nTurns = {
          type: 'slider',
          label: 'Number of turns',
          min: 1,
          max: 50,
          "default": 10
        };
        parameters['Parameters'].nSides = {
          type: 'slider',
          label: 'Sides',
          min: 3,
          max: 100,
          "default": 50
        };
        parameters['Parameters'].animate = {
          type: 'checkbox',
          label: 'Animate',
          "default": false
        };
        parameters['Parameters'].rotationSpeed = {
          type: 'slider',
          label: 'Rotation speed',
          min: -10,
          max: 10,
          "default": 1
        };
        return parameters;
      };

      SpiralShape.parameters = SpiralShape.initializeParameters();

      SpiralShape.createTool(SpiralShape);

      SpiralShape.prototype.initialize = function() {
        this.setAnimated(this.data.animate);
      };

      SpiralShape.prototype.createShape = function() {
        var angle, angleStep, c, hh, hw, i, radiusStepX, radiusStepY, rectangle, spiralHeight, spiralWidth, step, _i, _j, _ref, _ref1;
        this.shape = this.addPath();
        rectangle = this.rectangle;
        hw = rectangle.width / 2;
        hh = rectangle.height / 2;
        c = rectangle.center;
        angle = 0;
        angleStep = 360.0 / this.data.nSides;
        spiralWidth = hw - hw * this.data.minRadius / 100.0;
        spiralHeight = hh - hh * this.data.minRadius / 100.0;
        radiusStepX = (spiralWidth / this.data.nTurns) / this.data.nSides;
        radiusStepY = (spiralHeight / this.data.nTurns) / this.data.nSides;
        for (i = _i = 0, _ref = this.data.nTurns - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
          for (step = _j = 0, _ref1 = this.data.nSides - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; step = 0 <= _ref1 ? ++_j : --_j) {
            this.shape.add(new P.Point(c.x + hw * Math.cos(angle), c.y + hh * Math.sin(angle)));
            angle += 2.0 * Math.PI * angleStep / 360.0;
            hw -= radiusStepX;
            hh -= radiusStepY;
          }
        }
        this.shape.add(new P.Point(c.x + hw * Math.cos(angle), c.y + hh * Math.sin(angle)));
        this.shape.pivot = this.rectangle.center;
        this.shape.strokeCap = 'round';
      };

      SpiralShape.prototype.onFrame = function(event) {
        this.shape.strokeColor.hue += 1;
        this.shape.rotation += this.rotationSpeed;
      };

      return SpiralShape;

    })(Shape);
    return SpiralShape;
  });

}).call(this);
