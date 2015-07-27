define(['Utils/CoordinateSystems', 'underscore', 'jquery', 'tinycolor', 'paper', 'bootstrap'], function(CS, _, $, tinycolor) {
  var sqrtTwoPi, __nativeSI__, __nativeST__;
  window.tinycolor = tinycolor;
  paper.install(window.P);
  Utils.CS = CS;
  Dajaxice.setup({
    'default_exception_callback': function(error) {
      console.log('Dajaxice error!');
      R.alertManager.alert("Connection error", "error");
    }
  });
  R.romanescoURL = 'http://localhost:8000/';
  R.me = null;
  R.OSName = "Unknown OS";
  if (navigator.appVersion.indexOf("Win") !== -1) {
    R.OSName = "Windows";
  }
  if (navigator.appVersion.indexOf("Mac") !== -1) {
    R.OSName = "MacOS";
  }
  if (navigator.appVersion.indexOf("X11") !== -1) {
    R.OSName = "UNIX";
  }
  if (navigator.appVersion.indexOf("Linux") !== -1) {
    R.OSName = "Linux";
  }
  R.templatesJ = $("#templates");
  if (document.all && !window.setTimeout.isPolyfill) {
    __nativeST__ = window.setTimeout;
    window.setTimeout = function(vCallback, nDelay) {
      var aArgs;
      aArgs = Array.prototype.slice.call(arguments, 2);
      return __nativeST__((vCallback instanceof Function ? function() {
        return vCallback.apply(null, aArgs);
      } : vCallback), nDelay);
    };
    window.setTimeout.isPolyfill = true;
  }
  if (document.all && !window.setInterval.isPolyfill) {
    __nativeSI__ = window.setInterval;
    window.setInterval = function(vCallback, nDelay) {
      var aArgs;
      aArgs = Array.prototype.slice.call(arguments, 2);
      return __nativeSI__((vCallback instanceof Function ? function() {
        return vCallback.apply(null, aArgs);
      } : vCallback), nDelay);
    };
  }
  window.setInterval.isPolyfill = true;
  Utils.LocalStorage = {};
  Utils.LocalStorage.set = function(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  };
  Utils.LocalStorage.get = function(key) {
    var value;
    value = localStorage.getItem(key);
    return value && JSON.parse(value);
  };
  Utils.specialKeys = {
    8: 'backspace',
    9: 'tab',
    13: 'enter',
    16: 'shift',
    17: 'control',
    18: 'option',
    19: 'pause',
    20: 'caps-lock',
    27: 'escape',
    32: 'space',
    35: 'end',
    36: 'home',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    46: 'delete',
    91: 'command',
    93: 'command',
    224: 'command'
  };
  Utils.sign = function(x) {
    if (typeof x === "number") {
      if (x) {
        if (x < 0) {
          return -1;
        } else {
          return 1;
        }
      } else {
        if (x === x) {
          return 0;
        } else {
          return NaN;
        }
      }
    } else {
      return NaN;
    }
  };
  Utils.clamp = function(min, value, max) {
    return Math.min(Math.max(value, min), max);
  };
  Utils.random = function(min, max) {
    return min + Math.random() * (max - min);
  };
  Utils.clone = function(object) {
    return $.extend({}, object);
  };
  Utils.Array = {};
  Utils.Array.remove = function(array, itemToRemove) {
    var i;
    if (!Array.prototype.isPrototypeOf(array)) {
      return;
    }
    i = array.indexOf(itemToRemove);
    if (i >= 0) {
      array.splice(i, 1);
    }
  };
  Utils.Array.random = function(array) {
    return array[Math.floor(Math.random() * array.length)];
  };
  Utils.Array.max = function(array) {
    var item, max, _i, _len;
    max = array[0];
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      item = array[_i];
      if (item > max) {
        max = item;
      }
    }
    return max;
  };
  Utils.Array.min = function(array) {
    var item, min, _i, _len;
    min = array[0];
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      item = array[_i];
      if (item < min) {
        min = item;
      }
    }
    return min;
  };
  Utils.Array.maxc = function(array, biggerThan) {
    var item, max, _i, _len;
    max = array[0];
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      item = array[_i];
      if (biggerThan(item, max)) {
        max = item;
      }
    }
    return max;
  };
  Utils.Array.minc = function(array, smallerThan) {
    var item, min, _i, _len;
    min = array[0];
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      item = array[_i];
      if (smallerThan(item, min)) {
        min = item;
      }
    }
    return min;
  };
  Utils.Array.isArray = function(array) {
    return array.constructor === Array;
  };
  Utils.Array.pushIfAbsent = function(array, item) {
    if (array.indexOf(item) < 0) {
      array.push(item);
    }
  };
  R.updateTimeout = {};
  R.requestedCallbacks = {};
  Utils.deferredExecutionCallbackWrapper = function(callback, id, args, oThis) {
    console.log("deferredExecutionCallbackWrapper: " + id);
    delete R.updateTimeout[id];
    if (args == null) {
      if (typeof callback === "function") {
        callback();
      }
    } else {
      if (callback != null) {
        callback.apply(oThis, args);
      }
    }
  };
  Utils.deferredExecution = function(callback, id, n, args, oThis) {
    if (n == null) {
      n = 500;
    }
    if (id == null) {
      return;
    }
    if (R.updateTimeout[id] != null) {
      clearTimeout(R.updateTimeout[id]);
    }
    console.log("deferred execution: " + id + ', ' + R.updateTimeout[id]);
    R.updateTimeout[id] = setTimeout(Utils.deferredExecutionCallbackWrapper, n, callback, id, args, oThis);
  };
  Utils.callNextFrame = function(callback, id, args) {
    var callbackWrapper, _base;
    if (id == null) {
      id = callback;
    }
    callbackWrapper = function() {
      delete R.requestedCallbacks[id];
      if (args == null) {
        callback();
      } else {
        callback.apply(window, args);
      }
    };
    if ((_base = R.requestedCallbacks)[id] == null) {
      _base[id] = window.requestAnimationFrame(callbackWrapper);
    }
  };
  Utils.cancelCallNextFrame = function(idToCancel) {
    window.cancelAnimationFrame(R.requestedCallbacks[idToCancel]);
    delete R.requestedCallbacks[idToCancel];
  };
  sqrtTwoPi = Math.sqrt(2 * Math.PI);
  Utils.gaussian = function(mean, sigma, x) {
    var expf;
    expf = -((x - mean) * (x - mean) / (2 * sigma * sigma));
    return (1.0 / (sigma * sqrtTwoPi)) * Math.exp(expf);
  };
  Utils.isEmpty = function(map) {
    var key, value;
    for (key in map) {
      value = map[key];
      if (map.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  };
  Utils.capitalizeFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  Utils.linearInterpolation = function(v1, v2, f) {
    return v1 * (1 - f) + v2 * f;
  };
  Utils.floorToMultiple = function(x, m) {
    return Math.floor(x / m) * m;
  };
  Utils.ceilToMultiple = function(x, m) {
    return Math.ceil(x / m) * m;
  };
  Utils.roundToMultiple = function(x, m) {
    return Math.round(x / m) * m;
  };
  Utils.floorPointToMultiple = function(point, m) {
    return new P.Point(Utils.floorToMultiple(point.x, m), Utils.floorToMultiple(point.y, m));
  };
  Utils.ceilPointToMultiple = function(point, m) {
    return new P.Point(Utils.ceilToMultiple(point.x, m), Utils.ceilToMultiple(point.y, m));
  };
  Utils.roundPointToMultiple = function(point, m) {
    return new P.Point(Utils.roundToMultiple(point.x, m), Utils.roundToMultiple(point.y, m));
  };
  Utils.Rectangle = {};
  Utils.Rectangle.updatePathRectangle = function(path, rectangle) {
    path.segments[0].point = rectangle.bottomLeft;
    path.segments[1].point = rectangle.topLeft;
    path.segments[2].point = rectangle.topRight;
    path.segments[3].point = rectangle.bottomRight;
  };
  Utils.Rectangle.getRotatedBounds = function(rectangle, rotation) {
    var bottomLeft, bottomRight, bounds, topLeft, topRight;
    if (rotation == null) {
      rotation = 0;
    }
    topLeft = rectangle.topLeft.subtract(rectangle.center);
    topLeft.angle += rotation;
    bottomRight = rectangle.bottomRight.subtract(rectangle.center);
    bottomRight.angle += rotation;
    bottomLeft = rectangle.bottomLeft.subtract(rectangle.center);
    bottomLeft.angle += rotation;
    topRight = rectangle.topRight.subtract(rectangle.center);
    topRight.angle += rotation;
    bounds = new P.Rectangle(rectangle.center.add(topLeft), rectangle.center.add(bottomRight));
    bounds = bounds.include(rectangle.center.add(bottomLeft));
    bounds = bounds.include(rectangle.center.add(topRight));
    return bounds;
  };
  Utils.Rectangle.shrinkRectangleToInteger = function(rectangle) {
    return new P.Rectangle(rectangle.topLeft.ceil(), rectangle.bottomRight.floor());
  };
  Utils.Rectangle.expandRectangleToInteger = function(rectangle) {
    return new P.Rectangle(rectangle.topLeft.floor(), rectangle.bottomRight.ceil());
  };
  Utils.Rectangle.expandRectangleToMultiple = function(rectangle, multiple) {
    return new P.Rectangle(Utils.floorPointToMultiple(rectangle.topLeft, multiple), Utils.ceilPointToMultiple(rectangle.bottomRight, multiple));
  };
  Utils.Rectangle.roundRectangle = function(rectangle) {
    return new P.Rectangle(rectangle.topLeft.round(), rectangle.bottomRight.round());
  };
  P.Point.prototype.toJSON = function() {
    return {
      x: this.x,
      y: this.y
    };
  };
  P.Point.prototype.exportJSON = function() {
    return JSON.stringify(this.toJSON());
  };
  P.Rectangle.prototype.toJSON = function() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  };
  P.Rectangle.prototype.exportJSON = function() {
    return JSON.stringify(this.toJSON());
  };
  P.Rectangle.prototype.translate = function(point) {
    return new P.Rectangle(this.x + point.x, this.y + point.y, this.width, this.height);
  };
  P.Rectangle.prototype.scaleFromCenter = function(scale, center) {
    var delta, topLeft;
    delta = this.topLeft.subtract(center);
    delta = delta.multiply(scale.x, scale.y);
    topLeft = center.add(delta);
    return new P.Rectangle(topLeft, new P.Size(this.width * scale.x, this.height * scale.y));
  };
  P.Rectangle.prototype.moveSide = function(sideName, destination) {
    switch (sideName) {
      case 'left':
        this.x = destination;
        break;
      case 'right':
        this.x = destination - this.width;
        break;
      case 'top':
        this.y = destination;
        break;
      case 'bottom':
        this.y = destination - this.height;
    }
  };
  P.Rectangle.prototype.moveCorner = function(cornerName, destination) {
    switch (cornerName) {
      case 'topLeft':
        this.x = destination.x;
        this.y = destination.y;
        break;
      case 'topRight':
        this.x = destination.x - this.width;
        this.y = destination.y;
        break;
      case 'bottomRight':
        this.x = destination.x - this.width;
        this.y = destination.y - this.height;
        break;
      case 'bottomLeft':
        this.x = destination.x;
        this.y = destination.y - this.height;
    }
  };
  P.Rectangle.prototype.moveCenter = function(destination) {
    this.x = destination.x - this.width * 0.5;
    this.y = destination.y - this.height * 0.5;
  };
  P.Event.prototype.toJSON = function() {
    var event;
    event = {
      modifiers: this.modifiers,
      event: {
        which: this.event.which
      },
      point: this.point,
      downPoint: this.downPoint,
      delta: this.delta,
      middlePoint: this.middlePoint,
      type: this.type,
      count: this.count
    };
    return event;
  };
  P.Event.prototype.fromJSON = function(event) {
    if (event.point != null) {
      event.point = new P.Point(event.point);
    }
    if (event.downPoint != null) {
      event.downPoint = new P.Point(event.downPoint);
    }
    if (event.delta != null) {
      event.delta = new P.Point(event.delta);
    }
    if (event.middlePoint != null) {
      event.middlePoint = new P.Point(event.middlePoint);
    }
    return event;
  };
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
  Utils.logElapsedTime = function() {
    var time;
    time = (Date.now() - R.startTime) / 1000;
    console.log("Time elapsed: " + time + " sec.");
  };
  Utils.defaultCallback = function(a) {
    console.log(a);
  };
  Utils.defineRequireJsModule = function(moduleName, resultName) {
    require([moduleName], function(result) {
      return window[resultName] = result;
    });
  };
  return Utils;
});
