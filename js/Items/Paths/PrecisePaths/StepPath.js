// Generated by CoffeeScript 1.10.0
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['Items/Paths/PrecisePaths/PrecisePath'], function(PrecisePath) {
    var StepPath;
    StepPath = (function(superClass) {
      extend(StepPath, superClass);

      function StepPath() {
        return StepPath.__super__.constructor.apply(this, arguments);
      }

      StepPath.label = 'Step path';

      StepPath.initializeParameters = function() {
        var parameters;
        parameters = StepPath.__super__.constructor.initializeParameters.call(this);
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
        return parameters;
      };

      StepPath.parameters = StepPath.initializeParameters();

      StepPath.prototype.checkUpdateDrawing = function(segment, redrawing) {
        var controlPathOffset, step;
        if (redrawing == null) {
          redrawing = true;
        }
        step = this.data.step;
        controlPathOffset = segment.location.offset;
        while (this.drawingOffset + step < controlPathOffset) {
          this.drawingOffset += step;
          this.updateDraw(this.drawingOffset, true, redrawing);
        }
        if (this.drawingOffset + step > controlPathOffset) {
          this.updateDraw(controlPathOffset, false, redrawing);
        }
      };

      return StepPath;

    })(PrecisePath);
    return StepPath;
  });

}).call(this);
