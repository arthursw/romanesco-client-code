var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty;

define(['Commands/Command', 'Items/Item', 'UI/ModuleLoader', 'spin', 'Items/Lock', 'Items/Divs/Div', 'Items/Divs/Media', 'Items/Divs/Text'], function(Command, Item, ModuleLoader, Spinner) {
  var Loader;
  Loader = (function() {
    function Loader() {
      this.loadCallback = __bind(this.loadCallback, this);
      this.hideLoadingBar = __bind(this.hideLoadingBar, this);
      this.showLoadingBar = __bind(this.showLoadingBar, this);
      this.loadedAreas = [];
      this.debug = false;
      this.pathsToCreate = {};
      this.initializeLoadingBar();
      this.showLoadingBar();
      return;
    }

    Loader.prototype.initializeLoadingBar = function() {
      var opts, target;
      opts = {
        lines: 13,
        length: 45,
        width: 41,
        radius: 0,
        scale: 0.25,
        corners: 1,
        color: '#000',
        opacity: 0.15,
        rotate: 0,
        direction: 1,
        speed: 1,
        trail: 42,
        fps: 20,
        zIndex: 2e9,
        className: 'spinner',
        top: '50%',
        left: '50%',
        shadow: false,
        hwaccel: false,
        position: 'absolute'
      };
      target = document.getElementById('loadingBar');
      this.spinner = new Spinner(opts).spin(target);
    };

    Loader.prototype.showDrawingBar = function() {
      $("#drawingBar").show();
    };

    Loader.prototype.hideDrawingBar = function() {
      $("#drawingBar").hide();
    };

    Loader.prototype.showLoadingBar = function() {
      $("#loadingBar").show();
      this.spinner.spin(document.getElementById('loadingBar'));
    };

    Loader.prototype.hideLoadingBar = function() {
      $("#loadingBar").hide();
      this.spinner.stop();
    };

    Loader.prototype.areaIsLoaded = function(pos, planet, qZoom) {
      var area, _i, _len, _ref;
      _ref = this.loadedAreas;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        area = _ref[_i];
        if (area.planet.x === planet.x && area.planet.y === planet.y) {
          if (area.pos.x === pos.x && area.pos.y === pos.y) {
            if ((qZoom == null) || area.zoom === qZoom) {
              return true;
            }
          }
        }
      }
      return false;
    };

    Loader.prototype.unload = function() {
      var item, pk, _ref;
      this.loadedAreas = [];
      _ref = R.items;
      for (pk in _ref) {
        if (!__hasProp.call(_ref, pk)) continue;
        item = _ref[pk];
        item.remove();
      }
      R.items = {};
      R.rasterizer.clearRasters();
      this.previousLoadPosition = null;
    };

    Loader.prototype.loadRequired = function() {
      if (!R.rasterizerMode && (this.previousLoadPosition != null)) {
        if (this.previousLoadPosition.position.subtract(P.view.center).length < 50) {
          if (Math.abs(1 - this.previousLoadPosition.zoom / P.view.zoom) < 0.2) {
            return false;
          }
        }
      }
      return true;
    };

    Loader.prototype.getLoadingBounds = function(area) {
      var halfSize;
      if (area == null) {
        if (P.view.bounds.width <= window.innerWidth && P.view.bounds.height <= window.innerHeight) {
          return P.view.bounds;
        } else {
          halfSize = new P.Point(window.innerWidth * 0.5, window.innerHeight * 0.5);
          return new P.Rectangle(P.view.center.subtract(halfSize), P.view.center.add(halfSize));
        }
      }
      return area;
    };

    Loader.prototype.unloadAreas = function(area, limit, qZoom) {
      var i, item, itemsOutsideLimit, j, pk, pos, rectangle, _ref;
      itemsOutsideLimit = [];
      _ref = R.items;
      for (pk in _ref) {
        if (!__hasProp.call(_ref, pk)) continue;
        item = _ref[pk];
        if (!item.getBounds().intersects(limit)) {
          itemsOutsideLimit.push(item);
        }
      }
      i = this.loadedAreas.length;
      while (i--) {
        area = this.loadedAreas[i];
        pos = Utils.CS.posOnPlanetToProject(area.pos, area.planet);
        rectangle = new P.Rectangle(pos.x, pos.y, R.scale * area.zoom, R.scale * area.zoom);
        if (!rectangle.intersects(limit) || area.zoom !== qZoom) {
          if (this.debug) {
            this.updateDebugArea(area);
          }
          this.loadedAreas.splice(i, 1);
          j = itemsOutsideLimit.length;
          while (j--) {
            item = itemsOutsideLimit[j];
            if (item.getBounds().intersects(rectangle)) {
              item.remove();
              itemsOutsideLimit.splice(j, 1);
            }
          }
        }
      }
    };

    Loader.prototype.getAreasToLoad = function(scale, qZoom, t, l, b, r) {
      var area, areasToLoad, planet, pos, x, y, _i, _j;
      areasToLoad = [];
      for (x = _i = l; scale > 0 ? _i <= r : _i >= r; x = _i += scale) {
        for (y = _j = t; scale > 0 ? _j <= b : _j >= b; y = _j += scale) {
          planet = Utils.CS.projectToPlanet(new P.Point(x, y));
          pos = Utils.CS.projectToPosOnPlanet(new P.Point(x, y));
          if (R.rasterizerMode) {
            area = {
              pos: pos,
              planet: planet
            };
            areasToLoad.push(area);
            if (this.debug) {
              this.createAreaDebugRectangle(x, y, scale);
            }
            if (!this.areaIsLoaded(pos, planet)) {
              this.loadedAreas.push(area);
            }
          } else {
            if (!this.areaIsLoaded(pos, planet, qZoom)) {
              area = {
                pos: pos,
                planet: planet
              };
              areasToLoad.push(area);
              area.zoom = qZoom;
              if (this.debug) {
                this.createAreaDebugRectangle(x, y, scale);
              }
              this.loadedAreas.push(area);
            }
          }
        }
      }
      return areasToLoad;
    };

    Loader.prototype.load = function(area) {
      var areasToLoad, b, bounds, itemsDates, l, limit, qZoom, r, rectangle, scale, t, unloadDist;
      if (area == null) {
        area = null;
      }
      if (!this.loadRequired()) {
        return false;
      }
      console.log("load");
      if (area != null) {
        console.log(area.toString());
      }
      this.previousLoadPosition = {
        position: P.view.center,
        zoom: P.view.zoom
      };
      bounds = this.getLoadingBounds(area);
      unloadDist = Math.round(R.scale / P.view.zoom);
      limit = R.view.entireArea || bounds.expand(unloadDist);
      R.rasterizer.unload(limit);
      qZoom = Utils.CS.quantizeZoom(1.0 / P.view.zoom);
      this.unloadAreas(area, limit, qZoom);
      scale = R.scale * qZoom;
      t = Utils.floorToMultiple(bounds.top, scale);
      l = Utils.floorToMultiple(bounds.left, scale);
      b = Utils.floorToMultiple(bounds.bottom, scale);
      r = Utils.floorToMultiple(bounds.right, scale);
      if (this.debug) {
        this.updateDebugPaths(limit, bounds, t, l, b, r);
      }
      areasToLoad = this.getAreasToLoad(scale, qZoom, t, l, b, r);
      if (!R.rasterizerMode && areasToLoad.length <= 0) {
        return false;
      }
      _.defer(this.showLoadingBar);
      if (!R.rasterizerMode) {
        rectangle = {
          left: l / 1000.0,
          top: t / 1000.0,
          right: r / 1000.0,
          bottom: b / 1000.0
        };
        Dajaxice.draw.load(this.loadCallback, {
          rectangle: rectangle,
          areasToLoad: areasToLoad,
          qZoom: qZoom,
          city: R.city
        });
      } else {
        itemsDates = R.createItemsDates(bounds);
        Dajaxice.draw.loadRasterizer(this.loadCallback, {
          areasToLoad: areasToLoad,
          itemsDates: itemsDates,
          cityPk: R.city
        });
      }
      return true;
    };

    Loader.prototype.dispatchLoadFinished = function() {
      var commandEvent;
      console.log("dispatch command executed");
      commandEvent = document.createEvent('Event');
      commandEvent.initEvent('command executed', true, true);
      document.dispatchEvent(commandEvent);
    };

    Loader.prototype.setMe = function(user) {
      if ((R.me == null) && (user != null)) {
        R.me = user;
        if ((R.chatJ != null) && R.chatJ.find("#chatUserNameInput").length === 0) {
          R.startChatting(R.me);
        }
      }
    };

    Loader.prototype.removeDeletedItems = function(deletedItems) {
      var deletedItemLastUpdate, pk, _ref;
      if (deletedItems == null) {
        return;
      }
      for (pk in deletedItems) {
        deletedItemLastUpdate = deletedItems[pk];
        if ((_ref = R.items[pk]) != null) {
          _ref.remove();
        }
      }
    };

    Loader.prototype.parseNewItems = function(items) {
      var i, item, itemToReplace, itemsToLoad, _i, _len;
      itemsToLoad = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        i = items[_i];
        item = JSON.parse(i);
        if (!R.rasterizerMode && (R.items[item._id.$oid] != null)) {
          continue;
        } else if (R.rasterizerMode) {
          itemToReplace = R.items[item._id.$oid];
          if (itemToReplace != null) {
            console.log("itemToReplace: " + itemToReplace.pk);
            itemToReplace.remove();
          }
        }
        if (item.rType === 'Box') {
          itemsToLoad.unshift(item);
        } else {
          itemsToLoad.push(item);
        }
      }
      return itemsToLoad;
    };

    Loader.prototype.moduleLoaded = function(args) {
      var _base;
      this.createPath(args);
      delete this.pathsToCreate[args.pk];
      if (Utils.isEmpty(this.pathsToCreate)) {
        this.hideLoadingBar();
        if (typeof (_base = R.rasterizer).checkRasterizeAreasToUpdate === "function") {
          _base.checkRasterizeAreasToUpdate(true);
        }
      }
    };

    Loader.prototype.loadModuleAndCreatePath = function(args) {
      this.pathsToCreate[args.pk] = true;
      ModuleLoader.load(args.path.object_type, (function(_this) {
        return function() {
          return _this.moduleLoaded(args);
        };
      })(this));
    };

    Loader.prototype.createPath = function(args) {
      var path, _ref;
      path = new R.tools[args.path.object_type].Path(args.date, args.data, args.pk, args.points, args.lock);
      path.lastUpdateDate = (_ref = args.path.lastUpdate) != null ? _ref.$date : void 0;
    };

    Loader.prototype.createNewItems = function(itemsToLoad) {
      var args, box, data, date, div, item, lock, path, pk, planet, point, points, rdiv, rpath, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
      for (_i = 0, _len = itemsToLoad.length; _i < _len; _i++) {
        item = itemsToLoad[_i];
        pk = item._id.$oid;
        date = (_ref = item.date) != null ? _ref.$date : void 0;
        data = (item.data != null) && item.data.length > 0 ? JSON.parse(item.data) : null;
        lock = item.lock != null ? R.items[item.lock] : null;
        switch (item.rType) {
          case 'Box':
            box = item;
            if (box.box.coordinates[0].length < 5) {
              console.log("Error: box has less than 5 points");
            }
            lock = null;
            switch (box.object_type) {
              case 'lock':
                lock = new Item.Lock(Utils.CS.rectangleFromBox(box), data, box._id.$oid, box.owner, date, (_ref1 = box.module) != null ? _ref1.$oid : void 0);
                break;
              case 'link':
                lock = new Item.Link(Utils.CS.rectangleFromBox(box), data, box._id.$oid, box.owner, date, (_ref2 = box.module) != null ? _ref2.$oid : void 0);
                break;
              case 'website':
                lock = new Item.Website(Utils.CS.rectangleFromBox(box), data, box._id.$oid, box.owner, date, (_ref3 = box.module) != null ? _ref3.$oid : void 0);
                break;
              case 'video-game':
                lock = new Item.VideoGame(Utils.CS.rectangleFromBox(box), data, box._id.$oid, box.owner, date, (_ref4 = box.module) != null ? _ref4.$oid : void 0);
            }
            lock.lastUpdateDate = box.lastUpdate.$date;
            break;
          case 'Div':
            div = item;
            if (div.box.coordinates[0].length < 5) {
              console.log("Error: box has less than 5 points");
            }
            switch (div.object_type) {
              case 'text':
                rdiv = new Item.Text(Utils.CS.rectangleFromBox(div), data, pk, date, lock);
                break;
              case 'media':
                rdiv = new Item.Media(Utils.CS.rectangleFromBox(div), data, pk, date, lock);
            }
            rdiv.lastUpdateDate = div.lastUpdate.$date;
            break;
          case 'Path':
            path = item;
            planet = new P.Point(path.planetX, path.planetY);
            if (data != null) {
              data.planet = planet;
            }
            points = [];
            _ref5 = path.points.coordinates;
            for (_j = 0, _len1 = _ref5.length; _j < _len1; _j++) {
              point = _ref5[_j];
              points.push(Utils.CS.posOnPlanetToProject(point, planet));
            }
            rpath = null;
            args = {
              path: path,
              date: date,
              data: data,
              pk: pk,
              points: points,
              lock: lock
            };
            if (R.tools[path.object_type] != null) {
              this.createPath(args);
            } else {
              this.loadModuleAndCreatePath(args);
            }
            break;
          case 'AreaToUpdate':
            R.rasterizer.addAreaToUpdate(Utils.CS.rectangleFromBox(item));
            break;
          default:
            continue;
        }
      }
    };

    Loader.prototype.loadCallback = function(results) {
      var itemsToLoad;
      console.log("load callback");
      console.log(P.project.activeLayer.name);
      if (!this.checkError(results)) {
        return;
      }
      if (results.hasOwnProperty('message') && results.message === 'no_paths') {
        this.dispatchLoadFinished();
        return;
      }
      this.setMe(results.user);
      if (results.rasters != null) {
        R.rasterizer.load(results.rasters, results.qZoom);
      }
      this.removeDeletedItems(results.deletedItems);
      itemsToLoad = this.parseNewItems(results.items);
      this.createNewItems(itemsToLoad);
      R.rasterizer.setQZoomToUpdate(results.qZoom);
      if ((results.rasters == null) || results.rasters.length === 0) {
        R.rasterizer.checkRasterizeAreasToUpdate();
      }
      Item.Div.updateZindex(R.sortedDivs);
      if (!R.rasterizerMode) {
        if (Utils.isEmpty(this.pathsToCreate)) {
          this.hideLoadingBar();
        }
        this.dispatchLoadFinished();
      }
      if (typeof window.saveOnServer === "function") {
        console.log("rasterizeAndSaveOnServer");
        R.rasterizeAndSaveOnServer();
      }
    };

    Loader.prototype.checkError = function(result) {
      if (result == null) {
        return true;
      }
      if (result.state === 'not_logged_in') {
        R.alertManager.alert("You must be logged in to update drawings to the database.", "info");
        return false;
      }
      if (result.state === 'error') {
        if (result.message === 'invalid_url') {
          R.alertManager.alert("Your URL is invalid or does not point to an existing page.", "error");
        } else {
          R.alertManager.alert("Error: " + result.message, "error");
        }
        return false;
      } else if (result.state === 'system_error') {
        console.log(result.message);
        return false;
      }
      return true;
    };


    /* Debug methods */

    Loader.prototype.updateDebugPaths = function(limit, bounds, t, l, b, r) {
      var _ref, _ref1, _ref2;
      if ((_ref = this.unloadRectangle) != null) {
        _ref.remove();
      }
      this.unloadRectangle = new P.Path.Rectangle(limit);
      this.unloadRectangle.name = '@debug load unload rectangle';
      this.unloadRectangle.strokeWidth = 1;
      this.unloadRectangle.strokeColor = 'red';
      this.unloadRectangle.dashArray = [10, 4];
      R.view.debugLayer.addChild(this.unloadRectangle);
      if ((_ref1 = this.viewRectangle) != null) {
        _ref1.remove();
      }
      this.viewRectangle = new P.Path.Rectangle(bounds);
      this.viewRectangle.name = '@debug load view rectangle';
      this.viewRectangle.strokeWidth = 1;
      this.viewRectangle.strokeColor = 'blue';
      R.view.debugLayer.addChild(this.viewRectangle);
      if ((_ref2 = this.limitRectangle) != null) {
        _ref2.remove();
      }
      this.limitRectangle = new P.Path.Rectangle(new P.Point(l, t), new P.Point(r, b));
      this.limitRectangle.name = '@debug load limit rectangle';
      this.limitRectangle.strokeWidth = 2;
      this.limitRectangle.strokeColor = 'blue';
      this.limitRectangle.dashArray = [10, 4];
      R.view.debugLayer.addChild(this.limitRectangle);
    };

    Loader.prototype.updateDebugArea = function(area) {
      area.rectangle.strokeColor = 'red';
      this.removeDebugRectangle(area.rectangle);
    };

    Loader.prototype.removeDebugRectangle = function(rectangle) {
      var removeRect;
      removeRect = function() {
        return rectangle.remove();
      };
      setTimeout(removeRect, 1500);
    };

    Loader.prototype.createAreaDebugRectangle = function(x, y, scale) {
      var areaRectangle;
      areaRectangle = new P.Path.Rectangle(x, y, scale, scale);
      areaRectangle.name = '@debug load area rectangle';
      areaRectangle.strokeWidth = 1;
      areaRectangle.strokeColor = 'green';
      R.view.debugLayer.addChild(areaRectangle);
      area.rectangle = areaRectangle;
    };

    return Loader;

  })();
  return Loader;
});
