// Generated by CoffeeScript 1.12.7
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['Items/Item', 'Items/Content'], function(Item, Content) {
    var Div;
    Div = (function(superClass) {
      extend(Div, superClass);

      Div.zIndexMin = 1;

      Div.zIndexMax = 100000;

      Div.hiddenDivs = [];

      Div.initializeParameters = function() {
        var parameters, strokeColor, strokeWidth;
        parameters = Div.__super__.constructor.initializeParameters.call(this);
        strokeWidth = $.extend(true, {}, R.parameters.strokeWidth);
        strokeWidth["default"] = 1;
        strokeColor = $.extend(true, {}, R.parameters.strokeColor);
        strokeColor["default"] = 'black';
        parameters['Style'].strokeWidth = strokeWidth;
        parameters['Style'].strokeColor = strokeColor;
        return parameters;
      };

      Div.parameters = Div.initializeParameters();

      Div.updateHiddenDivs = function(event) {
        var div, hiddenDivs, j, len, point, projectPoint;
        if (this.hiddenDivs.length > 0) {
          point = new P.Point(event.pageX, event.pageY);
          projectPoint = P.view.viewToProject(point);
          hiddenDivs = this.hiddenDivs.slice();
          for (j = 0, len = hiddenDivs.length; j < len; j++) {
            div = hiddenDivs[j];
            if (!div.getBounds().contains(projectPoint)) {
              div.show();
            }
          }
        }
      };

      Div.showDivs = function() {
        while (this.hiddenDivs.length > 0) {
          this.hiddenDivs[0].show();
        }
      };

      Div.updateZindex = function(sortedDivs) {
        var div, i, j, len;
        for (i = j = 0, len = sortedDivs.length; j < len; i = ++j) {
          div = sortedDivs[i];
          div.divJ.css({
            'z-index': i + this.zIndexMin
          });
        }
      };

      Div.create = function(duplicateData) {
        var copy;
        if (duplicateData == null) {
          duplicateData = this.getDuplicateData();
        }
        copy = new this(duplicateData.bounds, duplicateData.data, null, null, R.items[duplicateData.lock]);
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

      function Div(bounds, data, pk, date, lock) {
        var ref, separatorJ;
        this.data = data != null ? data : null;
        this.pk = pk != null ? pk : null;
        this.date = date;
        this.lock = lock != null ? lock : null;
        this.deselect = bind(this.deselect, this);
        this.select = bind(this.select, this);
        this.update = bind(this.update, this);
        this.endSelect = bind(this.endSelect, this);
        this.beginSelect = bind(this.beginSelect, this);
        this.saveCallback = bind(this.saveCallback, this);
        this.onClick = bind(this.onClick, this);
        this.onMouseEnter = bind(this.onMouseEnter, this);
        this.rectangle = ((ref = this.data) != null ? ref.rectangle : void 0) != null ? new P.Rectangle(this.data.rectangle) : bounds;
        this.controller = this;
        this.object_type = this.constructor.object_type;
        separatorJ = R.stageJ.find("." + this.object_type + "-separator");
        this.divJ = R.templatesJ.find(".custom-div").clone().insertAfter(separatorJ);
        this.divJ.mouseenter(this.onMouseEnter);
        if (!this.lock) {
          Div.__super__.constructor.call(this, this.data, this.pk, this.date, R.sidebar.divListJ, R.sortedDivs);
        } else {
          Div.__super__.constructor.call(this, this.data, this.pk, this.date, this.lock.itemListsJ.find('.rDiv-list'), this.lock.sortedDivs);
        }
        this.maskJ = this.divJ.find(".mask");
        this.divJ.css({
          width: this.rectangle.width,
          height: this.rectangle.height
        });
        this.updateTransform(false);
        if (this.owner !== R.me && (this.lock != null)) {
          this.divJ.addClass("locked");
        }
        this.divJ.attr("data-pk", this.pk);
        this.divJ.controller = this;
        this.setCss();
        R.divs.push(this);
        if (R.selectedTool.name === 'Move') {
          this.disableInteraction();
        }
        this.divJ.click(this.onClick);
        if (!bounds.contains(this.rectangle.expand(-1))) {
          console.log("Error: invalid div");
          this.remove();
        }
        return;
      }

      Div.prototype.onMouseEnter = function(event) {
        var item, j, len, ref;
        ref = R.selectedItems;
        for (j = 0, len = ref.length; j < len; j++) {
          item = ref[j];
          if (item !== this && item.getBounds().intersects(this.getBounds())) {
            this.hide();
            break;
          }
        }
      };

      Div.prototype.onClick = function(event) {
        if (this.selected != null) {
          return;
        }
        if (!event.shiftKey) {
          R.tools.select.deselectAll();
        }
        this.select();
      };

      Div.prototype.hide = function() {
        this.divJ.css({
          opacity: 0.5,
          'pointer-events': 'none'
        });
        this.constructor.hiddenDivs.push(this);
      };

      Div.prototype.show = function() {
        this.divJ.css({
          opacity: 1,
          'pointer-events': 'auto'
        });
        Utils.Array.remove(this.constructor.hiddenDivs, this);
      };

      Div.prototype.save = function(addCreateCommand) {
        var args;
        if (addCreateCommand == null) {
          addCreateCommand = true;
        }
        if (R.view.grid.rectangleOverlapsTwoPlanets(this.rectangle)) {
          return;
        }
        if (this.rectangle.area === 0) {
          this.remove();
          R.alertManager.alert("Error: your div is not valid.", "error");
          return;
        }
        args = {
          city: R.city,
          box: Utils.CS.boxFromRectangle(this.getBounds()),
          object_type: this.object_type,
          date: Date.now(),
          data: this.getStringifiedData()
        };
        $.ajax({
          method: "POST",
          url: "ajaxCall/",
          data: {
            data: JSON.stringify({
              "function": 'saveDiv',
              args: args
            })
          }
        }).done(this.saveCallback);
        Div.__super__.save.apply(this, arguments);
      };

      Div.prototype.saveCallback = function(result) {
        R.loader.checkError(result);
        if (result.pk == null) {
          this.remove();
          return;
        }
        this.owner = result.owner;
        this.setPK(result.pk);
        if (this.updateAfterSave != null) {
          this.update(this.updateAfterSave);
        }
        Div.__super__.saveCallback.apply(this, arguments);
      };

      Div.prototype.moveTo = function(position, update) {
        Div.__super__.moveTo.call(this, position, update);
        this.updateTransform();
      };

      Div.prototype.setRectangle = function(rectangle, update) {
        if (update == null) {
          update = true;
        }
        Div.__super__.setRectangle.call(this, rectangle, update);
        this.updateTransform();
      };

      Div.prototype.setRotation = function(rotation, center, update) {
        if (update == null) {
          update = true;
        }
        Div.__super__.setRotation.call(this, rotation, center, update);
        this.updateTransform();
      };

      Div.prototype.updateTransform = function() {
        var css, sizeScaled, translation, viewPos;
        viewPos = P.view.projectToView(this.rectangle.topLeft);
        if (P.view.zoom === 1 && (this.rotation === 0 || (this.rotation == null))) {
          this.divJ.css({
            'left': viewPos.x,
            'top': viewPos.y,
            'transform': 'none'
          });
        } else {
          sizeScaled = this.rectangle.size.multiply(P.view.zoom);
          translation = viewPos.add(sizeScaled.divide(2));
          css = 'translate(' + translation.x + 'px,' + translation.y + 'px)';
          css += 'translate(-50%, -50%)';
          css += ' scale(' + P.view.zoom + ')';
          if (this.rotation) {
            css += ' rotate(' + this.rotation + 'deg)';
          }
          this.divJ.css({
            'transform': css,
            'top': 0,
            'left': 0,
            'transform-origin': '50% 50%'
          });
        }
        this.divJ.css({
          width: this.rectangle.width,
          height: this.rectangle.height
        });
      };

      Div.prototype.setZindex = function() {
        this.constructor.updateZindex(this.sortedItems);
      };

      Div.prototype.beginSelect = function(event) {
        Div.__super__.beginSelect.call(this, event);
        if (this.selectionState != null) {
          R.currentDiv = this;
        }
      };

      Div.prototype.endSelect = function(event) {
        Div.__super__.endSelect.call(this, event);
        R.currentDiv = null;
      };

      Div.prototype.disableInteraction = function() {
        this.maskJ.show();
      };

      Div.prototype.enableInteraction = function() {
        this.maskJ.hide();
      };

      Div.prototype.setParameter = function(name, value) {
        Div.__super__.setParameter.call(this, name, value);
        switch (name) {
          case 'strokeWidth':
          case 'strokeColor':
          case 'fillColor':
            this.setCss();
        }
      };

      Div.prototype.getUpdateFunction = function() {
        return 'updateDiv';
      };

      Div.prototype.getUpdateArguments = function(type) {
        var args;
        switch (type) {
          case 'z-index':
            args = {
              pk: this.pk,
              date: this.date
            };
            break;
          default:
            args = {
              pk: this.pk,
              box: Utils.CS.boxFromRectangle(this.getBounds()),
              data: this.getStringifiedData()
            };
        }
        return args;
      };

      Div.prototype.update = function(type) {
        var bounds;
        if (this.pk == null) {
          this.updateAfterSave = type;
          return;
        }
        delete this.updateAfterSave;
        bounds = this.getBounds();
        if (R.view.grid.rectangleOverlapsTwoPlanets(bounds)) {
          return;
        }
        $.ajax({
          method: "POST",
          url: "ajaxCall/",
          data: {
            data: JSON.stringify({
              "function": 'updateDiv',
              args: this.getUpdateArguments(type)
            })
          }
        }).done(this.updateCallback);
      };

      Div.prototype.updateCallback = function(result) {
        R.loader.checkError(result);
      };

      Div.prototype.select = function(updateOptions, updateSelectionRectangle) {
        if (updateSelectionRectangle == null) {
          updateSelectionRectangle = true;
        }
        if (!Div.__super__.select.call(this, updateOptions, updateSelectionRectangle) || this.divJ.hasClass("selected")) {
          return false;
        }
        if (R.selectedTool !== R.tools.select) {
          R.tools.select.select();
        }
        this.divJ.addClass("selected");
        return true;
      };

      Div.prototype.deselect = function() {
        var ref;
        if (!Div.__super__.deselect.call(this)) {
          return false;
        }
        if (!this.divJ.hasClass("selected")) {
          return;
        }
        if ((ref = this.divJ) != null) {
          ref.removeClass("selected");
        }
        return true;
      };

      Div.prototype.setCss = function() {
        this.setFillColor();
        this.setStrokeColor();
        this.setStrokeWidth();
      };

      Div.prototype.setFillColor = function() {
        var ref, ref1;
        if ((ref = this.contentJ) != null) {
          ref.css({
            'background-color': (ref1 = this.data.fillColor) != null ? ref1 : 'transparent'
          });
        }
      };

      Div.prototype.setStrokeColor = function() {
        var ref, ref1;
        if ((ref = this.contentJ) != null) {
          ref.css({
            'border-color': (ref1 = this.data.strokeColor) != null ? ref1 : 'transparent'
          });
        }
      };

      Div.prototype.setStrokeWidth = function() {
        var ref, ref1;
        if ((ref = this.contentJ) != null) {
          ref.css({
            'border-width': (ref1 = this.data.strokeWidth) != null ? ref1 : '0'
          });
        }
      };

      Div.prototype.remove = function() {
        this.deselect();
        this.divJ.remove();
        Utils.Array.remove(R.divs, this);
        if (this.data.loadEntireArea) {
          Utils.Array.remove(R.view.entireAreas, this);
        }
        if (R.divToUpdate === this) {
          delete R.divToUpdate;
        }
        Div.__super__.remove.call(this);
      };

      Div.prototype.deleteFromDatabase = function() {
        $.ajax({
          method: "POST",
          url: "ajaxCall/",
          data: {
            data: JSON.stringify({
              "function": 'deleteDiv',
              args: {
                'pk': this.pk
              }
            })
          }
        }).done(R.loader.checkError);
      };

      return Div;

    })(Content);
    Item.Div = Div;
    return Div;
  });

}).call(this);
