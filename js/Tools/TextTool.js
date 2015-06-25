// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['Tools/Tool'], function(Tool) {
    var TextTool;
    TextTool = (function(_super) {
      __extends(TextTool, _super);

      TextTool.label = 'Text';

      TextTool.description = '';

      TextTool.iconURL = 'text.png';

      TextTool.cursor = {
        position: {
          x: 0,
          y: 0
        },
        name: 'crosshair'
      };

      function TextTool() {
        TextTool.__super__.constructor.call(this, Text);
        return;
      }

      TextTool.prototype.end = function(event, from) {
        var text;
        if (from == null) {
          from = R.me;
        }
        if (TextTool.__super__.end.call(this, event, from)) {
          text = new R.Text(R.currentPaths[from].bounds);
          text.finish();
          if (!text.group) {
            return;
          }
          text.select();
          text.save(true);
          delete R.currentPaths[from];
        }
      };

      return TextTool;

    })(Tool.Item);
    Tool.Text = TextTool;
    return TextTool;
  });

}).call(this);

//# sourceMappingURL=TextTool.map
