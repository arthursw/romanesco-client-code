// Generated by CoffeeScript 1.10.0
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['Tools/Tool'], function(Tool) {
    var MoveTool;
    MoveTool = (function(superClass) {
      extend(MoveTool, superClass);

      MoveTool.label = 'Move';

      MoveTool.description = '';

      MoveTool.iconURL = 'hand.png';

      MoveTool.favorite = true;

      MoveTool.category = '';

      MoveTool.cursor = {
        position: {
          x: 32,
          y: 32
        },
        name: 'default',
        icon: 'hand'
      };

      MoveTool.order = 0;

      function MoveTool() {
        MoveTool.__super__.constructor.call(this, true);
        this.prevPoint = {
          x: 0,
          y: 0
        };
        this.dragging = false;
        return;
      }

      MoveTool.prototype.select = function(deselectItems, updateParameters) {
        var div, i, len, ref;
        if (deselectItems == null) {
          deselectItems = false;
        }
        if (updateParameters == null) {
          updateParameters = true;
        }
        MoveTool.__super__.select.call(this, deselectItems, updateParameters);
        R.stageJ.addClass("moveTool");
        ref = R.divs;
        for (i = 0, len = ref.length; i < len; i++) {
          div = ref[i];
          div.disableInteraction();
        }
      };

      MoveTool.prototype.deselect = function() {
        var div, i, len, ref;
        MoveTool.__super__.deselect.call(this);
        R.stageJ.removeClass("moveTool");
        ref = R.divs;
        for (i = 0, len = ref.length; i < len; i++) {
          div = ref[i];
          div.enableInteraction();
        }
      };

      MoveTool.prototype.begin = function(event) {};

      MoveTool.prototype.update = function(event) {};

      MoveTool.prototype.end = function(moved) {};

      MoveTool.prototype.beginNative = function(event) {
        this.dragging = true;
        this.initialPosition = {
          x: event.pageX,
          y: event.pageY
        };
        this.prevPoint = {
          x: event.pageX,
          y: event.pageY
        };
      };

      MoveTool.prototype.updateNative = function(event) {
        if (this.dragging) {
          R.view.moveBy({
            x: (this.prevPoint.x - event.pageX) / P.view.zoom,
            y: (this.prevPoint.y - event.pageY) / P.view.zoom
          });
          this.prevPoint = {
            x: event.pageX,
            y: event.pageY
          };
        }
      };

      MoveTool.prototype.endNative = function(event) {
        this.dragging = false;
      };

      return MoveTool;

    })(Tool);
    R.Tools.Move = MoveTool;
    return MoveTool;
  });

}).call(this);
