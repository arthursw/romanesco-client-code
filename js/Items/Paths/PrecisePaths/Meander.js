// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['Items/Paths/PrecisePaths/StepPath'], function(StepPath) {
    var Meander;
    Meander = (function(_super) {
      __extends(Meander, _super);

      function Meander() {
        return Meander.__super__.constructor.apply(this, arguments);
      }

      Meander.label = 'Meander';

      Meander.description = "As Karl Kerenyi pointed out, \"the meander is the figure of a labyrinth in linear form\".\nA meander or meandros (Greek: Μαίανδρος) is a decorative border constructed from a continuous line, shaped into a repeated motif.\nSuch a design is also called the Greek fret or Greek key design, although these are modern designations.\n(source: http://en.wikipedia.org/wiki/Meander_(art))";

      Meander.iconURL = "static/images/icons/inverted/squareSpiral.png";

      Meander.initializeParameters = function() {
        var parameters;
        parameters = Meander.__super__.constructor.initializeParameters.call(this);
        if (parameters['Parameters'] == null) {
          parameters['Parameters'] = {};
        }
        parameters['Parameters'].step = {
          type: 'slider',
          label: 'Step',
          min: 10,
          max: 100,
          "default": 20,
          simplified: 20,
          step: 1
        };
        parameters['Parameters'].thickness = {
          type: 'slider',
          label: 'Thickness',
          min: 1,
          max: 30,
          "default": 5,
          step: 1
        };
        parameters['Parameters'].rsmooth = {
          type: 'checkbox',
          label: 'Smooth',
          "default": false
        };
        return parameters;
      };

      Meander.parameters = Meander.initializeParameters();

      Meander.createTool(Meander);

      Meander.prototype.beginDraw = function() {
        this.initializeDrawing(false);
        this.line = this.addPath();
        this.spiral = this.addPath();
      };

      Meander.prototype.updateDraw = function(offset, step) {
        var normal, p1, p2, p3, p4, p5, p6, p7, p8, p9, point, tangent;
        if (!step) {
          return;
        }
        point = this.controlPath.getPointAt(offset);
        normal = this.controlPath.getNormalAt(offset).normalize();
        tangent = normal.rotate(90);
        this.line.add(point);
        this.spiral.add(point.add(normal.multiply(this.data.thickness)));
        p1 = point.add(normal.multiply(this.data.step));
        this.spiral.add(p1);
        p2 = p1.add(tangent.multiply(this.data.step - this.data.thickness));
        this.spiral.add(p2);
        p3 = p2.add(normal.multiply(-(this.data.step - 2 * this.data.thickness)));
        this.spiral.add(p3);
        p4 = p3.add(tangent.multiply(-(this.data.step - 3 * this.data.thickness)));
        this.spiral.add(p4);
        p5 = p4.add(normal.multiply(this.data.thickness));
        this.spiral.add(p5);
        p6 = p5.add(tangent.multiply(this.data.step - 4 * this.data.thickness));
        this.spiral.add(p6);
        p7 = p6.add(normal.multiply(this.data.step - 4 * this.data.thickness));
        this.spiral.add(p7);
        p8 = p7.add(tangent.multiply(-(this.data.step - 3 * this.data.thickness)));
        this.spiral.add(p8);
        p9 = p8.add(normal.multiply(-(this.data.step - 2 * this.data.thickness)));
        this.spiral.add(p9);
      };

      Meander.prototype.endDraw = function() {
        if (this.data.rsmooth) {
          this.spiral.smooth();
          this.line.smooth();
        }
      };

      return Meander;

    })(StepPath);
    return Meander;
  });

}).call(this);
