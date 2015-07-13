// Generated by CoffeeScript 1.7.1
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['coffee', 'jqtree'], function(CoffeeScript) {
    var FileManager;
    FileManager = (function() {
      function FileManager() {
        this.registerModuleInModuleLoader = __bind(this.registerModuleInModuleLoader, this);
        this.onFileMoved = __bind(this.onFileMoved, this);
        this.loadAndOpenFile = __bind(this.loadAndOpenFile, this);
        this.readTree = __bind(this.readTree, this);
        this.loadTree = __bind(this.loadTree, this);
        this.createFork = __bind(this.createFork, this);
        this.forkCreationResponse = __bind(this.forkCreationResponse, this);
        this.loadCustomFork = __bind(this.loadCustomFork, this);
        this.loadFork = __bind(this.loadFork, this);
        this.loadOwnFork = __bind(this.loadOwnFork, this);
        this.loadMainRepo = __bind(this.loadMainRepo, this);
        this.listForks = __bind(this.listForks, this);
        this.displayForks = __bind(this.displayForks, this);
        this.forkRowClicked = __bind(this.forkRowClicked, this);
        this.getUserFork = __bind(this.getUserFork, this);
        this.codeJ = $('#Code');
        this.loadMainRepoBtnJ = this.codeJ.find('button.main-repository');
        this.loadOwnForkBtnJ = this.codeJ.find('li.user-fork > a');
        this.listForksBtnJ = this.codeJ.find('li.list-forks > a');
        this.loadCustomForkBtnJ = this.codeJ.find('li.custom-fork > a');
        this.createForkBtnJ = this.codeJ.find('li.create-fork > a');
        this.loadOwnForkBtnJ.hide();
        this.createForkBtnJ.hide();
        this.getForks(this.getUserFork);
        this.loadMainRepoBtnJ.click(this.loadMainRepo);
        this.loadOwnForkBtnJ.click(this.loadOwnFork);
        this.loadCustomForkBtnJ.click(this.loadCustomFork);
        this.listForksBtnJ.click(this.listForks);
        this.createForkBtnJ.click(this.createFork);
        this.fileBrowserJ = this.codeJ.find('.files');
        this.files = [];
        this.nDirsToLoad = 1;
        this.loadMainRepo();
        return;
      }

      FileManager.prototype.getUserFork = function(forks) {
        var fork, hasFork, _i, _len;
        hasFork = false;
        for (_i = 0, _len = forks.length; _i < _len; _i++) {
          fork = forks[_i];
          if (fork.owner.login === R.me) {
            this.loadOwnForkBtnJ.show();
            this.createForkBtnJ.hide();
            hasFork = true;
            break;
          }
        }
        if (!hasFork) {
          this.loadOwnForkBtnJ.hide();
          this.createForkBtnJ.show();
        }
      };

      FileManager.prototype.getForks = function(callback) {
        this.request('https://api.github.com/repos/arthursw/romanesco-client-code/forks/', callback);
      };

      FileManager.prototype.forkRowClicked = function(event) {
        this.loadFork($(event.target.attr('full_name')));
      };

      FileManager.prototype.displayForks = function(forks) {
        var fork, modal, _i, _len;
        modal = Modal.createModal({
          title: 'Forks',
          submit: null
        });
        modal.initializeTable();
        for (_i = 0, _len = forks.length; _i < _len; _i++) {
          fork = forks[_i];
          modal.addTableRow(fork.full_name, {
            click: forkRowClicked
          });
        }
        modal.show();
      };

      FileManager.prototype.listForks = function(event) {
        if (event != null) {
          event.preventDefault();
        }
        this.getForks(this.displayForks);
      };

      FileManager.prototype.loadMainRepo = function(event) {
        if (event != null) {
          event.preventDefault();
        }
        this.request('https://api.github.com/repos/arthursw/romanesco-client-code/contents/', this.loadTree);
      };

      FileManager.prototype.loadOwnFork = function(event) {
        if (event != null) {
          event.preventDefault();
        }
        this.request('https://api.github.com/repos/arthursw/romanesco-client-code/contents/', this.loadTree);
      };

      FileManager.prototype.loadFork = function(data) {
        this.request('https://api.github.com/repos/' + data.user + '/romanesco-client-code/contents/', this.loadTree);
      };

      FileManager.prototype.loadCustomFork = function(event) {
        var modal;
        if (event != null) {
          event.preventDefault();
        }
        modal = Modal.createModal({
          title: 'Load repository',
          submit: this.loadFork
        });
        modal.addTextInput({
          name: 'user',
          placeholder: 'The login name of the fork owner (ex: george)',
          label: 'Owner',
          required: true
        });
        modal.show();
      };

      FileManager.prototype.forkCreationResponse = function(response) {
        var message;
        if (response.status === 202) {
          message = 'Congratulation, you just made a new fork!';
          message += 'It should be available in a few seconds at this adress:' + response.url;
          message += 'You will then be able to improve or customize it.';
          R.alertManager.alert(message, 'success');
        }
      };

      FileManager.prototype.createFork = function(event) {
        if (event != null) {
          event.preventDefault();
        }
        this.request('https://api.github.com/repos/' + R.user.githubLogin + '/romanesco-client-code/forks/', this.forkCreationResponse, 'post');
      };

      FileManager.prototype.request = function(request, callback, method, params, headers) {
        Dajaxice.draw.githubRequest(callback, {
          githubRequest: request
        });
      };

      FileManager.prototype.createFile = function() {};

      FileManager.prototype.updateFile = function() {};

      FileManager.prototype.deleteFile = function() {};

      FileManager.prototype.getParentNode = function(file, node) {
        var dirName, dirs, i, _base, _i, _len;
        dirs = file.path.split('/');
        file.name = dirs.pop();
        for (i = _i = 0, _len = dirs.length; _i < _len; i = ++_i) {
          dirName = dirs[i];
          if ((_base = node.children)[dirName] == null) {
            _base[dirName] = {
              children: {}
            };
          }
          node = node.children[dirName];
        }
        return node;
      };

      FileManager.prototype.buildTree = function(files) {
        var file, node, tree, _base, _i, _len, _name;
        tree = {
          children: {}
        };
        for (_i = 0, _len = files.length; _i < _len; _i++) {
          file = files[_i];
          node = tree;
          node = this.getParentNode(file, node);
          if ((_base = node.children)[_name = file.name] == null) {
            _base[_name] = {
              children: {}
            };
          }
          node.children[file.name].type = file.type;
          node.children[file.name].path = file.path;
        }
        return tree;
      };

      FileManager.prototype.buildJqTree = function(tree, jqTree) {
        var jqTreeNode, name, node, _ref;
        _ref = tree.children;
        for (name in _ref) {
          node = _ref[name];
          jqTreeNode = {
            label: name,
            type: node.type,
            path: node.path,
            children: []
          };
          node.jqTreeNode = jqTreeNode;
          jqTree.children.push(jqTreeNode);
          this.buildJqTree(node, jqTreeNode);
        }
      };

      FileManager.prototype.loadTree = function(content) {
        var file, _i, _len;
        for (_i = 0, _len = content.length; _i < _len; _i++) {
          file = content[_i];
          if (file.name === 'coffee') {
            this.request(file.git_url + '?recursive=1', this.readTree);
            break;
          }
        }
      };

      FileManager.prototype.readTree = function(content) {
        var jqTreeData;
        this.tree = this.buildTree(content.tree);
        jqTreeData = {
          children: []
        };
        this.buildJqTree(this.tree, jqTreeData);
        this.fileBrowserJ.tree({
          data: jqTreeData.children,
          autoOpen: true,
          dragAndDrop: true,
          onCanMoveTo: function(moved_node, target_node, position) {
            return target_node.type === 'tree' || position !== 'inside';
          }
        });
        this.fileBrowserJ.bind('tree.click', this.loadAndOpenFile);
        this.fileBrowserJ.bind('tree.move', this.onFileMoved);
      };

      FileManager.prototype.loadAndOpenFile = function(event) {
        if (event.node.type === 'tree') {
          this.fileBrowserJ.tree('toggle', event.node);
          return;
        }
        this.loadFile(event.node.path, this.openFile);
      };

      FileManager.prototype.openFile = function(content) {
        R.showCodeEditor(atob(content.content));
      };

      FileManager.prototype.onFileMoved = function(event) {
        console.log('moved_node', event.move_info.moved_node);
        console.log('target_node', event.move_info.target_node);
        console.log('position', event.move_info.position);
        console.log('previous_parent', event.move_info.previous_parent);
      };

      FileManager.prototype.loadFile = function(path, callback) {
        this.request('https://api.github.com/repos/arthursw/romanesco-client-code/contents/coffee/' + path, callback);
      };

      FileManager.prototype.createButton = function(content) {
        var category, description, expressions, file, iconURL, label, name, properties, property, source, value, _i, _len, _ref, _ref1, _ref10, _ref11, _ref12, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
        source = atob(content.content);
        expressions = CoffeeScript.nodes(source).expressions;
        properties = (_ref = expressions[0]) != null ? (_ref1 = _ref.args) != null ? (_ref2 = _ref1[1]) != null ? (_ref3 = _ref2.body) != null ? (_ref4 = _ref3.expressions) != null ? (_ref5 = _ref4[0]) != null ? (_ref6 = _ref5.body) != null ? _ref6.expressions : void 0 : void 0 : void 0 : void 0 : void 0 : void 0 : void 0;
        if (properties == null) {
          return;
        }
        for (_i = 0, _len = properties.length; _i < _len; _i++) {
          property = properties[_i];
          name = (_ref7 = property.variable) != null ? (_ref8 = _ref7.properties) != null ? (_ref9 = _ref8[0]) != null ? (_ref10 = _ref9.name) != null ? _ref10.value : void 0 : void 0 : void 0 : void 0;
          value = (_ref11 = property.value) != null ? (_ref12 = _ref11.base) != null ? _ref12.value : void 0 : void 0;
          if (!((value != null) && (name != null))) {
            continue;
          }
          switch (name) {
            case 'label':
              label = value;
              break;
            case 'description':
              description = value;
              break;
            case 'iconURL':
              iconURL = value;
              break;
            case 'category':
              category = value;
          }
        }

        /*
        			iconResult = /@iconURL = (\'|\"|\"\"\")(.*)(\'|\"|\"\"\")/.exec(source)
        
        			if iconResult? and iconResult.length>=2
        				iconURL = iconResult[2]
        
        			descriptionResult = /@description = (\'|\"|\"\"\")(.*)(\'|\"|\"\"\")/.exec(source)
        
        			if descriptionResult? and descriptionResult.length>=2
        				description = descriptionResult[2]
        
        			labelResult = /@label = (\'|\"|\"\"\")(.*)(\'|\"|\"\"\")/.exec(source)
        
        			if labelResult? and labelResult.length>=2
        				label = labelResult[2]
         */
        file = content.path.replace('coffee/', '');
        file = '"' + file.replace('.coffee', '') + '"';
        console.log('{ name: ' + label + ', popoverContent: ' + description + ', iconURL: ' + iconURL + ', file: ' + file + ', category: ' + category + ' }');
      };

      FileManager.prototype.createButtons = function(pathDirectory) {
        var name, node, _ref;
        _ref = pathDirectory.children;
        for (name in _ref) {
          node = _ref[name];
          if (node.type !== 'tree') {
            this.loadFile(node.path, this.createButton);
          } else {
            this.createButtons(node);
          }
        }
      };

      FileManager.prototype.loadButtons = function() {
        this.createButtons(this.tree.children['Items'].children['Paths']);
      };

      FileManager.prototype.registerModule = function(module) {
        this.module = module;
        this.loadFile(this.tree.children['ModuleLoader'].path, this.registerModuleInModuleLoader);
      };

      FileManager.prototype.insertModule = function(source, module, position) {
        var line;
        line = JSON.stringify(module);
        source.insert(line, position);
      };

      FileManager.prototype.registerModuleInModuleLoader = function(content) {
        var buttonsResult, source;
        source = atob(content.content);
        buttonsResult = /buttons = \[/.exec(source);
        if ((buttonsResult != null) && buttonsResult.length > 1) {
          this.insertModule(source, this.module, buttonsResult[1]);
        }
      };

      return FileManager;

    })();
    return FileManager;
  });

}).call(this);
