// Generated by CoffeeScript 1.7.1
(function() {
  define(['Rasterizers/Rasterizer', 'UI/Controllers/Folder'], function(Rasterizer, Folder) {
    var RasterizerManager;
    RasterizerManager = (function() {
      function RasterizerManager() {
        return;
      }

      RasterizerManager.prototype.initializeRasterizers = function() {
        this.rasterizers = {};
        new Rasterizer();
        new Rasterizer.CanvasTile();
        new Rasterizer.InstantPaperTile();
        R.rasterizer = new Rasterizer.PaperTile();
        this.addRasterizerParameters();
      };

      RasterizerManager.prototype.addRasterizerParameters = function() {
        var divJ, name, parameter, parameters, rasterizer, renderingModes, type, _ref;
        renderingModes = [];
        _ref = this.rasterizers;
        for (type in _ref) {
          rasterizer = _ref[type];
          renderingModes.push(type);
        }
        this.rasterizerFolder = new Folder('Rasterizer', true, R.controllerManager.folders['General']);
        divJ = $('<div>');
        divJ.addClass('loadingBar');
        $(this.rasterizerFolder.datFolder.__ul).find('li.title').append(divJ);
        Rasterizer.Tile.loadingBarJ = divJ;
        parameters = {
          renderingMode: {
            "default": R.rasterizer.constructor.TYPE,
            values: renderingModes,
            label: 'Render mode',
            onFinishChange: this.setRasterizerType
          },
          rasterizeItems: {
            "default": true,
            label: 'Rasterize items',
            onFinishChange: function(value) {
              var controller, _i, _len, _ref1;
              R.rasterizer.rasterizeItems = value;
              if (!value) {
                R.rasterizer.renderInView = true;
              }
              _ref1 = this.rasterizerFolder.datFolder.__controllers;
              for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                controller = _ref1[_i];
                if (controller.property === 'renderInView') {
                  if (value) {
                    $(controller.__li).show();
                  } else {
                    $(controller.__li).hide();
                  }
                }
              }
            }
          },
          renderInView: {
            "default": false,
            label: 'Render in view',
            onFinishChange: function(value) {
              R.rasterizer.renderInView = value;
            }
          },
          autoRasterization: {
            "default": 'deferred',
            values: ['immediate', 'deferred', 'disabled'],
            label: 'Auto rasterization',
            onFinishChange: function(value) {
              R.rasterizer.autoRasterization = value;
            }
          },
          rasterizationDelay: {
            "default": 800,
            min: 0,
            max: 10000,
            lable: 'Delay',
            onFinishChange: function(value) {
              R.rasterizer.rasterizationDelay = value;
            }
          },
          rasterizeImmediately: {
            "default": function() {
              R.rasterizer.rasterizeImmediately();
            },
            label: 'Rasterize'
          }
        };
        for (name in parameters) {
          parameter = parameters[name];
          R.controllerManager.createController(name, parameter, this.rasterizerFolder);
        }
      };

      RasterizerManager.prototype.setRasterizerType = function(type) {
        var controller, onFinishChange, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3;
        if (type === Rasterizer.TYPE) {
          _ref = this.rasterizerFolder.datFolder.__controllers;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            controller = _ref[_i];
            if ((_ref1 = controller.property) === 'renderInView' || _ref1 === 'autoRasterization' || _ref1 === 'rasterizationDelay' || _ref1 === 'rasterizeImmediately') {
              $(controller.__li).hide();
            }
          }
        } else {
          _ref2 = this.rasterizerFolder.datFolder.__controllers;
          for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            controller = _ref2[_j];
            $(controller.__li).show();
          }
        }
        R.loader.unload();
        R.rasterizer = this.rasterizers[type];
        _ref3 = this.rasterizerFolder.datFolder.__controllers;
        for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
          controller = _ref3[_k];
          if (R.rasterizer[controller.property] != null) {
            onFinishChange = controller.__onFinishChange;
            controller.__onFinishChange = function() {};
            controller.setValue(R.rasterizer[controller.property]);
            controller.__onFinishChange = onFinishChange;
          }
        }
        R.loader.load();
      };

      RasterizerManager.prototype.hideCanvas = function() {
        R.canvasJ.css({
          opacity: 0
        });
      };

      RasterizerManager.prototype.showCanvas = function() {
        R.canvasJ.css({
          opacity: 1
        });
      };

      RasterizerManager.prototype.hideRasters = function() {
        R.rasterizer.hideRasters();
      };

      RasterizerManager.prototype.showRasters = function() {
        R.rasterizer.showRasters();
      };

      return RasterizerManager;

    })();
    return RasterizerManager;
  });

}).call(this);