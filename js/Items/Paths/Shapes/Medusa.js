// Generated by CoffeeScript 1.7.1
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['Items/Paths/Shapes/Shape'], function(Shape) {
    var Medusa;
    Medusa = (function(_super) {
      __extends(Medusa, _super);

      function Medusa() {
        this.onFrame = __bind(this.onFrame, this);
        return Medusa.__super__.constructor.apply(this, arguments);
      }

      Medusa.Shape = P.Path.Rectangle;

      Medusa.label = 'Medusa';

      Medusa.description = "Creates a bunch of aniamted Medusa.";

      Medusa.squareByDefault = true;

      Medusa.initializeParameters = function() {
        var parameters;
        parameters = Medusa.__super__.constructor.initializeParameters.call(this);
        if (parameters['Parameters'] == null) {
          parameters['Parameters'] = {};
        }
        parameters['Parameters'].stripeWidth = {
          type: 'slider',
          label: 'Stripe width',
          min: 1,
          max: 5,
          "default": 1
        };
        parameters['Parameters'].maskWidth = {
          type: 'slider',
          label: 'Mask width',
          min: 1,
          max: 4,
          "default": 1
        };
        parameters['Parameters'].speed = {
          type: 'slider',
          label: 'Speed',
          min: 0.01,
          max: 1.0,
          "default": 0.1
        };
        return parameters;
      };

      Medusa.parameters = Medusa.initializeParameters();

      Medusa.createTool(Medusa);

      Medusa.prototype.initialize = function() {
        this.data.animate = true;
        this.setAnimated(this.data.animate);
      };

      Medusa.prototype.createShape = function() {
        var i, j, normal, point, position, step, tentacle, topSegment, _i, _j;
        this.data.nTentacles;
        this.data.nSegments;
        this.data.pulsePeriod;
        this.data.elasticConstant;
        this.path = this.addPath();
        topSegment = new P.Segment(this.rectangle.center.x, this.rectangle.top);
        topSegment.handleIn = new P.Point(-this.rectangle.width / 3, 0);
        topSegment.handleOut = new P.Point(this.rectangle.width / 3, 0);
        this.path.add(topSegment);
        this.leftSegment = new P.Segment(this.rectangle.left, this.rectangle.top + this.rectangle.height * 0.7);
        this.leftSegment.handleIn = new P.Point(0, -this.rectangle.height * 0.5);
        this.leftSegment.handleOut = new P.Point(0, this.rectangle.height * 0.3);
        this.path.add(this.leftSegment);
        this.rightSegment = new P.Segment(this.rectangle.right, this.rectangle.top + this.rectangle.height * 0.7);
        this.rightSegment.handleIn = new P.Point(0, -this.rectangle.height * 0.5);
        this.rightSegment.handleOut = new P.Point(0, this.rectangle.height * 0.3);
        this.path.add(this.rightSegment);
        position = this.leftSegment.location.offset;
        step = (this.rightSegment.location.offset - this.leftSegment.location.offset) / nTentacles;
        this.tentacles = [];
        for (i = _i = 0; 0 <= nTentacles ? _i <= nTentacles : _i >= nTentacles; i = 0 <= nTentacles ? ++_i : --_i) {
          console.log("draw tentacle");
          point = this.path.getPointAt(position);
          normal = this.path.getNormalAt(position);
          tentacle = this.addPath();
          tentacle.add(point);
          for (j = _j = 0; 0 <= nSegments ? _j <= nSegments : _j >= nSegments; j = 0 <= nSegments ? ++_j : --_j) {
            tentacle.add(point.add(normal.multiply(j)));
          }
          this.tentacles.push(tentacle);
          position += step;
        }
      };

      Medusa.prototype.onFrame = function(event) {
        var delta, direction, force, lastPoint, normal, position, segment, step, tentacle, time, _i, _j, _len, _len1, _ref, _ref1;
        direction = new P.Point(1, 0);
        direction.angle = this.rotation;
        normal = direction.clone();
        normal.angle += 90;
        force = null;
        time = Date.now();
        if (time > this.lastUpdate + this.data.pulsePeriod) {
          this.lastUpdate = time;
          force = normal.multiply(this.data.pulseAmplitude);
        } else {
          force = normal.multiply(-0.1 * this.data.pulseAmplitude);
        }
        this.leftSegment.point = this.leftSegment.point.add(force);
        this.rightSegment.point = this.rightSegment.point.subtract(force);
        position = this.leftSegment.location.offset;
        step = (this.rightSegment.location.offset - this.leftSegment.location.offset) / nTentacles;
        _ref = this.tentacles;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          tentacle = _ref[_i];
          lastPoint = this.path.getPointAt(position);
          _ref1 = tentacle.segments;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            segment = _ref1[_j];
            delta = lastPoint.subtract(segment.point);
            segment.point.translate(delta.multiply(this.data.elasticConstant));
            lastPoint = segment.point;
          }
          position += step;
        }
      };

      return Medusa;

    })(Shape);
    return Medusa;
  });

}).call(this);
