// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['Tools/Tool'], function(Tool) {
    var ItemTool;
    ItemTool = (function(_super) {
      __extends(ItemTool, _super);

      function ItemTool(Item) {
        this.Item = Item;
        ItemTool.__super__.constructor.call(this, true);
        return;
      }

      ItemTool.prototype.select = function(deselectItems, updateParameters) {
        if (deselectItems == null) {
          deselectItems = true;
        }
        if (updateParameters == null) {
          updateParameters = true;
        }
        R.rasterizer.drawItems();
        ItemTool.__super__.select.apply(this, arguments);
      };

      ItemTool.prototype.begin = function(event, from) {
        var point;
        if (from == null) {
          from = R.me;
        }
        point = event.point;
        R.tools.select.deselectAll();
        R.currentPaths[from] = new P.Path.Rectangle(point, point);
        R.currentPaths[from].name = 'div tool rectangle';
        R.currentPaths[from].dashArray = [4, 10];
        R.currentPaths[from].strokeColor = 'black';
        R.view.selectionLayer.addChild(R.currentPaths[from]);
        if ((R.me != null) && from === R.me) {
          R.socket.emit("bounce", {
            tool: this.name,
            "function": "begin",
            "arguments": [event, R.me, R.currentPaths[from].data]
          });
        }
      };

      ItemTool.prototype.update = function(event, from) {
        var bounds, lock, locks, point, _i, _len;
        if (from == null) {
          from = R.me;
        }
        point = event.point;
        R.currentPaths[from].segments[2].point = point;
        R.currentPaths[from].segments[1].point.x = point.x;
        R.currentPaths[from].segments[3].point.y = point.y;
        R.currentPaths[from].fillColor = null;
        bounds = R.currentPaths[from].bounds;
        locks = Lock.getLocksWhichIntersect(bounds);
        for (_i = 0, _len = locks.length; _i < _len; _i++) {
          lock = locks[_i];
          if (lock.owner !== R.me || (this.name !== 'Lock' && !lock.rectangle.contains(bounds))) {
            R.currentPaths[from].fillColor = 'red';
          }
        }
        if (Grid.rectangleOverlapsTwoPlanets(bounds)) {
          R.currentPaths[from].fillColor = 'red';
        }
        if ((R.me != null) && from === R.me) {
          R.socket.emit("bounce", {
            tool: this.name,
            "function": "update",
            "arguments": [event, R.me]
          });
        }
      };

      ItemTool.prototype.end = function(event, from) {
        var bounds, lock, locks, point, _i, _len;
        if (from == null) {
          from = R.me;
        }
        if (from !== R.me) {
          R.currentPaths[from].remove();
          delete R.currentPaths[from];
          return false;
        }
        point = event.point;
        R.currentPaths[from].remove();
        bounds = R.currentPaths[from].bounds;
        locks = Lock.getLocksWhichIntersect(bounds);
        for (_i = 0, _len = locks.length; _i < _len; _i++) {
          lock = locks[_i];
          if (lock.owner !== R.me || (this.name !== 'Lock' && !lock.rectangle.contains(bounds))) {
            R.alertManager.alert('Your item intersects with a locked area.', 'error');
            return false;
          }
        }
        if (Grid.rectangleOverlapsTwoPlanets(bounds)) {
          R.alertManager.alert('Your item overlaps with two planets.', 'error');
          return false;
        }
        if (R.currentPaths[from].bounds.area < 100) {
          R.currentPaths[from].width = 10;
          R.currentPaths[from].height = 10;
        }
        if ((R.me != null) && from === R.me) {
          R.socket.emit("bounce", {
            tool: this.name,
            "function": "end",
            "arguments": [event, R.me]
          });
        }
        return true;
      };

      return ItemTool;

    })(Tool);
    R.Tools.Item = ItemTool;
    return ItemTool;
  });

}).call(this);
