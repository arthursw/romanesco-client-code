// Generated by CoffeeScript 1.12.7
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['Items/Paths/Path'], function(Path) {
    var Shape;
    Shape = (function(superClass) {
      extend(Shape, superClass);

      function Shape() {
        return Shape.__super__.constructor.apply(this, arguments);
      }

      Shape.Shape = P.Path.Rectangle;

      Shape.label = 'Shape';

      Shape.description = "Base shape class";

      Shape.squareByDefault = true;

      Shape.centerByDefault = false;

      Shape.prototype.prepareHitTest = function(fullySelected, strokeWidth) {
        if (fullySelected == null) {
          fullySelected = true;
        }
        this.controlPath.fillColor = 'red';
        return Shape.__super__.prepareHitTest.call(this, fullySelected, strokeWidth);
      };

      Shape.prototype.finishHitTest = function(fullySelected) {
        if (fullySelected == null) {
          fullySelected = true;
        }
        this.controlPath.fillColor = null;
        return Shape.__super__.finishHitTest.call(this, fullySelected);
      };

      Shape.prototype.loadPath = function(points) {
        var distanceMax, i, j, len, point;
        if (this.data.rectangle == null) {
          console.log('Error loading shape ' + this.pk + ': invalid rectangle.');
        }
        this.rectangle = this.data.rectangle != null ? new P.Rectangle(this.data.rectangle) : new P.Rectangle();
        this.initializeControlPath();
        this.controlPath.rotation = this.rotation;
        this.initialize();
        R.rasterizer.loadItem(this);
        distanceMax = this.constructor.secureDistance * this.constructor.secureDistance;
        for (i = j = 0, len = points.length; j < len; i = ++j) {
          point = points[i];
          this.controlPath.segments[i].point === point;
          if (this.controlPath.segments[i].point.getDistance(point, true) > distanceMax) {
            this.controlPath.strokeColor = 'red';
            P.view.center = this.controlPath.bounds.center;
            console.log("Error: invalid shape!");
            return;
          }
        }
      };

      Shape.prototype.createShape = function() {
        this.shape = this.addPath(new this.constructor.Shape(this.rectangle));
      };

      Shape.prototype.process = function() {
        this.initializeDrawing();
        this.createShape();
        this.shape.rotation = this.rotation;
      };

      Shape.prototype.draw = function(simplified) {
        var error;
        if (simplified == null) {
          simplified = false;
        }
        this.drawn = false;
        if (!R.rasterizer.requestDraw(this, simplified)) {
          return;
        }
        if (!R.catchErrors) {
          this.process();
        } else {
          try {
            this.process();
          } catch (error1) {
            error = error1;
            console.error(error.stack);
            console.error(error);
            throw error;
          }
        }
        this.drawn = true;
      };

      Shape.prototype.initializeControlPath = function(pointA, pointB, shift, specialKey) {
        var center, createFromCenter, delta, height, min, ref, square, width;
        if (pointA && pointB) {
          square = this.constructor.squareByDefault ? !shift : shift;
          createFromCenter = this.constructor.centerByDefault ? !specialKey : specialKey;
          if (createFromCenter) {
            delta = pointB.subtract(pointA);
            this.rectangle = new P.Rectangle(pointA.subtract(delta), pointB);
            if (square) {
              center = this.rectangle.center;
              if (this.rectangle.width > this.rectangle.height) {
                this.rectangle.width = this.rectangle.height;
              } else {
                this.rectangle.height = this.rectangle.width;
              }
              this.rectangle.center = center;
            }
          } else {
            if (!square) {
              this.rectangle = new P.Rectangle(pointA, pointB);
            } else {
              width = pointA.x - pointB.x;
              height = pointA.y - pointB.y;
              min = Math.min(Math.abs(width), Math.abs(height));
              this.rectangle = new P.Rectangle(pointA, pointA.subtract(Utils.sign(width) * min, Utils.sign(height) * min));
            }
          }
        }
        if ((ref = this.controlPath) != null) {
          ref.remove();
        }
        if (this.rotation == null) {
          this.rotation = 0;
        }
        this.addControlPath(new P.Path.Rectangle(this.rectangle));
        this.controlPath.fillColor = R.selectionBlue;
        this.controlPath.fillColor.alpha = 0.25;
      };

      Shape.prototype.beginCreate = function(point, event) {
        var ref;
        Shape.__super__.beginCreate.call(this);
        this.downPoint = point;
        this.initializeControlPath(this.downPoint, point, event != null ? (ref = event.modifiers) != null ? ref.shift : void 0 : void 0, R.specialKey(event));
      };

      Shape.prototype.updateCreate = function(point, event) {
        var ref;
        this.initializeControlPath(this.downPoint, point, event != null ? (ref = event.modifiers) != null ? ref.shift : void 0 : void 0, R.specialKey(event));
        this.draw();
      };

      Shape.prototype.endCreate = function(point, event) {
        var ref;
        this.initializeControlPath(this.downPoint, point, event != null ? (ref = event.modifiers) != null ? ref.shift : void 0 : void 0, R.specialKey(event));
        this.initialize();
        this.draw();
        Shape.__super__.endCreate.call(this);
      };

      Shape.prototype.setRectangle = function(rectangle, update) {
        Utils.Rectangle.updatePathRectangle(this.controlPath, rectangle);
        Shape.__super__.setRectangle.call(this, rectangle, update);
      };

      Shape.prototype.getData = function() {
        var data;
        data = jQuery.extend({}, this.data);
        data.rectangle = {
          x: this.rectangle.x,
          y: this.rectangle.y,
          width: this.rectangle.width,
          height: this.rectangle.height
        };
        return data;
      };

      return Shape;

    })(Path);
    return Shape;
  });

}).call(this);
