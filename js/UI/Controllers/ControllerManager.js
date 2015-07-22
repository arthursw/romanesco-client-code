// Generated by CoffeeScript 1.7.1
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['UI/Controllers/Controller', 'UI/Controllers/ColorController', 'UI/Controllers/Folder', 'gui'], function(Controller, ColorController, Folder, GUI) {
    var ControllerManager;
    console.log('ControllerManager');
    ControllerManager = (function() {
      ControllerManager.initializeGlobalParameters = function() {
        var colorName, hueRange, i, minHue, step, _i;
        console.log('initializeGlobalParameters');
        R.defaultColors = [];
        R.polygonMode = false;
        R.selectionBlue = '#2fa1d6';
        hueRange = Utils.random(10, 180);
        minHue = Utils.random(0, 360 - hueRange);
        step = hueRange / 10;
        for (i = _i = 0; _i <= 10; i = ++_i) {
          R.defaultColors.push(P.Color.HSL(minHue + i * step, Utils.random(0.3, 0.9), Utils.random(0.5, 0.7)).toCSS());
        }
        R.parameters = {};
        R.parameters['General'] = {};
        R.parameters['General'].location = {
          type: 'string',
          label: 'Location',
          "default": '0.0, 0.0',
          permanent: true,
          onFinishChange: function(value) {
            R.ignoreHashChange = false;
            location.hash = value;
          }
        };
        R.parameters['General'].zoom = {
          type: 'slider',
          label: 'Zoom',
          min: 1,
          max: 500,
          "default": 100,
          permanent: true,
          onChange: function(value) {
            var div, _j, _len, _ref;
            P.view.zoom = value / 100.0;
            R.view.grid.update();
            R.rasterizer.move();
            _ref = R.divs;
            for (_j = 0, _len = _ref.length; _j < _len; _j++) {
              div = _ref[_j];
              div.updateTransform();
            }
          },
          onFinishChange: function(value) {
            R.loader.load();
          }
        };
        R.parameters['General'].displayGrid = {
          type: 'checkbox',
          label: 'Display grid',
          "default": false,
          permanent: true,
          onChange: function(value) {
            R.displayGrid = !R.displayGrid;
            R.view.grid.update();
          }
        };
        R.parameters['General'].ignoreSockets = {
          type: 'checkbox',
          label: 'Ignore sockets',
          "default": false,
          onChange: function(value) {
            R.ignoreSockets = value;
          }
        };
        R.parameters['General'].snap = {
          type: 'slider',
          label: 'Snap',
          min: 0,
          max: 100,
          step: 5,
          "default": 0,
          snap: 0,
          permanent: true,
          onChange: function() {
            return R.view.grid.update();
          }
        };
        R.parameters["default"] = {};
        R.parameters.strokeWidth = {
          type: 'slider',
          label: 'Stroke width',
          min: 1,
          max: 100,
          "default": 5
        };
        R.parameters.strokeColor = {
          type: 'color',
          label: 'Stroke color',
          "default": Utils.Array.random(R.defaultColors),
          defaultFunction: function() {
            return Utils.Array.random(R.defaultColors);
          },
          defaultCheck: true
        };
        R.parameters.fillColor = {
          type: 'color',
          label: 'Fill color',
          "default": Utils.Array.random(R.defaultColors),
          defaultCheck: false
        };
        R.parameters["delete"] = {
          type: 'button',
          label: 'Delete items',
          "default": function() {
            var item, selectedItems, _j, _len;
            selectedItems = R.selectedItems.slice();
            for (_j = 0, _len = selectedItems.length; _j < _len; _j++) {
              item = selectedItems[_j];
              item.deleteCommand();
            }
          }
        };
        R.parameters.duplicate = {
          type: 'button',
          label: 'Duplicate items',
          "default": function() {
            var item, _j, _len, _ref;
            _ref = R.selectedItems;
            for (_j = 0, _len = _ref.length; _j < _len; _j++) {
              item = _ref[_j];
              item.duplicateCommand();
            }
          }
        };
        R.parameters.align = {
          type: 'button-group',
          label: 'Align',
          "default": '',
          initializeController: function(controller) {
            var align, alignJ, domElement;
            domElement = controller.datController.domElement;
            $(domElement).find('input').remove();
            align = function(type) {
              var avgX, avgY, bottom, bounds, item, items, left, right, top, xMax, xMin, yMax, yMin, _j, _k, _l, _len, _len1, _len10, _len11, _len2, _len3, _len4, _len5, _len6, _len7, _len8, _len9, _m, _n, _o, _p, _q, _r, _s, _t, _u;
              items = R.selectedItems;
              switch (type) {
                case 'h-top':
                  yMin = NaN;
                  for (_j = 0, _len = items.length; _j < _len; _j++) {
                    item = items[_j];
                    top = item.getBounds().top;
                    if (isNaN(yMin) || top < yMin) {
                      yMin = top;
                    }
                  }
                  items.sort(function(a, b) {
                    return a.getBounds().top - b.getBounds().top;
                  });
                  for (_k = 0, _len1 = items.length; _k < _len1; _k++) {
                    item = items[_k];
                    bounds = item.getBounds();
                    item.moveTo(new P.Point(bounds.centerX, top + bounds.height / 2));
                  }
                  break;
                case 'h-center':
                  avgY = 0;
                  for (_l = 0, _len2 = items.length; _l < _len2; _l++) {
                    item = items[_l];
                    avgY += item.getBounds().centerY;
                  }
                  avgY /= items.length;
                  items.sort(function(a, b) {
                    return a.getBounds().centerY - b.getBounds().centerY;
                  });
                  for (_m = 0, _len3 = items.length; _m < _len3; _m++) {
                    item = items[_m];
                    bounds = item.getBounds();
                    item.moveTo(new P.Point(bounds.centerX, avgY));
                  }
                  break;
                case 'h-bottom':
                  yMax = NaN;
                  for (_n = 0, _len4 = items.length; _n < _len4; _n++) {
                    item = items[_n];
                    bottom = item.getBounds().bottom;
                    if (isNaN(yMax) || bottom > yMax) {
                      yMax = bottom;
                    }
                  }
                  items.sort(function(a, b) {
                    return a.getBounds().bottom - b.getBounds().bottom;
                  });
                  for (_o = 0, _len5 = items.length; _o < _len5; _o++) {
                    item = items[_o];
                    bounds = item.getBounds();
                    item.moveTo(new P.Point(bounds.centerX, bottom - bounds.height / 2));
                  }
                  break;
                case 'v-left':
                  xMin = NaN;
                  for (_p = 0, _len6 = items.length; _p < _len6; _p++) {
                    item = items[_p];
                    left = item.getBounds().left;
                    if (isNaN(xMin) || left < xMin) {
                      xMin = left;
                    }
                  }
                  items.sort(function(a, b) {
                    return a.getBounds().left - b.getBounds().left;
                  });
                  for (_q = 0, _len7 = items.length; _q < _len7; _q++) {
                    item = items[_q];
                    bounds = item.getBounds();
                    item.moveTo(new P.Point(xMin + bounds.width / 2, bounds.centerY));
                  }
                  break;
                case 'v-center':
                  avgX = 0;
                  for (_r = 0, _len8 = items.length; _r < _len8; _r++) {
                    item = items[_r];
                    avgX += item.getBounds().centerX;
                  }
                  avgX /= items.length;
                  items.sort(function(a, b) {
                    return a.getBounds().centerY - b.getBounds().centerY;
                  });
                  for (_s = 0, _len9 = items.length; _s < _len9; _s++) {
                    item = items[_s];
                    bounds = item.getBounds();
                    item.moveTo(new P.Point(avgX, bounds.centerY));
                  }
                  break;
                case 'v-right':
                  xMax = NaN;
                  for (_t = 0, _len10 = items.length; _t < _len10; _t++) {
                    item = items[_t];
                    right = item.getBounds().right;
                    if (isNaN(xMax) || right > xMax) {
                      xMax = right;
                    }
                  }
                  items.sort(function(a, b) {
                    return a.getBounds().right - b.getBounds().right;
                  });
                  for (_u = 0, _len11 = items.length; _u < _len11; _u++) {
                    item = items[_u];
                    bounds = item.getBounds();
                    item.moveTo(new P.Point(xMax - bounds.width / 2, bounds.centerY));
                  }
              }
            };
            R.templatesJ.find("#align").clone().appendTo(domElement);
            alignJ = $("#align:first");
            alignJ.find("button").click(function() {
              return align($(this).attr("data-type"));
            });
          }
        };
        R.parameters.distribute = {
          type: 'button-group',
          label: 'Distribute',
          "default": '',
          initializeController: function(controller) {
            var distribute, distributeJ, domElement;
            domElement = controller.datController.domElement;
            $(domElement).find('input').remove();
            distribute = function(type) {
              var bottom, bounds, center, item, items, left, right, top, xMax, xMin, yMax, yMin, _j, _k, _l, _len, _len1, _len10, _len11, _len2, _len3, _len4, _len5, _len6, _len7, _len8, _len9, _m, _n, _o, _p, _q, _r, _s, _t, _u;
              items = R.selectedItems;
              switch (type) {
                case 'h-top':
                  yMin = NaN;
                  yMax = NaN;
                  for (_j = 0, _len = items.length; _j < _len; _j++) {
                    item = items[_j];
                    top = item.getBounds().top;
                    if (isNaN(yMin) || top < yMin) {
                      yMin = top;
                    }
                    if (isNaN(yMax) || top > yMax) {
                      yMax = top;
                    }
                  }
                  step = (yMax - yMin) / (items.length - 1);
                  items.sort(function(a, b) {
                    return a.getBounds().top - b.getBounds().top;
                  });
                  for (i = _k = 0, _len1 = items.length; _k < _len1; i = ++_k) {
                    item = items[i];
                    bounds = item.getBounds();
                    item.moveTo(new P.Point(bounds.centerX, yMin + i * step + bounds.height / 2));
                  }
                  break;
                case 'h-center':
                  yMin = NaN;
                  yMax = NaN;
                  for (_l = 0, _len2 = items.length; _l < _len2; _l++) {
                    item = items[_l];
                    center = item.getBounds().centerY;
                    if (isNaN(yMin) || center < yMin) {
                      yMin = center;
                    }
                    if (isNaN(yMax) || center > yMax) {
                      yMax = center;
                    }
                  }
                  step = (yMax - yMin) / (items.length - 1);
                  items.sort(function(a, b) {
                    return a.getBounds().centerY - b.getBounds().centerY;
                  });
                  for (i = _m = 0, _len3 = items.length; _m < _len3; i = ++_m) {
                    item = items[i];
                    bounds = item.getBounds();
                    item.moveTo(new P.Point(bounds.centerX, yMin + i * step));
                  }
                  break;
                case 'h-bottom':
                  yMin = NaN;
                  yMax = NaN;
                  for (_n = 0, _len4 = items.length; _n < _len4; _n++) {
                    item = items[_n];
                    bottom = item.getBounds().bottom;
                    if (isNaN(yMin) || bottom < yMin) {
                      yMin = bottom;
                    }
                    if (isNaN(yMax) || bottom > yMax) {
                      yMax = bottom;
                    }
                  }
                  step = (yMax - yMin) / (items.length - 1);
                  items.sort(function(a, b) {
                    return a.getBounds().bottom - b.getBounds().bottom;
                  });
                  for (i = _o = 0, _len5 = items.length; _o < _len5; i = ++_o) {
                    item = items[i];
                    bounds = item.getBounds();
                    item.moveTo(new P.Point(bounds.centerX, yMin + i * step - bounds.height / 2));
                  }
                  break;
                case 'v-left':
                  xMin = NaN;
                  xMax = NaN;
                  for (_p = 0, _len6 = items.length; _p < _len6; _p++) {
                    item = items[_p];
                    left = item.getBounds().left;
                    if (isNaN(xMin) || left < xMin) {
                      xMin = left;
                    }
                    if (isNaN(xMax) || left > xMax) {
                      xMax = left;
                    }
                  }
                  step = (xMax - xMin) / (items.length - 1);
                  items.sort(function(a, b) {
                    return a.getBounds().left - b.getBounds().left;
                  });
                  for (i = _q = 0, _len7 = items.length; _q < _len7; i = ++_q) {
                    item = items[i];
                    bounds = item.getBounds();
                    item.moveTo(new P.Point(xMin + i * step + bounds.width / 2, bounds.centerY));
                  }
                  break;
                case 'v-center':
                  xMin = NaN;
                  xMax = NaN;
                  for (_r = 0, _len8 = items.length; _r < _len8; _r++) {
                    item = items[_r];
                    center = item.getBounds().centerX;
                    if (isNaN(xMin) || center < xMin) {
                      xMin = center;
                    }
                    if (isNaN(xMax) || center > xMax) {
                      xMax = center;
                    }
                  }
                  step = (xMax - xMin) / (items.length - 1);
                  items.sort(function(a, b) {
                    return a.getBounds().centerX - b.getBounds().centerX;
                  });
                  for (i = _s = 0, _len9 = items.length; _s < _len9; i = ++_s) {
                    item = items[i];
                    bounds = item.getBounds();
                    item.moveTo(new P.Point(xMin + i * step, bounds.centerY));
                  }
                  break;
                case 'v-right':
                  xMin = NaN;
                  xMax = NaN;
                  for (_t = 0, _len10 = items.length; _t < _len10; _t++) {
                    item = items[_t];
                    right = item.getBounds().right;
                    if (isNaN(xMin) || right < xMin) {
                      xMin = right;
                    }
                    if (isNaN(xMax) || right > xMax) {
                      xMax = right;
                    }
                  }
                  step = (xMax - xMin) / (items.length - 1);
                  items.sort(function(a, b) {
                    return a.getBounds().right - b.getBounds().right;
                  });
                  for (i = _u = 0, _len11 = items.length; _u < _len11; i = ++_u) {
                    item = items[i];
                    bounds = item.getBounds();
                    item.moveTo(new P.Point(xMin + i * step - bounds.width / 2, bounds.centerY));
                  }
              }
            };
            R.templatesJ.find("#distribute").clone().appendTo(domElement);
            distributeJ = $("#distribute:first");
            distributeJ.find("button").click(function() {
              return distribute($(this).attr("data-type"));
            });
          }
        };
        colorName = Utils.Array.random(R.defaultColors);
        R.strokeColor = colorName;
        R.fillColor = "rgb(255,255,255,255)";
        R.displayGrid = false;
      };

      console.log('call initializeGlobalParameters');

      ControllerManager.initializeGlobalParameters();

      function ControllerManager() {
        this.updateParametersForSelectedItemsCallback = __bind(this.updateParametersForSelectedItemsCallback, this);
        var toggleGuiButtonJ;
        dat.GUI.autoPace = false;
        R.gui = new dat.GUI();
        dat.GUI.toggleHide = function() {};
        this.folders = {};
        R.templatesJ.find("button.dat-gui-toggle").clone().appendTo(R.gui.domElement);
        toggleGuiButtonJ = $(R.gui.domElement).find("button.dat-gui-toggle");
        toggleGuiButtonJ.click(this.toggleGui);
        if ((localStorage.optionsBarPosition != null) && localStorage.optionsBarPosition === 'sidebar') {
          $(".dat-gui.dg-sidebar").append(R.gui.domElement);
        } else {
          $(".dat-gui.dg-right").append(R.gui.domElement);
        }
        return;
      }

      ControllerManager.prototype.createGlobalControllers = function() {
        var generalFolder, name, parameter, _ref;
        generalFolder = new Folder('General');
        _ref = R.parameters['General'];
        for (name in _ref) {
          parameter = _ref[name];
          this.createController(name, parameter, generalFolder);
        }
      };

      ControllerManager.prototype.toggleGui = function() {
        var parentJ;
        parentJ = $(R.gui.domElement).parent();
        if (parentJ.hasClass("dg-sidebar")) {
          $(".dat-gui.dg-right").append(R.gui.domElement);
          localStorage.optionsBarPosition = 'right';
        } else if (parentJ.hasClass("dg-right")) {
          $(".dat-gui.dg-sidebar").append(R.gui.domElement);
          localStorage.optionsBarPosition = 'sidebar';
        }
      };

      ControllerManager.prototype.removeUnusedControllers = function() {
        var controller, folder, folderName, name, _ref, _ref1;
        _ref = this.folders;
        for (folderName in _ref) {
          folder = _ref[folderName];
          if (folder.name === 'General') {
            continue;
          }
          _ref1 = folder.controllers;
          for (name in _ref1) {
            controller = _ref1[name];
            if (!controller.used) {
              controller.remove();
            } else {
              controller.used = false;
            }
          }
        }
      };

      ControllerManager.prototype.updateHeight = function() {};

      ControllerManager.prototype.createController = function(name, parameter, folder) {
        var controller;
        controller = null;
        switch (parameter.type) {
          case 'color':
            controller = new ColorController(name, parameter, folder);
            break;
          default:
            controller = new Controller(name, parameter, folder);
        }
        return controller;
      };

      ControllerManager.prototype.initializeControllers = function() {
        var controller, folder, folderName, name, _base, _ref, _ref1;
        _ref = this.folders;
        for (folderName in _ref) {
          folder = _ref[folderName];
          _ref1 = folder.controllers;
          for (name in _ref1) {
            controller = _ref1[name];
            if (typeof (_base = controller.parameter).initializeController === "function") {
              _base.initializeController(controller);
            }
          }
        }
      };

      ControllerManager.prototype.initializeValue = function(name, parameter, firstItem) {
        var value, _ref;
        value = null;
        if ((firstItem != null ? (_ref = firstItem.data) != null ? _ref[name] : void 0 : void 0) !== void 0) {
          value = firstItem.data[name];
        } else if (parameter["default"] != null) {
          value = parameter["default"];
        } else if (parameter.defaultFunction != null) {
          value = parameter.defaultFunction();
        }
        return value;
      };

      ControllerManager.prototype.updateControllers = function(tools, resetValues) {
        var controller, folder, folderName, folderParameters, name, parameter, tool, _ref;
        if (resetValues == null) {
          resetValues = false;
        }
        for (name in tools) {
          tool = tools[name];
          _ref = tool.parameters;
          for (folderName in _ref) {
            folderParameters = _ref[folderName];
            if (folderName === 'General') {
              continue;
            }
            folder = this.folders[folderName];
            if (folder == null) {
              folder = new Folder(folderName, folderParameters.folderIsClosedByDefault);
            }
            for (name in folderParameters) {
              parameter = folderParameters[name];
              if (name === 'folderIsClosedByDefault') {
                continue;
              }
              controller = folder.controllers[name];
              parameter.value = this.initializeValue(name, parameter, tool.items[0]);
              if (controller != null) {
                if (resetValues) {
                  controller.setValue(parameter.value, false);
                }
              } else {
                if (controller == null) {
                  controller = this.createController(name, parameter, folder);
                }
              }
              parameter.controller = controller;
              controller.used = true;
            }
          }
        }
        this.removeUnusedControllers();
        this.initializeControllers();
      };

      ControllerManager.prototype.updateController = function(controllerName, value) {
        var controller, folder, folderName, name, _ref, _ref1;
        _ref = this.folders;
        for (folderName in _ref) {
          folder = _ref[folderName];
          _ref1 = folder.controllers;
          for (name in _ref1) {
            controller = _ref1[name];
            if (name === controllerName) {
              controller.setValue(value);
            }
          }
        }
      };

      ControllerManager.prototype.updateParametersForSelectedItems = function() {
        Utils.callNextFrame(this.updateParametersForSelectedItemsCallback, 'updateParametersForSelectedItems');
      };

      ControllerManager.prototype.updateParametersForSelectedItemsCallback = function() {
        var item, tools, _i, _len, _name, _ref;
        tools = {};
        _ref = R.selectedItems;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          if (tools[_name = item.constructor.name] == null) {
            tools[_name] = {
              parameters: item.constructor.parameters,
              items: []
            };
          }
          tools[item.constructor.name].items.push(item);
        }
        this.updateControllers(tools, true);
      };

      ControllerManager.prototype.setSelectedTool = function(tool) {
        var tools;
        Utils.cancelCallNextFrame('updateParametersForSelectedItems');
        tools = {};
        tools[tool.name] = {
          parameters: tool.parameters,
          items: []
        };
        this.updateControllers(tools, false);
      };

      ControllerManager.prototype.updateItemData = function(item) {
        var controller, folder, name, _base, _name, _ref, _ref1;
        _ref = this.folders;
        for (name in _ref) {
          folder = _ref[name];
          if (name === 'General' || name === 'Items') {
            continue;
          }
          _ref1 = folder.controllers;
          for (name in _ref1) {
            controller = _ref1[name];
            if ((_base = item.data)[_name = controller.name] == null) {
              _base[_name] = controller.getValue();
            }
          }
        }
      };

      return ControllerManager;

    })();
    return ControllerManager;
  });

}).call(this);