// Generated by CoffeeScript 1.7.1
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['Items/Paths/Shapes/Shape'], function(Shape) {
    var StripeAnimation;
    StripeAnimation = (function(_super) {
      __extends(StripeAnimation, _super);

      function StripeAnimation() {
        this.onFrame = __bind(this.onFrame, this);
        this.rasterLoaded = __bind(this.rasterLoaded, this);
        return StripeAnimation.__super__.constructor.apply(this, arguments);
      }

      StripeAnimation.Shape = P.Path.Rectangle;

      StripeAnimation.label = 'Stripe animation';

      StripeAnimation.description = "Creates a stripe animation from a set sequence of image.";

      StripeAnimation.squareByDefault = false;

      StripeAnimation.initializeParameters = function() {
        var parameters;
        parameters = StripeAnimation.__super__.constructor.initializeParameters.call(this);
        if (parameters['Parameters'] == null) {
          parameters['Parameters'] = {};
        }
        parameters['Parameters'].stripeWidth = {
          type: 'slider',
          label: 'Stripe width',
          min: 1,
          max: 5,
          "default": 1
        };
        parameters['Parameters'].maskWidth = {
          type: 'slider',
          label: 'Mask width',
          min: 1,
          max: 4,
          "default": 1
        };
        parameters['Parameters'].speed = {
          type: 'slider',
          label: 'Speed',
          min: 0.01,
          max: 1.0,
          "default": 0.1
        };
        return parameters;
      };

      StripeAnimation.parameters = StripeAnimation.initializeParameters();

      StripeAnimation.createTool(StripeAnimation);

      StripeAnimation.prototype.initialize = function() {
        var dropZone, handleDragOver, handleFileSelect, modalBodyJ, modalContentJ;
        this.data.animate = true;
        this.setAnimated(this.data.animate);
        this.modalJ = $('#customModal');
        modalBodyJ = this.modalJ.find('.modal-body');
        modalBodyJ.empty();
        modalContentJ = $("<div id=\"stripeAnimationContent\" class=\"form-group url-group\">\n	                <label for=\"stripeAnimationModalURL\">Add your images</label>\n	                <input id=\"stripeAnimationFileInput\" type=\"file\" class=\"form-control\" name=\"files[]\" multiple/>\n	                <div id=\"stripeAnimationDropZone\">Drop your image files here.</div>\n	                <div id=\"stripeAnimationGallery\"></div>\n	            </div>");
        modalBodyJ.append(modalContentJ);
        this.modalJ.modal('show');
        if (window.File && window.FileReader && window.FileList && window.Blob) {
          console.log('File upload supported');
        } else {
          console.log('File upload not supported');
          R.alertManager.alert('File upload not supported', 'error');
        }
        handleFileSelect = (function(_this) {
          return function(evt) {
            var f, files, i, reader, _ref, _ref1;
            evt.stopPropagation();
            evt.preventDefault();
            files = ((_ref = evt.dataTransfer) != null ? _ref.files : void 0) || ((_ref1 = evt.target) != null ? _ref1.files : void 0);
            _this.nRasterToLoad = files.length;
            _this.nRasterLoaded = 0;
            _this.rasters = [];
            i = 0;
            f = void 0;
            while (f = files[i]) {
              if (!f.type.match('image.*')) {
                i++;
                continue;
              }
              reader = new FileReader;
              reader.onload = (function(theFile, stripeAnimation) {
                return function(e) {
                  var span;
                  span = document.createElement('span');
                  span.innerHTML = ['<img class="thumb" src="', e.target.result, '" title="', escape(theFile.name), '"/>'].join('');
                  $("#stripeAnimationGallery").append(span);
                  stripeAnimation.rasters.push(new P.Raster(e.target.result));
                  stripeAnimation.nRasterLoaded++;
                  if (stripeAnimation.nRasterLoaded === stripeAnimation.nRasterToLoad) {
                    stripeAnimation.rasterLoaded();
                  }
                };
              })(f, _this);
              reader.readAsDataURL(f);
              i++;
            }
          };
        })(this);
        $("#stripeAnimationFileInput").change(handleFileSelect);
        handleDragOver = function(evt) {
          evt.stopPropagation();
          evt.preventDefault();
          evt.dataTransfer.dropEffect = 'copy';
        };
        dropZone = document.getElementById('stripeAnimationDropZone');
        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('drop', handleFileSelect, false);
      };

      StripeAnimation.prototype.rasterLoaded = function() {
        var black, blackStripeWidth, i, n, nStripes, nVisibleFrames, position, raster, size, stripeData, stripesContext, transparent, width, _i, _j, _k, _len, _len1, _ref, _ref1;
        if ((this.rasters == null) || this.rasters.length === 0) {
          return;
        }
        if (this.nRasterLoaded !== this.nRasterToLoad) {
          return;
        }
        this.minSize = new P.Size();
        _ref = this.rasters;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          raster = _ref[_i];
          if (this.minSize.width === 0 || raster.width < this.minSize.width) {
            this.minSize.width = raster.width;
          }
          if (this.minSize.height === 0 || raster.height < this.minSize.height) {
            this.minSize.height = raster.height;
          }
        }
        _ref1 = this.rasters;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          raster = _ref1[_j];
          raster.size = this.minSize;
        }
        size = this.rasters[0].size;
        this.result = new P.Raster();
        this.result.position = this.rectangle.center;
        this.result.size = size;
        this.result.name = 'stripe animation raster';
        this.result.controller = this;
        this.drawing.addChild(this.result);
        this.stripes = new P.Raster();
        this.stripes.size = new P.Size(size.width * 2, size.height);
        this.stripes.position = this.rectangle.center;
        this.stripes.name = 'stripe mask raster';
        this.stripes.controller = this;
        this.drawing.addChild(this.stripes);
        n = this.rasters.length;
        width = this.data.stripeWidth;
        black = new Color(0, 0, 0);
        transparent = new Color(0, 0, 0, 0);
        nStripes = Math.floor(size.width / width);
        for (i = _k = 0; 0 <= nStripes ? _k <= nStripes : _k >= nStripes; i = 0 <= nStripes ? ++_k : --_k) {
          stripeData = this.rasters[i % n].getImageData(new P.Rectangle(i * width, 0, width, size.height));
          this.result.setImageData(stripeData, new P.Point(i * width, 0));
        }
        stripesContext = this.stripes.canvas.getContext("2d");
        stripesContext.fillStyle = "rgb(0, 0, 0)";
        nVisibleFrames = Math.min(this.data.maskWidth, n - 1);
        blackStripeWidth = width * (n - nVisibleFrames);
        position = nVisibleFrames * width;
        while (position < this.stripes.width) {
          stripesContext.fillRect(position, 0, blackStripeWidth, size.height);
          position += width * n;
        }
      };

      StripeAnimation.prototype.createShape = function() {
        this.rasterLoaded();
      };

      StripeAnimation.prototype.onFrame = function(event) {
        if (this.stripes == null) {
          return;
        }
        this.stripes.position.x -= this.data.speed;
        if (this.stripes.bounds.center.x < this.rectangle.left) {
          this.stripes.bounds.center.x = this.rectangle.right;
        }
      };

      return StripeAnimation;

    })(Shape);
    return StripeAnimation;
  });

}).call(this);

//# sourceMappingURL=StripeAnimation.map
