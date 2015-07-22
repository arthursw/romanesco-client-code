// Generated by CoffeeScript 1.7.1
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define([], function() {
    var FontManager;
    FontManager = (function() {
      function FontManager() {
        this.initializeTextOptions = __bind(this.initializeTextOptions, this);
        this.loadFonts = __bind(this.loadFonts, this);
        var jqxhr;
        this.availableFonts = [];
        this.usedFonts = [];
        jQuery.support.cors = true;
        jqxhr = $.getJSON("https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBVfBj_ugQO_w0AK1x9F6yiXByhcNgjQZU", this.initTextOptions);
        jqxhr.done((function(_this) {
          return function(json) {
            console.log('done');
            _this.initializeTextOptions(json);
          };
        })(this));
        jqxhr.fail(function(jqxhr, textStatus, error) {
          var err;
          err = textStatus + ", " + error;
          console.log('failed: ' + err);
        });
        jqxhr.always(function(jqxhr, textStatus, error) {
          var err;
          err = textStatus + ", " + error;
          console.log('always: ' + err);
        });
        return;
      }

      FontManager.prototype.addFont = function(fontFamily, effect) {
        var effects, font, fontAlreadyUsed, fontFamilyURL, _i, _len, _ref;
        if (fontFamily == null) {
          return;
        }
        fontFamilyURL = fontFamily.split(" ").join("+");
        fontAlreadyUsed = false;
        _ref = this.usedFonts;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          font = _ref[_i];
          if (font.family === fontFamilyURL) {
            if (font.effects.indexOf(effect) === -1 && (effect != null)) {
              font.effects.push(effect);
            }
            fontAlreadyUsed = true;
            break;
          }
        }
        if (!fontAlreadyUsed) {
          effects = [];
          if (effect != null) {
            effects.push(effect);
          }
          if (!fontFamilyURL || fontFamilyURL === '') {
            console.log('ERROR: font family URL is null or empty');
          }
          this.usedFonts.push({
            family: fontFamilyURL,
            effects: effects
          });
        }
      };

      FontManager.prototype.loadFonts = function() {
        var effect, font, fontLink, i, newFont, _i, _j, _len, _len1, _ref, _ref1;
        $('head').remove("link.fonts");
        _ref = this.usedFonts;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          font = _ref[_i];
          newFont = font.family;
          if ($('head').find('link[data-font-family="' + font.family + '"]').length === 0) {
            if (font.effects.length > 0 && !(font.effects.length === 1 && font.effects[0] === 'none')) {
              newFont += "&effect=";
              _ref1 = font.effects;
              for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
                effect = _ref1[i];
                newFont += effect + '|';
              }
              newFont = newFont.slice(0, -1);
            }
            fontLink = $('<link class="fonts" data-font-family="' + font.family + '" rel="stylesheet" type="text/css">');
            fontLink.attr('href', "http://fonts.googleapis.com/css?family=" + newFont);
            $('head').append(fontLink);
          }
        }
      };

      FontManager.prototype.initializeTextOptions = function(data, textStatus, jqXHR) {
        var fontFamilyNames, item, promise, _i, _len, _ref;
        fontFamilyNames = [];
        _ref = data.items;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          fontFamilyNames.push({
            value: item.family
          });
        }
        this.typeaheadFontEngine = new Bloodhound({
          name: 'Font families',
          local: fontFamilyNames,
          datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
          queryTokenizer: Bloodhound.tokenizers.whitespace
        });
        promise = this.typeaheadFontEngine.initialize();
        this.availableFonts = data.items;
      };

      return FontManager;

    })();
    return FontManager;
  });

}).call(this);