// Generated by CoffeeScript 1.12.7
(function() {
  define(['Commands/Command', 'Tools/ItemTool'], function(Command, ItemTool) {
    var Item;
    console.log('Item');
    Item = (function() {
      Item.hitOptions = {
        segments: true,
        stroke: true,
        fill: true,
        selected: true,
        tolerance: 5
      };

      Item.zIndexSortStop = function(event, ui) {
        var i, item, len, nextItemJ, previousItemJ, previouslySelectedItems, rItem;
        previouslySelectedItems = R.selectedItems;
        R.tools.select.deselectAll();
        rItem = R.items[ui.item.attr("data-pk")];
        nextItemJ = ui.item.next();
        if (nextItemJ.length > 0) {
          rItem.insertAbove(R.items[nextItemJ.attr("data-pk")], null, true);
        } else {
          previousItemJ = ui.item.prev();
          if (previousItemJ.length > 0) {
            rItem.insertBelow(R.items[previousItemJ.attr("data-pk")], null, true);
          }
        }
        for (i = 0, len = previouslySelectedItems.length; i < len; i++) {
          item = previouslySelectedItems[i];
          item.select();
        }
      };

      Item.addItemToStage = function(item) {
        Item.addItemTo(item);
      };

      Item.addItemTo = function(item, lock) {
        var group, parent, wasSelected;
        if (lock == null) {
          lock = null;
        }
        wasSelected = item.isSelected();
        if (wasSelected) {
          item.deselect();
        }
        group = lock ? lock.group : R.view.mainLayer;
        group.addChild(item.group);
        item.lock = lock;
        Utils.Array.remove(item.sortedItems, item);
        parent = lock || R.sidebar;
        if (Item.Div.prototype.isPrototypeOf(item)) {
          item.sortedItems = parent.sortedDivs;
          parent.itemListsJ.find(".rDiv-list").append(item.liJ);
        } else if (Item.Path.prototype.isPrototypeOf(item)) {
          item.sortedItems = parent.sortedPaths;
          parent.itemListsJ.find(".rPath-list").append(item.liJ);
        } else {
          console.error("Error: the item is neither an Div nor an RPath");
        }
        item.updateZindex();
        if (wasSelected) {
          item.select();
        }
      };

      Item.updatePositionAndSizeControllers = function(position, size) {
        var ref, ref1;
        if ((ref = R.controllerManager.getController('Position & size', 'position')) != null) {
          ref.setValue(Utils.pointToString(position));
        }
        if ((ref1 = R.controllerManager.getController('Position & size', 'size')) != null) {
          ref1.setValue(Utils.pointToString(size));
        }
      };

      Item.onPositionFinishChange = function(position) {
        var ref, ref1;
        if ((ref = R.tools.select) != null) {
          if ((ref1 = ref.selectionRectangle) != null) {
            ref1.setPosition(Utils.stringToPoint(position));
          }
        }
      };

      Item.onSizeFinishChange = function(size) {
        var ref, ref1;
        if ((ref = R.tools.select) != null) {
          if ((ref1 = ref.selectionRectangle) != null) {
            ref1.setSize(Utils.stringToPoint(size));
          }
        }
      };

      Item.initializeParameters = function() {
        var parameters;
        parameters = {
          'Items': {
            align: R.parameters.align,
            distribute: R.parameters.distribute,
            "delete": R.parameters["delete"]
          },
          'Style': {
            strokeWidth: R.parameters.strokeWidth,
            strokeColor: R.parameters.strokeColor,
            fillColor: R.parameters.fillColor
          },
          'Position & size': {
            position: {
              "default": '',
              initializeController: function(controller) {
                var averagePosition, i, item, len, n, ref;
                averagePosition = new P.Point();
                n = 0;
                ref = R.selectedItems;
                for (i = 0, len = ref.length; i < len; i++) {
                  item = ref[i];
                  if (item.rectangle != null) {
                    averagePosition = averagePosition.add(item.rectangle.topLeft);
                    n++;
                  }
                }
                averagePosition = averagePosition.divide(n);
                controller.setValue('' + averagePosition.x.toFixed(2) + ', ' + averagePosition.y.toFixed(2));
              },
              label: 'Position',
              onChange: function() {},
              onFinishChange: this.onPositionFinishChange
            },
            size: {
              "default": '',
              initializeController: function(controller) {
                var averageSize, i, item, len, n, ref;
                averageSize = new P.Point();
                n = 0;
                ref = R.selectedItems;
                for (i = 0, len = ref.length; i < len; i++) {
                  item = ref[i];
                  if (item.rectangle != null) {
                    averageSize = averageSize.add(item.rectangle.size);
                    n++;
                  }
                }
                averageSize = averageSize.divide(n);
                controller.setValue('' + averageSize.x.toFixed(2) + ', ' + averageSize.y.toFixed(2));
              },
              label: 'Size',
              onChange: function() {},
              onFinishChange: this.onSizeFinishChange
            }
          }
        };
        return parameters;
      };

      Item.parameters = Item.initializeParameters();

      Item.create = function(duplicateData) {
        var copy;
        copy = new this(duplicateData);
        if (!this.socketAction) {
          copy.save(false);
          R.socket.emit("bounce", {
            itemClass: this.name,
            "function": "create",
            "arguments": [duplicateData]
          });
        }
        return copy;
      };

      function Item(data1, pk) {
        var ref;
        this.data = data1;
        this.pk = pk;
        if (this.pk != null) {
          this.setPK(this.pk, true);
          R.commandManager.loadItem(this);
        } else {
          this.id = ((ref = this.data) != null ? ref.id : void 0) != null ? this.data.id : Math.random();
          R.items[this.id] = this;
        }
        if (this.data != null) {
          this.secureData();
        } else {
          this.data = new Object();
          R.controllerManager.updateItemData(this);
        }
        if (this.rectangle == null) {
          this.rectangle = null;
        }
        this.selectionState = null;
        this.group = new P.Group();
        this.group.name = "group";
        this.group.controller = this;
        return;
      }

      Item.prototype.secureData = function() {
        var name, parameter, ref, value;
        ref = this.constructor.parameters;
        for (name in ref) {
          parameter = ref[name];
          if (parameter.secure != null) {
            this.data[name] = parameter.secure(this.data, parameter);
          } else {
            value = this.data[name];
            if ((value != null) && (parameter.min != null) && (parameter.max != null)) {
              if (value < parameter.min || value > parameter.max) {
                this.data[name] = Utils.clamp(parameter.min, value, parameter.max);
              }
            }
          }
        }
      };

      Item.prototype.setParameter = function(name, value, update) {
        if (this.data[name] === 'undefined') {
          return;
        }
        this.data[name] = value;
        this.changed = name;
        if (!this.socketAction) {
          if (update) {
            this.update(name);
          }
          R.socket.emit("bounce", {
            itemPk: this.pk,
            "function": "setParameter",
            "arguments": [name, value, false, false]
          });
        }
      };

      Item.prototype.prepareHitTest = function() {};

      Item.prototype.finishHitTest = function() {};

      Item.prototype.performHitTest = function(point) {
        if (this.rectangle.contains(point)) {
          return true;
        } else {
          return null;
        }
      };

      Item.prototype.hitTest = function(event) {
        var hitResult;
        hitResult = this.performHitTest(event.point);
        if ((hitResult != null) && !this.selected) {
          R.tools.select.deselectAll();
          R.commandManager.add(new Command.Select([this]), true);
        }
        return hitResult;
      };

      Item.prototype.setRectangle = function(rectangle, update) {
        if (!P.Rectangle.prototype.isPrototypeOf(rectangle)) {
          rectangle = new P.Rectangle(rectangle);
        }
        this.rectangle = rectangle;
        if (!this.socketAction) {
          if (update) {
            this.update('rectangle');
          }
          R.socket.emit("bounce", {
            itemPk: this.pk,
            "function": "setRectangle",
            "arguments": [rectangle, false]
          });
        }
      };

      Item.prototype.validatePosition = function() {
        return Item.Lock.validatePosition(this);
      };

      Item.prototype.moveTo = function(position, update) {
        var delta;
        if (!P.Point.prototype.isPrototypeOf(position)) {
          position = new P.Point(position);
        }
        delta = position.subtract(this.rectangle.center);
        this.rectangle.center = position;
        this.group.translate(delta);
        if (!this.socketAction) {
          if (update) {
            this.update('position');
          }
          R.socket.emit("bounce", {
            itemPk: this.pk,
            "function": "moveTo",
            "arguments": [position, false]
          });
        }
      };

      Item.prototype.translate = function(delta, update) {
        this.moveTo(this.rectangle.center.add(delta), update);
      };

      Item.prototype.scale = function(scale, center, update) {
        this.setRectangle(this.rectangle.scaleFromCenter(scale, center), update);
      };

      Item.prototype.getData = function() {
        var data;
        data = jQuery.extend({}, this.data);
        data.rectangle = this.rectangle.toJSON();
        data.rotation = this.rotation;
        return data;
      };

      Item.prototype.getStringifiedData = function() {
        return JSON.stringify(this.getData());
      };

      Item.prototype.getBounds = function() {
        return this.rectangle;
      };

      Item.prototype.getDrawingBounds = function() {
        return this.rectangle.expand(this.data.strokeWidth);
      };

      Item.prototype.highlight = function() {
        if (this.highlightRectangle != null) {
          Utils.Rectangle.updatePathRectangle(this.highlightRectangle, this.getBounds());
          return;
        }
        this.highlightRectangle = new P.Path.Rectangle(this.getBounds());
        this.highlightRectangle.strokeColor = R.selectionBlue;
        this.highlightRectangle.strokeScaling = false;
        this.highlightRectangle.dashArray = [4, 10];
        R.view.selectionLayer.addChild(this.highlightRectangle);
      };

      Item.prototype.unhighlight = function() {
        if (this.highlightRectangle == null) {
          return;
        }
        this.highlightRectangle.remove();
        this.highlightRectangle = null;
      };

      Item.prototype.getPk = function() {
        return this.pk || this.id;
      };

      Item.prototype.setPK = function(pk, loading) {
        this.pk = pk;
        if (loading == null) {
          loading = false;
        }
        if (this.id != null) {
          R.commandManager.setItemPk(this.id, this.pk);
        }
        R.items[this.pk] = this;
        delete R.items[this.id];
        if (!loading && !this.socketAction) {
          R.socket.emit("bounce", {
            itemPk: this.id,
            "function": "setPK",
            "arguments": [this.pk]
          });
        }
      };

      Item.prototype.isSelected = function() {
        return this.selectionRectangle != null;
      };

      Item.prototype.select = function() {
        var ref;
        if (this.selected) {
          return false;
        }
        this.selected = true;
        if ((ref = this.lock) != null) {
          ref.deselect();
        }
        this.selectionState = {
          move: true
        };
        R.s = this;
        R.selectedItems.push(this);
        R.tools.select.updateSelectionRectangle();
        R.controllerManager.updateParametersForSelectedItems();
        R.rasterizer.selectItem(this);
        this.zindex = this.group.index;
        R.view.selectionLayer.addChild(this.group);
        return true;
      };

      Item.prototype.deselect = function() {
        if (!this.selected) {
          return false;
        }
        this.selected = false;
        Utils.Array.remove(R.selectedItems, this);
        R.tools.select.updateSelectionRectangle();
        R.controllerManager.updateParametersForSelectedItems();
        if (this.group != null) {
          R.rasterizer.deselectItem(this);
          if (!this.lock) {
            this.group = R.view.mainLayer.insertChild(this.zindex, this.group);
          } else {
            this.group = this.lock.group.insertChild(this.zindex, this.group);
          }
        }
        return true;
      };

      Item.prototype.remove = function() {
        var ref;
        R.commandManager.unloadItem(this);
        if (!this.group) {
          return;
        }
        this.group.remove();
        this.group = null;
        this.deselect();
        if ((ref = this.highlightRectangle) != null) {
          ref.remove();
        }
        if (this.pk != null) {
          delete R.items[this.pk];
        } else {
          delete R.items[this.id];
        }
      };

      Item.prototype.finish = function() {
        if (this.rectangle.area === 0) {
          this.remove();
          return false;
        }
        return true;
      };

      Item.prototype.save = function(addCreateCommand) {
        if (addCreateCommand) {
          R.commandManager.add(new Command.CreateItem(this));
        }
      };

      Item.prototype.saveCallback = function() {};

      Item.prototype.addUpdateFunctionAndArguments = function(args, type) {
        args.push({
          "function": this.getUpdateFunction(type),
          "arguments": this.getUpdateArguments(type)
        });
      };

      Item.prototype.deleteFromDatabase = function() {};

      Item.prototype["delete"] = function() {
        this.remove();
        if (this.pk == null) {
          return;
        }
        if (!this.socketAction) {
          this.deleteFromDatabase();
          R.socket.emit("bounce", {
            itemPk: this.pk,
            "function": "delete",
            "arguments": []
          });
        }
        this.pk = null;
      };

      Item.prototype.deleteCommand = function() {
        R.commandManager.add(new Command.DeleteItem(this), true);
      };

      Item.prototype.getDuplicateData = function() {
        return {
          data: this.getData(),
          rectangle: this.rectangle,
          pk: this.getPk()
        };
      };

      Item.prototype.duplicateCommand = function() {
        R.commandManager.add(new Command.DuplicateItem(this), true);
      };

      Item.prototype.removeDrawing = function() {
        var ref;
        if (((ref = this.drawing) != null ? ref.parent : void 0) == null) {
          return;
        }
        this.drawingRelativePosition = this.drawing.position.subtract(this.rectangle.center);
        this.drawing.remove();
      };

      Item.prototype.replaceDrawing = function() {
        var ref;
        if ((this.drawing == null) || (this.drawingRelativePosition == null)) {
          return;
        }
        if ((ref = this.raster) != null) {
          ref.remove();
        }
        this.group.addChild(this.drawing);
        this.drawing.position = this.rectangle.center.add(this.drawingRelativePosition);
        this.drawingRelativePosition = null;
      };

      Item.prototype.rasterize = function() {
        if ((this.raster != null) || (this.drawing == null)) {
          return;
        }
        if (!R.rasterizer.rasterizeItems) {
          return;
        }
        if (this.drawing.bounds.area === 0) {
          return;
        }
        this.raster = this.drawing.rasterize();
        this.group.addChild(this.raster);
        this.raster.sendToBack();
        this.removeDrawing();
      };

      return Item;

    })();
    ItemTool.Item = Item;
    return Item;
  });

}).call(this);
