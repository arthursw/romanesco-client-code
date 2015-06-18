// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['PrecisePath'], function(PrecisePath) {
    var SpeedPath;
    SpeedPath = (function(_super) {
      __extends(SpeedPath, _super);

      function SpeedPath() {
        return SpeedPath.__super__.constructor.apply(this, arguments);
      }

      SpeedPath.label = 'Speed path';

      SpeedPath.rdescription = "This path offers speed.";

      SpeedPath.iconURL = null;

      SpeedPath.iconAlt = null;

      SpeedPath.maxSpeed = 200;

      SpeedPath.speedStep = 20;

      SpeedPath.secureStep = 25;

      SpeedPath.initializeParameters = function() {
        var parameters;
        parameters = SpeedPath.__super__.constructor.initializeParameters.call(this);
        parameters['Edit curve'].showSpeed = {
          type: 'checkbox',
          label: 'Show speed',
          "default": false
        };
        if (R.wacomPenAPI != null) {
          parameters['Edit curve'].usePenPressure = {
            type: 'checkbox',
            label: 'Pen pressure',
            "default": true
          };
        }
        return parameters;
      };

      SpeedPath.parameters = SpeedPath.initializeParameters();

      SpeedPath.createTool(SpeedPath);

      SpeedPath.prototype.initializeDrawing = function(createCanvas) {
        if (createCanvas == null) {
          createCanvas = false;
        }
        this.speedOffset = 0;
        SpeedPath.__super__.initializeDrawing.call(this, createCanvas);
      };

      SpeedPath.prototype.loadPath = function(points) {
        if (this.data == null) {
          this.data = {};
        }
        this.speeds = this.data.speeds || [];
        SpeedPath.__super__.loadPath.call(this, points);
      };

      SpeedPath.prototype.checkUpdateDrawing = function(segment, redrawing) {
        var controlPathOffset, currentSpeed, f, previousControlPathOffset, previousSpeed, speed, step;
        if (redrawing == null) {
          redrawing = false;
        }
        if (redrawing) {
          SpeedPath.__super__.checkUpdateDrawing.call(this, segment, redrawing);
          return;
        }
        step = this.data.step;
        controlPathOffset = segment.location.offset;
        previousControlPathOffset = segment.previous != null ? segment.previous.location.offset : 0;
        previousSpeed = this.speeds.length > 0 ? this.speeds.pop() : 0;
        currentSpeed = null;
        if (!this.data.usePenPressure || R.wacomPointerType[R.wacomPenAPI.pointerType] === 'Mouse') {
          currentSpeed = controlPathOffset - previousControlPathOffset;
        } else {
          currentSpeed = R.wacomPenAPI.pressure * this.constructor.maxSpeed;
        }
        while (this.speedOffset + this.constructor.speedStep < controlPathOffset) {
          this.speedOffset += this.constructor.speedStep;
          f = (this.speedOffset - previousControlPathOffset) / currentSpeed;
          speed = Utils.linearInterpolation(previousSpeed, currentSpeed, f);
          this.speeds.push(Math.min(speed, this.constructor.maxSpeed));
        }
        this.speeds.push(Math.min(currentSpeed, this.constructor.maxSpeed));
        SpeedPath.__super__.checkUpdateDrawing.call(this, segment, redrawing);
      };

      SpeedPath.prototype.beginCreate = function(point, event) {
        this.speeds = this.data.polygonMode ? [this.constructor.maxSpeed / 3] : [];
        SpeedPath.__super__.beginCreate.call(this, point, event);
      };

      SpeedPath.prototype.endCreate = function(point, event) {
        SpeedPath.__super__.endCreate.call(this, point, event);
      };

      SpeedPath.prototype.computeSpeed = function() {
        var controlPathLength, currentAverageSpeed, currentOffset, distance, distances, f, i, interpolation, nextOffset, offset, point, pointOffset, previousDistance, previousOffset, previousPointOffset, previousSpeed, segment, speed, step, _i, _j, _len, _len1, _ref;
        step = this.constructor.speedStep;
        distances = [];
        controlPathLength = this.controlPath.length;
        currentOffset = step;
        segment = this.controlPath.firstSegment;
        distance = segment.point.getDistance(segment.next.point);
        distances.push({
          speed: distance,
          offset: 0
        });
        previousDistance = 0;
        pointOffset = 0;
        previousPointOffset = 0;
        _ref = this.controlPath.segments;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          segment = _ref[i];
          if (i === 0) {
            continue;
          }
          point = segment.point;
          previousDistance = distance;
          distance = point.getDistance(segment.previous.point);
          previousPointOffset = pointOffset;
          pointOffset += distance;
          while (pointOffset > currentOffset) {
            f = (currentOffset - previousPointOffset) / distance;
            interpolation = Utils.linearInterpolation(previousDistance, distance, f);
            distances.push({
              speed: interpolation,
              offset: currentOffset
            });
            currentOffset += step;
          }
          distances.push({
            speed: distance,
            offset: pointOffset
          });
        }
        distances.push({
          speed: distance,
          offset: currentOffset
        });
        this.speeds = [];
        nextOffset = step;
        speed = distances[0].speed;
        previousSpeed = speed;
        this.speeds.push(speed);
        offset = 0;
        previousOffset = offset;
        currentAverageSpeed = 0;
        for (i = _j = 0, _len1 = distances.length; _j < _len1; i = ++_j) {
          distance = distances[i];
          if (i === 0) {
            continue;
          }
          previousSpeed = speed;
          speed = distance.speed;
          previousOffset = offset;
          offset = distance.offset;
          currentAverageSpeed += ((speed + previousSpeed) / 2.0) * (offset - previousOffset) / step;
          if (offset === nextOffset) {
            this.speeds.push(Math.min(currentAverageSpeed, this.constructor.maxSpeed));
            currentAverageSpeed = 0;
            nextOffset += step;
          }
        }
      };

      SpeedPath.prototype.showSpeed = function() {
        var _ref, _ref1;
        if ((_ref = this.speedGroup) != null) {
          _ref.visible = this.data.showSpeed;
        }
        if ((this.speeds == null) || !this.data.showSpeed) {
          return;
        }
        if ((_ref1 = this.speedGroup) != null) {
          _ref1.bringToFront();
        }
      };

      SpeedPath.prototype.modifySpeed = function(speeds, update) {
        var _ref;
        this.speeds = speeds;
        this.updateSpeed();
        this.draw();
        if (!this.socketAction) {
          if (update) {
            this.update('speed');
          }
          R.chatSocket.emit("bounce", {
            itemPk: this.pk,
            "function": "modifySpeed",
            "arguments": [this.speeds, false]
          });
        } else {
          if ((_ref = this.speedGroup) != null) {
            _ref.visible = (this.selectionRectangle != null) && this.data.showSpeed;
          }
        }
      };

      SpeedPath.prototype.updateSpeed = function() {
        var alreadyExists, controlPathLength, handle, handlePoint, i, j, normal, normalNormalized, o, offset, point, s, speed, speedCurve, speedHandle, speedHandles, speedHandlesLengthM1, step, _i, _j, _len, _ref, _ref1, _ref2;
        if ((_ref = this.speedGroup) != null) {
          _ref.visible = this.data.showSpeed;
        }
        if ((this.speeds == null) || !this.data.showSpeed) {
          return;
        }
        step = this.constructor.speedStep;
        alreadyExists = this.speedGroup != null;
        if (alreadyExists) {
          this.speedGroup.bringToFront();
          speedCurve = this.speedGroup.firstChild;
        } else {
          this.speedGroup = new P.Group();
          this.speedGroup.name = "speed group";
          this.speedGroup.strokeWidth = 1;
          this.speedGroup.strokeColor = R.selectionBlue;
          this.speedGroup.controller = this;
          this.group.addChild(this.speedGroup);
          speedCurve = new P.Path();
          speedCurve.name = "speed curve";
          speedCurve.strokeWidth = 1;
          speedCurve.strokeColor = R.selectionBlue;
          speedCurve.controller = this;
          this.speedGroup.addChild(speedCurve);
          this.handleGroup = new P.Group();
          this.handleGroup.name = "speed handle group";
          this.speedGroup.addChild(this.handleGroup);
        }
        speedHandles = this.handleGroup.children;
        offset = 0;
        controlPathLength = this.controlPath.length;
        while ((this.speeds.length - 1) * step < controlPathLength) {
          this.speeds.push(_.last(this.speeds));
        }
        i = 0;
        _ref1 = this.speeds;
        for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
          speed = _ref1[i];
          offset = i > 0 ? i * step : 0.1;
          o = offset < controlPathLength ? offset : controlPathLength - 0.1;
          point = this.controlPath.getPointAt(o);
          normalNormalized = this.controlPath.getNormalAt(o).normalize();
          normal = normalNormalized.multiply(this.speeds[i]);
          handlePoint = point.add(normal);
          if (alreadyExists && i < speedCurve.segments.length) {
            speedCurve.segments[i].point = handlePoint;
            speedHandles[i].position = handlePoint;
            speedHandles[i].rsegment.firstSegment.point = point;
            speedHandles[i].rsegment.lastSegment.point = handlePoint;
            speedHandles[i].rnormal = normalNormalized;
          } else {
            speedCurve.add(handlePoint);
            s = new P.Path();
            s.name = 'speed segment';
            s.strokeWidth = 1;
            s.strokeColor = R.selectionBlue;
            s.add(point);
            s.add(handlePoint);
            s.controller = this;
            this.speedGroup.addChild(s);
            handle = new P.Path.Rectangle(handlePoint.subtract(2), 4);
            handle.name = 'speed handle';
            handle.strokeWidth = 1;
            handle.strokeColor = R.selectionBlue;
            handle.fillColor = 'white';
            handle.rnormal = normalNormalized;
            handle.rindex = i;
            handle.rsegment = s;
            handle.controller = this;
            this.handleGroup.addChild(handle);
          }
          if (offset > controlPathLength) {
            break;
          }
        }
        if (offset > controlPathLength && i + 1 <= speedHandles.length - 1) {
          speedHandlesLengthM1 = speedHandles.length - 1;
          for (j = _j = _ref2 = i + 1; _ref2 <= speedHandlesLengthM1 ? _j <= speedHandlesLengthM1 : _j >= speedHandlesLengthM1; j = _ref2 <= speedHandlesLengthM1 ? ++_j : --_j) {
            speedHandle = this.handleGroup.lastChild;
            speedHandle.rsegment.remove();
            speedHandle.remove();
            speedCurve.lastSegment.remove();
          }
        }
      };

      SpeedPath.prototype.speedAt = function(offset) {
        var f, i;
        f = offset % this.constructor.speedStep;
        i = (offset - f) / this.constructor.speedStep;
        f /= this.constructor.speedStep;
        if (this.speeds != null) {
          if (i < this.speeds.length - 1) {
            return Utils.linearInterpolation(this.speeds[i], this.speeds[i + 1], f);
          } else {
            return _.last(this.speeds);
          }
        } else {
          this.constructor.maxSpeed / 2;
        }
      };

      SpeedPath.prototype.draw = function(simplified) {
        if (simplified == null) {
          simplified = false;
        }
        this.speedOffset = 0;
        SpeedPath.__super__.draw.call(this, simplified);
        if (this.controlPath.selected) {
          this.updateSpeed();
        }
      };

      SpeedPath.prototype.getData = function() {
        var data;
        delete this.data.usePenPressure;
        data = jQuery.extend({}, SpeedPath.__super__.getData.call(this));
        data.speeds = (this.speeds != null) && (this.handleGroup != null) ? this.speeds.slice(0, this.handleGroup.children.length + 1) : this.speeds;
        return data;
      };

      SpeedPath.prototype.select = function() {
        var _ref;
        if (!SpeedPath.__super__.select.call(this)) {
          return false;
        }
        this.showSpeed();
        if (this.data.showSpeed) {
          if (this.speedGroup == null) {
            this.updateSpeed();
          }
          if ((_ref = this.speedGroup) != null) {
            _ref.visible = true;
          }
        }
        return true;
      };

      SpeedPath.prototype.deselect = function() {
        var _ref;
        if (!SpeedPath.__super__.deselect.call(this)) {
          return false;
        }
        if ((_ref = this.speedGroup) != null) {
          _ref.visible = false;
        }
        return true;
      };

      SpeedPath.prototype.initializeSelection = function(event, hitResult) {
        var _ref;
        if ((_ref = this.speedSelectionHighlight) != null) {
          _ref.remove();
        }
        this.speedSelectionHighlight = null;
        if (hitResult.item.name === "speed handle") {
          this.selectionState = {
            speedHandle: hitResult.item
          };
          return;
        }
        SpeedPath.__super__.initializeSelection.call(this, event, hitResult);
      };

      SpeedPath.prototype.updateModifySpeed = function(event) {
        var delta, handle, handlePosition, handleToPoint, handlei, i, index, influence, influenceFactor, max, maxSpeed, n, newHandleToPoint, projection, projectionLength, sign, _i, _ref, _ref1;
        if (this.selectionState.speedHandle != null) {
          if ((_ref = this.speedSelectionHighlight) != null) {
            _ref.remove();
          }
          maxSpeed = this.constructor.maxSpeed;
          this.speedSelectionHighlight = new P.Path();
          this.speedSelectionHighlight.name = 'speed selection highlight';
          this.speedSelectionHighlight.strokeWidth = 1;
          this.speedSelectionHighlight.strokeColor = 'blue';
          this.speedGroup.addChild(this.speedSelectionHighlight);
          handle = this.selectionState.speedHandle;
          handlePosition = handle.bounds.center;
          handleToPoint = event.point.subtract(handlePosition);
          projection = handleToPoint.project(handle.rnormal);
          projectionLength = projection.length;
          sign = Math.sign(projection.x) === Math.sign(handle.rnormal.x) && Math.sign(projection.y) === Math.sign(handle.rnormal.y);
          sign = sign ? 1 : -1;
          this.speeds[handle.rindex] += sign * projectionLength;
          if (this.speeds[handle.rindex] < 0) {
            this.speeds[handle.rindex] = 0;
          } else if (this.speeds[handle.rindex] > maxSpeed) {
            this.speeds[handle.rindex] = maxSpeed;
          }
          newHandleToPoint = event.point.subtract(handle.position.add(projection));
          influenceFactor = newHandleToPoint.length / (this.constructor.speedStep * 3);
          max = Utils.gaussian(0, influenceFactor, 0);
          i = 1;
          influence = 1;
          while (influence > 0.1 && i < 20) {
            influence = Utils.gaussian(0, influenceFactor, i) / max;
            delta = projectionLength * influence;
            for (n = _i = -1; _i <= 1; n = _i += 2) {
              index = handle.rindex + n * i;
              if (index >= 0 && index < this.handleGroup.children.length) {
                handlei = this.handleGroup.children[index];
                this.speeds[index] += sign * delta;
                if (this.speeds[index] < 0) {
                  this.speeds[index] = 0;
                } else if (this.speeds[index] > maxSpeed) {
                  this.speeds[index] = maxSpeed;
                }
              }
            }
            i++;
          }
          this.speedSelectionHighlight.strokeColor.hue -= Math.min(240 * (influenceFactor / 10), 240);
          this.speedSelectionHighlight.add(handle.position.add(projection));
          this.speedSelectionHighlight.add(event.point);
          this.draw(true);
          if (this.selectionRectangle != null) {
            if ((_ref1 = this.selectionHighlight) != null) {
              _ref1.position = this.selectionState.segment.point;
            }
          }
        }
      };

      SpeedPath.prototype.endModifySpeed = function() {
        var _ref;
        this.draw();
        this.rasterize();
        this.update('speed');
        if ((_ref = this.speedSelectionHighlight) != null) {
          _ref.remove();
        }
        this.speedSelectionHighlight = null;
        if (!this.socketAction) {
          R.chatSocket.emit("bounce", {
            itemPk: this.pk,
            "function": "modifySpeed",
            "arguments": [this.speeds, false]
          });
        }
      };

      SpeedPath.prototype.remove = function() {
        this.speedGroup = null;
        SpeedPath.__super__.remove.call(this);
      };

      return SpeedPath;

    })(PrecisePath);
    return SpeedPath;
  });

}).call(this);

//# sourceMappingURL=SpeedPath.map