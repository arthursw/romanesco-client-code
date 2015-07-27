var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['View/Grid', 'Commands/Command', 'Items/Divs/Div', 'mousewheel', 'tween'], function(Grid, Command, Div) {
  var View;
  View = (function() {
    function View() {
      this.mousewheel = __bind(this.mousewheel, this);
      this.mouseup = __bind(this.mouseup, this);
      this.mousemove = __bind(this.mousemove, this);
      this.mousedown = __bind(this.mousedown, this);
      this.onWindowResize = __bind(this.onWindowResize, this);
      this.onFrame = __bind(this.onFrame, this);
      this.onKeyUp = __bind(this.onKeyUp, this);
      this.onKeyDown = __bind(this.onKeyDown, this);
      this.onMouseUp = __bind(this.onMouseUp, this);
      this.onMouseDrag = __bind(this.onMouseDrag, this);
      this.onMouseDown = __bind(this.onMouseDown, this);
      this.onHashChange = __bind(this.onHashChange, this);
      this.updateHash = __bind(this.updateHash, this);
      this.addMoveCommand = __bind(this.addMoveCommand, this);
      R.stageJ = $("#stage");
      R.canvasJ = R.stageJ.find("#canvas");
      R.canvas = R.canvasJ[0];
      R.canvas.width = window.innerWidth;
      R.canvas.height = window.innerHeight;
      R.context = R.canvas.getContext('2d');
      paper.setup(R.canvas);
      R.project = P.project;
      this.mainLayer = P.project.activeLayer;
      this.mainLayer.name = 'main layer';
      this.debugLayer = new P.Layer();
      this.debugLayer.name = 'debug layer';
      this.carLayer = new P.Layer();
      this.carLayer.name = 'car layer';
      this.lockLayer = new P.Layer();
      this.lockLayer.name = 'lock layer';
      this.selectionLayer = new P.Layer();
      this.selectionLayer.name = 'selection layer';
      this.areasToUpdateLayer = new P.Layer();
      this.areasToUpdateLayer.name = 'areasToUpdateLayer';
      this.backgroundRectangle = null;
      this.areasToUpdateLayer.visible = false;
      this.mainLayer.activate();
      paper.settings.hitTolerance = 5;
      R.scale = 1000.0;
      P.view.zoom = 1;
      this.previousPosition = P.view.center;
      this.restrictedArea = null;
      this.entireArea = null;
      this.entireAreas = [];
      this.grid = new Grid();
      R.canvasJ.dblclick(function(event) {
        var _ref;
        return (_ref = R.selectedTool) != null ? typeof _ref.doubleClick === "function" ? _ref.doubleClick(event) : void 0 : void 0;
      });
      R.canvasJ.keydown(function(event) {
        if (event.key === 46) {
          event.preventDefault();
          return false;
        }
      });
      this.tool = new P.Tool();
      this.tool.onMouseDown = this.onMouseDown;
      this.tool.onMouseDrag = this.onMouseDrag;
      this.tool.onMouseUp = this.onMouseUp;
      this.tool.onKeyDown = this.onKeyDown;
      this.tool.onKeyUp = this.onKeyUp;
      P.view.onFrame = this.onFrame;
      R.stageJ.mousewheel(this.mousewheel);
      R.stageJ.mousedown(this.mousedown);
      $(window).mousemove(this.mousemove);
      $(window).mouseup(this.mouseup);
      $(window).resize(this.onWindowResize);
      window.onhashchange = this.onHashChange;
      this.mousePosition = new P.Point();
      this.previousMousePosition = null;
      this.initialMousePosition = null;
      return;
    }

    View.prototype.moveTo = function(pos, delay, addCommand) {
      var initialPosition, somethingToLoad, tween;
      if (addCommand == null) {
        addCommand = true;
      }
      if (pos == null) {
        pos = new P.Point();
      }
      if (delay == null) {
        somethingToLoad = this.moveBy(pos.subtract(P.view.center), addCommand);
      } else {
        initialPosition = P.view.center;
        tween = new TWEEN.Tween(initialPosition).to(pos, delay).easing(TWEEN.Easing.Exponential.InOut).onUpdate(function() {
          return this.moveTo(this, addCommand);
        }).start();
      }
      return somethingToLoad;
    };

    View.prototype.moveBy = function(delta, addCommand) {
      var area, div, newEntireArea, newView, restrictedAreaShrinked, somethingToLoad, _i, _j, _len, _len1, _ref, _ref1;
      if (addCommand == null) {
        addCommand = true;
      }
      if (this.restrictedArea != null) {
        if (!this.restrictedArea.contains(P.view.center)) {
          delta = this.restrictedArea.center.subtract(P.view.center);
        } else {
          newView = P.view.bounds.clone();
          newView.center.x += delta.x;
          newView.center.y += delta.y;
          if (!this.restrictedArea.contains(newView)) {
            restrictedAreaShrinked = this.restrictedArea.expand(P.view.size.multiply(-1));
            if (restrictedAreaShrinked.width < 0) {
              restrictedAreaShrinked.left = restrictedAreaShrinked.right = this.restrictedArea.center.x;
            }
            if (restrictedAreaShrinked.height < 0) {
              restrictedAreaShrinked.top = restrictedAreaShrinked.bottom = this.restrictedArea.center.y;
            }
            newView.center.x = Utils.clamp(restrictedAreaShrinked.left, newView.center.x, restrictedAreaShrinked.right);
            newView.center.y = Utils.clamp(restrictedAreaShrinked.top, newView.center.y, restrictedAreaShrinked.bottom);
            delta = newView.center.subtract(P.view.center);
          }
        }
      }
      if (this.previousPosition == null) {
        this.previousPosition = P.view.center;
      }
      P.view.scrollBy(new P.Point(delta.x, delta.y));
      _ref = R.divs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        div = _ref[_i];
        div.updateTransform();
      }
      R.rasterizer.move();
      this.grid.update();
      newEntireArea = null;
      _ref1 = this.entireAreas;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        area = _ref1[_j];
        if (area.getBounds().contains(P.view.center)) {
          newEntireArea = area;
          break;
        }
      }
      if ((this.entireArea == null) && (newEntireArea != null)) {
        this.entireArea = newEntireArea.getBounds();
      } else if ((this.entireArea != null) && (newEntireArea == null)) {
        this.entireArea = null;
      }
      somethingToLoad = newEntireArea != null ? R.loader.load(this.entireArea) : R.loader.load();
      R.socket.updateRoom();
      Utils.deferredExecution(this.updateHash, 'updateHash', 500);
      if (addCommand) {
        Utils.deferredExecution(this.addMoveCommand, 'add move command');
      }
      R.controllerManager.folders['General'].controllers['location'].setValue('' + P.view.center.x.toFixed(2) + ',' + P.view.center.y.toFixed(2));
      return somethingToLoad;
    };

    View.prototype.addMoveCommand = function() {
      R.commandManager.add(new Command.MoveView(this.previousPosition, P.view.center));
      this.previousPosition = null;
    };

    View.prototype.updateHash = function() {
      var hashParameters;
      this.ignoreHashChange = true;
      hashParameters = {};
      if (R.repository.commit != null) {
        hashParameters['repository-owner'] = R.repository.owner;
        hashParameters['repository-commit'] = R.repository.commit;
      }
      if ((R.city.owner != null) && (R.city.name != null) && R.city.owner !== 'RomanescoOrg' && R.city.name !== 'Romanesco') {
        hashParameters['city-owner'] = R.city.owner;
        hashParameters['city-name'] = R.city.name;
      }
      hashParameters['location'] = P.view.center.x.toFixed(2) + ',' + P.view.center.y.toFixed(2);
      location.hash = Utils.URL.setParameters(hashParameters);
    };

    View.prototype.onHashChange = function(event) {
      var p, parameters, pos;
      if (this.ignoreHashChange) {
        this.ignoreHashChange = false;
        return;
      }
      parameters = Utils.URL.getParameters(document.location.hash);
      if ((R.repository.commit != null) && (R.repository.owner !== parameters['repository-owner'] || R.repository.commit !== parameters['repository-commit'])) {
        location.reload();
        return;
      }
      if (parameters['location'] != null) {
        pos = parameters['location'].split(',');
        p = new P.Point(pos[0], pos[1]);
        if (!_.isFinite(p.x)) {
          p.x = 0;
        }
        if (!_.isFinite(p.y)) {
          p.y = 0;
        }
      }
      if (R.city.name !== parameters['city-name'] || R.city.owner !== parameters['city-owner']) {
        R.city.loadCity(parameters['city-name'], parameters['city-owner'], p);
        return;
      }
      this.moveTo(p);
    };

    View.prototype.initializePosition = function() {
      var box, boxRectangle, boxString, br, controller, folder, folderName, loadEntireArea, planet, pos, site, siteString, tl, _i, _len, _ref, _ref1;
      if (R.rasterizerMode) {
        return;
      }
      R.city = {
        owner: R.canvasJ.attr("data-owner") !== '' ? R.canvasJ.attr("data-owner") : void 0,
        city: R.canvasJ.attr("data-city") !== '' ? R.canvasJ.attr("data-city") : void 0,
        site: R.canvasJ.attr("data-site") !== '' ? R.canvasJ.attr("data-site") : void 0
      };
      boxString = R.canvasJ.attr("data-box");
      if (!boxString || boxString.length === 0) {
        window.onhashchange();
        return;
      }
      box = JSON.parse(boxString);
      planet = new P.Point(box.planetX, box.planetY);
      tl = Utils.CS.posOnPlanetToProject(box.box.coordinates[0][0], planet);
      br = Utils.CS.posOnPlanetToProject(box.box.coordinates[0][2], planet);
      boxRectangle = new P.Rectangle(tl, br);
      pos = boxRectangle.center;
      this.moveTo(pos);
      loadEntireArea = R.canvasJ.attr("data-load-entire-area");
      if (loadEntireArea) {
        this.entireArea = boxRectangle;
        R.loader.load(boxRectangle);
      }
      siteString = R.canvasJ.attr("data-site");
      site = JSON.parse(siteString);
      if (site.restrictedArea) {
        this.restrictedArea = boxRectangle;
      }
      R.tools.select.select();
      if (site.disableToolbar) {
        R.sidebar.hide();
      } else {
        R.sidebar.sidebarJ.find("div.panel.panel-default:not(:last)").hide();
        _ref = R.gui.__folders;
        for (folderName in _ref) {
          folder = _ref[folderName];
          _ref1 = folder.__controllers;
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            controller = _ref1[_i];
            if (controller.name !== 'Zoom') {
              folder.remove(controller);
              folder.__controllers.remove(controller);
            }
          }
          if (folder.__controllers.length === 0) {
            R.gui.removeFolder(folderName);
          }
        }
        R.sidebar.handleJ.click();
      }
    };

    View.prototype.focusIsOnCanvas = function() {
      return $(document.activeElement).is("body");
    };

    View.prototype.onMouseDown = function(event) {
      var _ref, _ref1;
      if ((_ref = R.wacomPenAPI) != null ? _ref.isEraser : void 0) {
        this.tool.onKeyUp({
          key: 'delete'
        });
        return;
      }
      $(document.activeElement).blur();
      if ((_ref1 = R.selectedTool) != null) {
        _ref1.begin(event);
      }
    };

    View.prototype.onMouseDrag = function(event) {
      var _ref, _ref1;
      if ((_ref = R.wacomPenAPI) != null ? _ref.isEraser : void 0) {
        return;
      }
      if (R.currentDiv != null) {
        return;
      }
      if ((_ref1 = R.selectedTool) != null) {
        _ref1.update(event);
      }
    };

    View.prototype.onMouseUp = function(event) {
      var _ref, _ref1;
      if ((_ref = R.wacomPenAPI) != null ? _ref.isEraser : void 0) {
        return;
      }
      if (R.currentDiv != null) {
        return;
      }
      if ((_ref1 = R.selectedTool) != null) {
        _ref1.end(event);
      }
    };

    View.prototype.onKeyDown = function(event) {
      var _ref;
      if (!this.focusIsOnCanvas()) {
        return;
      }
      if (event.key === 'delete') {
        event.preventDefault();
        return false;
      }
      if (event.key === 'space' && ((_ref = R.selectedTool) != null ? _ref.name : void 0) !== 'Move') {
        R.tools.move.select();
      }
    };

    View.prototype.onKeyUp = function(event) {
      var _ref, _ref1;
      if (!this.focusIsOnCanvas()) {
        return;
      }
      if ((_ref = R.selectedTool) != null) {
        _ref.keyUp(event);
      }
      switch (event.key) {
        case 'space':
          if ((_ref1 = R.previousTool) != null) {
            _ref1.select();
          }
          break;
        case 'v':
          R.tools.select.select();
          break;
        case 't':
          R.showToolBox();
          break;
        case 'r':
          if (event.modifiers.shift) {
            R.rasterizer.rasterizeImmediately();
          }
      }
      event.preventDefault();
    };

    View.prototype.onFrame = function(event) {
      var item, _base, _i, _len, _ref, _ref1;
      TWEEN.update(event.time);
      if (typeof (_base = R.rasterizer).updateLoadingBar === "function") {
        _base.updateLoadingBar(event.time);
      }
      if ((_ref = R.selectedTool) != null) {
        if (typeof _ref.onFrame === "function") {
          _ref.onFrame(event);
        }
      }
      _ref1 = R.animatedItems;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        item = _ref1[_i];
        item.onFrame(event);
      }
    };

    View.prototype.onWindowResize = function(event) {
      this.grid.update();
      $(".mCustomScrollbar").mCustomScrollbar("update");
      P.view.update();
      R.canvasJ.width(window.innerWidth);
      R.canvasJ.height(window.innerHeight);
      P.view.viewSize = new P.Size(window.innerWidth, window.innerHeight);
    };

    View.prototype.mousedown = function(event) {
      var _ref, _ref1, _ref2;
      switch (event.which) {
        case 2:
          R.tools.move.select();
          break;
        case 3:
          if ((_ref = R.selectedTool) != null) {
            if (typeof _ref.finish === "function") {
              _ref.finish();
            }
          }
      }
      if (((_ref1 = R.selectedTool) != null ? _ref1.name : void 0) === 'Move') {
        if ((_ref2 = R.selectedTool) != null) {
          _ref2.beginNative(event);
        }
        return;
      }
      this.initialMousePosition = Utils.Event.jEventToPoint(event);
      this.previousMousePosition = this.initialMousePosition.clone();
    };

    View.prototype.mousemove = function(event) {
      var paperEvent, _base, _ref, _ref1;
      this.mousePosition.x = event.pageX;
      this.mousePosition.y = event.pageY;
      if (((_ref = R.selectedTool) != null ? _ref.name : void 0) === 'Move' && R.selectedTool.dragging) {
        R.selectedTool.updateNative(event);
        return;
      }
      Div.updateHiddenDivs(event);
      if ((_ref1 = R.codeEditor) != null) {
        _ref1.onMouseMove(event);
      }
      if (R.currentDiv != null) {
        paperEvent = Utils.Event.jEventToPaperEvent(event, this.previousMousePosition, this.initialMousePosition, 'mousemove');
        if (typeof (_base = R.currentDiv).updateSelect === "function") {
          _base.updateSelect(paperEvent);
        }
        this.previousMousePosition = paperEvent.point;
      }
    };

    View.prototype.mouseup = function(event) {
      var paperEvent, _base, _ref, _ref1, _ref2;
      if (R.stageJ.hasClass("has-tool-box") && !$(event.target).parents('.tool-box').length > 0) {
        R.hideToolBox();
      }
      if ((_ref = R.codeEditor) != null) {
        _ref.onMouseUp(event);
      }
      if (((_ref1 = R.selectedTool) != null ? _ref1.name : void 0) === 'Move') {
        R.selectedTool.endNative(event);
        if (event.which === 2) {
          if ((_ref2 = R.previousTool) != null) {
            _ref2.select();
          }
        }
        return;
      }
      if (R.currentDiv != null) {
        paperEvent = Utils.Event.jEventToPaperEvent(event, this.previousMousePosition, this.initialMousePosition, 'mouseup');
        if (typeof (_base = R.currentDiv).endSelect === "function") {
          _base.endSelect(paperEvent);
        }
        this.previousMousePosition = paperEvent.point;
      }
    };

    View.prototype.mousewheel = function(event) {
      this.moveBy(new P.Point(-event.deltaX, event.deltaY));
    };

    return View;

  })();
  return View;
});
