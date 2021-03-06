// Generated by CoffeeScript 1.12.7
(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['Items/Item', 'bootstrap', 'tween', 'mousewheel', 'scrollbar'], function(Item) {

    /*
    	 * Global functions #
    
    	Here are all global functions (which do not belong to classes and are not event handlers neither initialization functions).
     */
    var doAreasOverlap;
    Utils.Event = {};
    Utils.Event.jEventToPoint = function(event) {
      return P.view.viewToProject(new P.Point(event.pageX - R.canvasJ.offset().left, event.pageY - R.canvasJ.offset().top));
    };
    Utils.Event.jEventToPaperEvent = function(event, previousPosition, initialPosition, type, count) {
      var currentPosition, delta, paperEvent;
      if (previousPosition == null) {
        previousPosition = null;
      }
      if (initialPosition == null) {
        initialPosition = null;
      }
      if (type == null) {
        type = null;
      }
      if (count == null) {
        count = null;
      }
      currentPosition = Utils.Event.jEventToPoint(event);
      if (previousPosition == null) {
        previousPosition = currentPosition;
      }
      if (initialPosition == null) {
        initialPosition = currentPosition;
      }
      delta = currentPosition.subtract(previousPosition);
      paperEvent = {
        modifiers: {
          shift: event.shiftKey,
          control: event.ctrlKey,
          option: event.altKey,
          command: event.metaKey
        },
        point: currentPosition,
        downPoint: initialPosition,
        delta: delta,
        middlePoint: previousPosition.add(delta.divide(2)),
        type: type,
        count: count
      };
      return paperEvent;
    };
    Utils.Snap.snap = function(event, from) {
      var snap, snappedEvent;
      if (from == null) {
        from = R.me;
      }
      if (from !== R.me) {
        return event;
      }
      if (R.selectedTool.disableSnap()) {
        return event;
      }
      snap = R.parameters.General.snap.value;
      if (snap !== 0) {
        snappedEvent = jQuery.extend({}, event);
        snappedEvent.modifiers = event.modifiers;
        snappedEvent.point = Utils.Snap.snap2D(event.point, snap);
        if (event.lastPoint != null) {
          snappedEvent.lastPoint = Utils.Snap.snap2D(event.lastPoint, snap);
        }
        if (event.downPoint != null) {
          snappedEvent.downPoint = Utils.Snap.snap2D(event.downPoint, snap);
        }
        if (event.lastPoint != null) {
          snappedEvent.middlePoint = snappedEvent.point.add(snappedEvent.lastPoint).multiply(0.5);
        }
        if (event.type !== 'mouseup' && (event.lastPoint != null)) {
          snappedEvent.delta = snappedEvent.point.subtract(snappedEvent.lastPoint);
        } else if (event.downPoint != null) {
          snappedEvent.delta = snappedEvent.point.subtract(snappedEvent.downPoint);
        }
        return snappedEvent;
      } else {
        return event;
      }
    };
    R.specialKey = function(event) {
      var specialKey;
      if ((event.pageX != null) && (event.pageY != null)) {
        specialKey = R.OSName === "MacOS" ? event.metaKey : event.ctrlKey;
      } else {
        specialKey = R.OSName === "MacOS" ? event.modifiers.command : event.modifiers.control;
      }
      return specialKey;
    };
    Utils.Snap = {};
    Utils.Snap.getSnap = function() {
      return R.parameters.General.snap.value;
    };
    Utils.Snap.snap1D = function(value, snap) {
      if (snap == null) {
        snap = Utils.Snap.getSnap();
      }
      if (snap !== 0) {
        return Math.round(value / snap) * snap;
      } else {
        return value;
      }
    };
    Utils.Snap.snap2D = function(point, snap) {
      if (snap == null) {
        snap = Utils.Snap.getSnap();
      }
      if (snap !== 0) {
        return new P.Point(Utils.Snap.snap1D(point.x, snap), Utils.Snap.snap1D(point.y, snap));
      } else {
        return point;
      }
    };
    Utils.Animation = {};
    Utils.Animation.registerAnimation = function(item) {
      Utils.Array.pushIfAbsent(R.animatedItems, item);
    };
    Utils.Animation.deregisterAnimation = function(item) {
      Utils.Array.remove(R.animatedItems, item);
    };
    R.highlightAreasToUpdate = function() {
      var pk, rectangle, rectanglePath, ref;
      ref = R.areasToUpdate;
      for (pk in ref) {
        rectangle = ref[pk];
        rectanglePath = P.project.getItem({
          name: pk
        });
        rectanglePath.strokeColor = 'green';
      }
    };
    R.logItems = function() {
      var i, item, j, k, len, len1, ref, ref1, ref2, ref3, ref4, ref5;
      console.log("Selected items:");
      ref = P.project.selectedItems;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        item = ref[i];
        if (((ref1 = item.name) != null ? ref1.indexOf("debug") : void 0) === 0) {
          continue;
        }
        console.log("------" + i + "------");
        console.log(item.name);
        console.log(item);
        console.log(item.controller);
        console.log((ref2 = item.controller) != null ? ref2.pk : void 0);
      }
      console.log("All items:");
      ref3 = P.project.activeLayer.children;
      for (i = k = 0, len1 = ref3.length; k < len1; i = ++k) {
        item = ref3[i];
        if (((ref4 = item.name) != null ? ref4.indexOf("debug") : void 0) === 0) {
          continue;
        }
        console.log("------" + i + "------");
        console.log(item.name);
        console.log(item);
        console.log(item.controller);
        console.log((ref5 = item.controller) != null ? ref5.pk : void 0);
      }
      return "--- THE END ---";
    };
    R.checkRasters = function() {
      var item, j, len, ref;
      ref = P.project.activeLayer.children;
      for (j = 0, len = ref.length; j < len; j++) {
        item = ref[j];
        if ((item.controller != null) && (item.controller.raster == null)) {
          console.log(item.controller);
        }
      }
    };
    R.selectRasters = function() {
      var item, j, len, rasters, ref;
      rasters = [];
      ref = P.project.activeLayer.children;
      for (j = 0, len = ref.length; j < len; j++) {
        item = ref[j];
        if (item.constructor.name === "Raster") {
          item.selected = true;
          rasters.push(item);
        }
      }
      console.log('selected rasters:');
      return rasters;
    };
    R.printPathList = function() {
      var j, len, names, pathClass, ref;
      names = [];
      ref = R.pathClasses;
      for (j = 0, len = ref.length; j < len; j++) {
        pathClass = ref[j];
        names.push(pathClass.label);
      }
      console.log(names);
    };
    R.fakeGeoJsonBox = function(rectangle) {
      var box, planet;
      box = {};
      planet = Utils.CS.pointToObj(Utils.CS.projectToPlanet(rectangle.topLeft));
      box.planetX = planet.x;
      box.planetY = planet.y;
      box.box = {
        coordinates: [[Utils.CS.pointToArray(Utils.CS.projectToPosOnPlanet(rectangle.topLeft, planet)), Utils.CS.pointToArray(Utils.CS.projectToPosOnPlanet(rectangle.topRight, planet)), Utils.CS.pointToArray(Utils.CS.projectToPosOnPlanet(rectangle.bottomRight, planet)), Utils.CS.pointToArray(Utils.CS.projectToPosOnPlanet(rectangle.bottomLeft, planet))]]
      };
      return JSON.stringify(box);
    };
    R.getControllerFromFomElement = function() {
      var controller, folder, folderName, j, len, ref, ref1;
      ref = R.gui.__folders;
      for (folderName in ref) {
        folder = ref[folderName];
        ref1 = folder.__controllers;
        for (j = 0, len = ref1.length; j < len; j++) {
          controller = ref1[j];
          if (controller.domElement === $0 || $($0).find(controller.domElement).length > 0) {
            return controller;
          }
        }
      }
    };
    R.logStack = function() {
      var caller;
      caller = arguments.callee.caller;
      while (caller != null) {
        console.log(caller.prototype);
        caller = caller.caller;
      }
    };
    R.getCoffeeSources = function() {
      $.ajax({
        url: R.romanescoURL + "static/coffee/path.coffee"
      }).done(function(data) {
        var classMap, expression, expressions, j, k, len, len1, lines, pathClass, ref, ref1;
        lines = data.split(/\n/);
        expressions = CoffeeScript.nodes(data).expressions;
        classMap = {};
        ref = R.pathClasses;
        for (j = 0, len = ref.length; j < len; j++) {
          pathClass = ref[j];
          classMap[pathClass.name] = pathClass;
        }
        for (k = 0, len1 = expressions.length; k < len1; k++) {
          expression = expressions[k];
          if ((ref1 = classMap[expression.variable.base.value]) != null) {
            ref1.source = lines.slice(expression.locationData.first_line, +expression.locationData.last_line + 1 || 9e9).join("\n");
          }
        }
      });
    };
    R.startTime = Date.now();
    R.startTimer = function() {
      R.timerStartTime = Date.now();
    };
    R.stopTimer = function(message) {
      var time;
      time = (Date.now() - R.timerStartTime) / 1000;
      console.log("" + message + ": " + time + " sec.");
    };
    R.setDebugMode = function(debugMode) {
      $.ajax({
        method: "POST",
        url: "ajaxCall/",
        data: {
          data: JSON.stringify({
            "function": 'setDebugMode',
            args: {
              debug: debugMode
            }
          })
        }
      }).done(R.loader.checkError);
    };
    R.roughSizeOfObject = function(object, maxDepth) {
      var blackList, bytes, depth, ignoreBlackList, name, objectList, property, s, stack, value;
      if (maxDepth == null) {
        maxDepth = 4;
      }
      if (Item.prototype.isPrototypeOf(object)) {
        object = object.clone(false);
      }
      blackList = ['project', 'layer', 'view', 'parent', '_project', '_layer', '_view', '_parent'];
      objectList = [];
      stack = [
        {
          depth: 0,
          object: object
        }
      ];
      bytes = 0;
      depth = 0;
      while (stack.length) {
        s = stack.pop();
        value = s.object;
        depth = s.depth;
        if (depth > maxDepth) {
          console.log(s.name);
          continue;
        }
        ignoreBlackList = Item.prototype.isPrototypeOf(value) || Style.prototype.isPrototypeOf(value);
        if (typeof value === 'boolean') {
          bytes += 4;
        } else if (typeof value === 'string') {
          bytes += value.length * 2;
        } else if (typeof value === 'number') {
          bytes += 8;
        } else if (typeof value === 'object' && objectList.indexOf(value) === -1) {
          objectList.push(value);
          for (name in value) {
            property = value[name];
            if (indexOf.call(blackList, name) < 0) {
              stack.push({
                object: property,
                depth: s.depth + 1,
                name: name
              });
            }
          }
        }
      }
      console.log('takes ' + bytes + ' bytes.');
      return bytes;
    };
    doAreasOverlap = function(areas) {
      var a, area, j, k, len, len1;
      for (j = 0, len = areas.length; j < len; j++) {
        area = areas[j];
        for (k = 0, len1 = areas.length; k < len1; k++) {
          a = areas[k];
          if (a.intersects(area)) {
            console.log("OVERLAAAAAAAAAPP");
          }
        }
      }
    };
  });

}).call(this);
