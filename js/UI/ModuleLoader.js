// Generated by CoffeeScript 1.7.1
(function() {
  define(['UI/Sidebar'], function(Button) {
    var b, button, buttons, _i, _len, _results;
    buttons = [
      {
        name: 'Geometric lines',
        file: 'Geometriclines',
        icon: 'static/images/icons/inverted/links.png',
        favorite: true,
        category: 'Paths'
      }
    ];
    _results = [];
    for (_i = 0, _len = buttons.length; _i < _len; _i++) {
      button = buttons[_i];
      _results.push(b = new Button(button));
    }
    return _results;
  });

  return;

}).call(this);

//# sourceMappingURL=ModuleLoader.map
