// Generated by CoffeeScript 1.7.1
(function() {
  define(['Utils/Utils'], function() {
    var Folder;
    Folder = (function() {
      function Folder(name, closedByDefault, parentFolder) {
        this.name = name;
        if (closedByDefault == null) {
          closedByDefault = false;
        }
        this.parentFolder = parentFolder;
        this.controllers = {};
        this.folders = {};
        if (!this.parentFolder) {
          R.controllerManager.folders[this.name] = this;
          this.datFolder = R.gui.addFolder(this.name);
        } else {
          this.parentFolder.folders[this.name] = this;
          this.datFolder = this.parentFolder.datFolder.addFolder(this.name);
        }
        if (!closedByDefault) {
          this.datFolder.open();
        }
        return;
      }

      Folder.prototype.remove = function() {
        var controller, folder, name, _ref, _ref1;
        _ref = this.controllers;
        for (name in _ref) {
          controller = _ref[name];
          controller.remove();
          delete this.controller[name];
        }
        _ref1 = this.folders;
        for (name in _ref1) {
          folder = _ref1[name];
          folder.remove();
          delete this.folders[name];
        }
        this.datFolder.close();
        $(this.datFolder.domElement).parent().remove();
        delete this.datFolder.parent.__folders[this.datFolder.name];
        R.gui.onResize();
        delete R.controllerManager.folders[this.name];
      };

      return Folder;

    })();
    return Folder;
  });

}).call(this);