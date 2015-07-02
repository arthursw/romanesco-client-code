// Generated by CoffeeScript 1.7.1
(function() {
  var libs;

  libs = '../../libs/';

  requirejs.config({
    baseUrl: '../static/romanesco-client-code/js',
    paths: {
      'domReady': ['//cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.min', libs + 'domReady'],
      'ace': ['//cdnjs.cloudflare.com/ajax/libs/ace/1.1.9/', libs + 'ace/src-min-noconflict/'],
      'underscore': ['//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min', libs + 'underscore-min'],
      'jquery': ['//code.jquery.com/jquery-2.1.3.min', 'libs/jquery-2.1.3.min'],
      'jqueryUi': ['//code.jquery.com/ui/1.11.4/jquery-ui.min', libs + 'jquery-ui.min'],
      'mousewheel': ['//cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.12/jquery.mousewheel.min', libs + 'jquery.mousewheel.min'],
      'scrollbar': ['//cdnjs.cloudflare.com/ajax/libs/malihu-custom-scrollbar-plugin/3.0.8/jquery.mCustomScrollbar.min', libs + 'jquery.mCustomScrollbar.min'],
      'tinycolor': ['//cdnjs.cloudflare.com/ajax/libs/tinycolor/1.1.2/tinycolor.min', libs + 'tinycolor.min'],
      'prefix': ['//cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min'],
      'bootstrap': ['//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min', libs + 'bootstrap.min'],
      'paper': ['//cdnjs.cloudflare.com/ajax/libs/paper.js/0.9.22/paper-full', libs + 'paper-full'],
      'gui': ['//cdnjs.cloudflare.com/ajax/libs/dat-gui/0.5/dat.gui', libs + 'dat.gui.min'],
      'typeahead': ['//cdnjs.cloudflare.com/ajax/libs/typeahead.js/0.10.4/typeahead.bundle.min', libs + 'typeahead.bundle.min'],
      'pinit': ['//assets.pinterest.com/js/pinit', libs + 'pinit'],
      'zeroClipboard': ['//cdnjs.cloudflare.com/ajax/libs/zeroclipboard/2.2.0/ZeroClipboard.min', libs + 'ZeroClipboard.min'],
      'colorpickersliders': libs + 'bootstrap-colorpickersliders/bootstrap.colorpickersliders.nocielch',
      'requestAnimationFrame': libs + 'RequestAnimationFrame',
      'coffee': libs + 'coffee-script',
      'tween': libs + 'tween.min',
      'socketio': libs + 'socket.io',
      'oembed': libs + 'jquery.oembed',
      'jqtree': libs + 'jqtree/tree.jquery',
      'js-cookie': libs + 'js.cookie',
      'octokat': libs + 'octokat'
    },
    shim: {
      'oembed': ['jquery'],
      'mousewheel': ['jquery'],
      'scrollbar': ['jquery'],
      'jqueryUi': ['jquery'],
      'bootstrap': ['jquery'],
      'typeahead': ['jquery'],
      'js-cookie': ['jquery'],
      'jqtree': ['jquery'],
      'colorpickersliders': {
        deps: ['jquery', 'tinycolor']
      },
      'underscore': {
        exports: '_'
      },
      'jquery': {
        exports: '$'
      }
    }
  });

  window.R = {};

  window.P = {};

  R.DajaxiceXMLHttpRequest = window.XMLHttpRequest;

  window.XMLHttpRequest = window.RXMLHttpRequest;

  requirejs(['main']);

}).call(this);
