// Generated by CoffeeScript 1.12.7
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['Tools/Tool', 'UI/Button'], function(Tool, Button) {
    var PathTool;
    PathTool = (function(superClass) {
      extend(PathTool, superClass);

      PathTool.label = '';

      PathTool.description = '';

      PathTool.iconURL = '';

      PathTool.cursor = {
        position: {
          x: 0,
          y: 0
        },
        name: 'crosshair'
      };

      PathTool.drawItems = true;

      function PathTool(Path, justCreated) {
        this.Path = Path;
        if (justCreated == null) {
          justCreated = false;
        }
        this.name = this.Path.label;
        if (this.Path.description) {
          this.constructor.description = this.Path.rdescription;
        }
        if (this.Path.iconURL) {
          this.constructor.iconURL = this.Path.iconURL;
        }
        if (this.Path.category) {
          this.constructor.category = this.Path.category;
        }
        if (this.Path.cursor) {
          this.constructor.cursor = this.Path.cursor;
        }
        if (justCreated && (R.tools[this.name] != null)) {
          g[this.Path.constructor.name] = this.Path;
          R.tools[this.name].remove();
          delete R.tools[this.name];
          R.lastPathCreated = this.Path;
        }
        R.tools[this.name] = this;
        this.btnJ = R.sidebar.allToolsJ.find('li[data-name="' + this.name + '"]');
        PathTool.__super__.constructor.call(this, this.btnJ.length === 0);
        if (justCreated) {
          this.select();
        }
        return;
      }

      PathTool.prototype.remove = function() {
        this.btnJ.remove();
      };

      PathTool.prototype.select = function(deselectItems, updateParameters) {
        if (deselectItems == null) {
          deselectItems = true;
        }
        if (updateParameters == null) {
          updateParameters = true;
        }
        R.rasterizer.drawItems();
        PathTool.__super__.select.apply(this, arguments);
        R.view.tool.onMouseMove = this.move;
      };

      PathTool.prototype.updateParameters = function() {
        R.controllerManager.setSelectedTool(this.Path);
      };

      PathTool.prototype.deselect = function() {
        PathTool.__super__.deselect.call(this);
        this.finish();
        R.view.tool.onMouseMove = null;
      };

      PathTool.prototype.begin = function(event, from, data) {
        var ref;
        if (from == null) {
          from = R.me;
        }
        if (data == null) {
          data = null;
        }
        if (event.event.which === 2) {
          return;
        }
        if (100 * P.view.zoom < 10) {
          R.alertManager.alert("You can not draw path at a zoom smaller than 10.", "Info");
          return;
        }
        if (!((R.currentPaths[from] != null) && ((ref = R.currentPaths[from].data) != null ? ref.polygonMode : void 0))) {
          R.tools.select.deselectAll();
          console.log("PathRool data:");
          console.log(data);
          R.currentPaths[from] = new this.Path(Date.now(), data);
        }
        R.currentPaths[from].beginCreate(event.point, event, false);
        if ((R.me != null) && from === R.me) {
          data = R.currentPaths[from].data;
          data.id = R.currentPaths[from].id;
          R.socket.emit("bounce", {
            tool: this.name,
            "function": "begin",
            "arguments": [event, R.me, data]
          });
        }
      };

      PathTool.prototype.update = function(event, from) {
        if (from == null) {
          from = R.me;
        }
        R.currentPaths[from].updateCreate(event.point, event, false);
        if ((R.me != null) && from === R.me) {
          R.socket.emit("bounce", {
            tool: this.name,
            "function": "update",
            "arguments": [event, R.me]
          });
        }
      };

      PathTool.prototype.move = function(event) {
        var base, ref, ref1;
        if ((ref = R.currentPaths[R.me]) != null ? (ref1 = ref.data) != null ? ref1.polygonMode : void 0 : void 0) {
          if (typeof (base = R.currentPaths[R.me]).createMove === "function") {
            base.createMove(event);
          }
        }
      };

      PathTool.prototype.createPath = function(event, from) {
        var path;
        path = R.currentPaths[from];
        if (!path.group) {
          return;
        }
        if ((R.me != null) && from === R.me) {
          if ((R.me != null) && from === R.me) {
            R.socket.emit("bounce", {
              tool: this.name,
              "function": "createPath",
              "arguments": [event, R.me]
            });
          }
          path.save(true);
          path.select(false);
        } else {
          path.endCreate(event.point, event);
        }
        delete R.currentPaths[from];
      };

      PathTool.prototype.end = function(event, from) {
        var path, ref;
        if (from == null) {
          from = R.me;
        }
        path = R.currentPaths[from];
        path.endCreate(event.point, event, false);
        if (!((ref = path.data) != null ? ref.polygonMode : void 0)) {
          this.createPath(event, from);
        }
      };

      PathTool.prototype.finish = function(from) {
        var ref, ref1;
        if (from == null) {
          from = R.me;
        }
        if (!((ref = R.currentPaths[R.me]) != null ? (ref1 = ref.data) != null ? ref1.polygonMode : void 0 : void 0)) {
          return false;
        }
        R.currentPaths[from].finish();
        this.createPath(event, from);
        return true;
      };

      PathTool.prototype.keyUp = function(event) {
        var finishingPath;
        switch (event.key) {
          case 'enter':
            if (typeof this.finish === "function") {
              this.finish();
            }
            break;
          case 'escape':
            finishingPath = typeof this.finish === "function" ? this.finish() : void 0;
            if (!finishingPath) {
              R.tools.select.deselectAll();
            }
        }
      };

      return PathTool;

    })(Tool);
    R.Tools.Path = PathTool;
    return PathTool;
  });

}).call(this);
