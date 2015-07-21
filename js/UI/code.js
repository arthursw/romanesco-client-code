// Generated by CoffeeScript 1.7.1
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['UI/Modal', 'coffee', 'jqtree'], function(Modal, CoffeeScript) {
    var FileManager;
    FileManager = (function() {
      function FileManager() {
        this.registerModuleInModuleLoader = __bind(this.registerModuleInModuleLoader, this);
        this.createPullRequestSubmit = __bind(this.createPullRequestSubmit, this);
        this.createPullRequest = __bind(this.createPullRequest, this);
        this.commit = __bind(this.commit, this);
        this.onCommitClicked = __bind(this.onCommitClicked, this);
        this.runFork = __bind(this.runFork, this);
        this.runLastCommit = __bind(this.runLastCommit, this);
        this.onDeleteFile = __bind(this.onDeleteFile, this);
        this.onFileMoved = __bind(this.onFileMoved, this);
        this.onCreateFile = __bind(this.onCreateFile, this);
        this.openFile = __bind(this.openFile, this);
        this.onNodeDoubleClicked = __bind(this.onNodeDoubleClicked, this);
        this.submitNewName = __bind(this.submitNewName, this);
        this.onNodeClicked = __bind(this.onNodeClicked, this);
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
        this.runForkBtnJ = this.codeJ.find('button.run-fork');
        this.loadOwnForkBtnJ = this.codeJ.find('li.user-fork');
        this.listForksBtnJ = this.codeJ.find('li.list-forks');
        this.loadCustomForkBtnJ = this.codeJ.find('li.custom-fork');
        this.createForkBtnJ = this.codeJ.find('li.create-fork');
        this.loadOwnForkBtnJ.hide();
        this.createForkBtnJ.hide();
        this.getForks(this.getUserFork);
        this.runForkBtnJ.click(this.runFork);
        this.loadOwnForkBtnJ.click(this.loadOwnFork);
        this.loadCustomForkBtnJ.click(this.loadCustomFork);
        this.listForksBtnJ.click(this.listForks);
        this.createForkBtnJ.click(this.createFork);
        this.createFileBtnJ = this.codeJ.find('button.create-file');
        this.runBtnJ = this.codeJ.find('button.run');
        this.commitBtnJ = this.codeJ.find('button.commit');
        this.createPullRequestBtnJ = this.codeJ.find('button.pull-request');
        this.createFileBtnJ.click(this.onCreateFile);
        this.runBtnJ.click(this.runFork);
        this.commitBtnJ.click(this.onCommitClicked);
        this.createPullRequestBtnJ.click(this.createPullRequest);
        this.fileBrowserJ = this.codeJ.find('.files');
        this.files = [];
        this.nDirsToLoad = 1;
        if (R.repositoryOwner != null) {
          this.loadFork({
            owner: R.repositoryOwner
          });
        } else {
          this.loadMainRepo();
        }
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
        this.request('https://api.github.com/repos/arthursw/romanesco-client-code/forks', callback);
      };

      FileManager.prototype.forkRowClicked = function(event, field, value, row, $element) {
        this.loadFork(row);
        Modal.getModalByTitle('Forks').hide();
      };

      FileManager.prototype.displayForks = function(forks) {
        var date, fork, modal, tableData, tableJ, _i, _len;
        modal = Modal.createModal({
          title: 'Forks',
          submit: null
        });
        tableData = {
          columns: [
            {
              field: 'owner',
              title: 'Owner'
            }, {
              field: 'date',
              title: 'Date'
            }, {
              field: 'githubURL',
              title: 'Github URL'
            }
          ],
          data: [],
          formatter: function(value, row, index) {
            return "<a href='" + value + "'>value</a>";
          }
        };
        for (_i = 0, _len = forks.length; _i < _len; _i++) {
          fork = forks[_i];
          date = new Date(fork.updated_at);
          tableData.data.push({
            owner: fork.owner.login,
            date: date.toLocaleString(),
            githubURL: fork.html_url
          });
        }
        tableJ = modal.addTable(tableData);
        tableJ.on('click-cell.bs.table', this.forkRowClicked);
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
        this.loadFork({
          owner: 'arthursw'
        });
      };

      FileManager.prototype.loadOwnFork = function(event) {
        if (event != null) {
          event.preventDefault();
        }
        this.loadFork({
          owner: R.githubLogin
        });
      };

      FileManager.prototype.loadFork = function(data) {
        this.owner = data.owner;
        this.request('https://api.github.com/repos/' + this.owner + '/romanesco-client-code/contents/', this.loadTree);
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
          name: 'owner',
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
        this.request('https://api.github.com/repos/' + R.githubLogin + '/romanesco-client-code/forks', this.forkCreationResponse, 'post');
      };

      FileManager.prototype.request = function(request, callback, method, data, params, headers) {
        Dajaxice.draw.githubRequest(callback, {
          githubRequest: request,
          method: method,
          data: data,
          params: params,
          headers: headers
        });
      };

      FileManager.prototype.getNodeFromPath = function(path) {
        var dirName, dirs, i, node, _i, _len;
        dirs = path.split('/');
        node = this.tree;
        for (i = _i = 0, _len = dirs.length; _i < _len; i = ++_i) {
          dirName = dirs[i];
          node = node.leaves[dirName];
        }
        return node;
      };

      FileManager.prototype.getParentNode = function(file, node) {
        var dirName, dirs, i, _base, _i, _len;
        dirs = file.path.split('/');
        file.name = dirs.pop();
        for (i = _i = 0, _len = dirs.length; _i < _len; i = ++_i) {
          dirName = dirs[i];
          if ((_base = node.leaves)[dirName] == null) {
            _base[dirName] = {
              leaves: {},
              children: []
            };
          }
          node = node.leaves[dirName];
        }
        return node;
      };

      FileManager.prototype.buildTree = function(files) {
        var file, i, name, node, parentNode, tree, _base, _i, _len;
        tree = {
          leaves: {},
          children: []
        };
        for (i = _i = 0, _len = files.length; _i < _len; i = ++_i) {
          file = files[i];
          parentNode = this.getParentNode(file, tree);
          name = file.name;
          if ((_base = parentNode.leaves)[name] == null) {
            _base[name] = {
              leaves: {},
              children: []
            };
          }
          node = parentNode.leaves[name];
          node.type = file.type;
          node.path = file.path;
          node.sha = file.sha;
          node.label = name;
          node.id = i;
          parentNode.children.push(node);
        }
        tree.id = i;
        return tree;
      };

      FileManager.prototype.updateTree = function(tree) {
        var i, node, _i, _len, _ref;
        if (tree == null) {
          tree = this.tree;
        }
        tree.leaves = {};
        _ref = tree.children;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          node = _ref[i];
          tree.leaves[node.name] = node;
          this.updateTree(node);
        }
      };

      FileManager.prototype.loadTree = function(content) {
        var btnName, file, _i, _len;
        for (_i = 0, _len = content.length; _i < _len; _i++) {
          file = content[_i];
          if (file.name === 'coffee') {
            this.request(file.git_url + '?recursive=1', this.readTree);
            break;
          }
        }
        btnName = this.owner !== 'arthursw' ? this.owner : 'Main repository';
        this.runForkBtnJ.text(btnName);
      };

      FileManager.prototype.onCanMoveTo = function(moved_node, target_node, position) {
        var nameExistsInTargetNode, targetIsFolder;
        targetIsFolder = target_node.type === 'tree';
        nameExistsInTargetNode = target_node.leaves[moved_node.name] != null;
        return (targetIsFolder && !nameExistsInTargetNode) || position !== 'inside';
      };

      FileManager.prototype.onCreateLi = function(node, liJ) {
        var deleteButtonJ;
        deleteButtonJ = $("<button type=\"button\" class=\"close delete\" aria-label=\"Close\">\n	<span aria-hidden=\"true\">&times;</span>\n</button>");
        deleteButtonJ.attr('data-path', node.path);
        deleteButtonJ.click(this.onDeleteFile);
        liJ.find('.jqtree-element').append(deleteButtonJ);
      };

      FileManager.prototype.readTree = function(content) {
        var treeExists;
        treeExists = this.tree != null;
        this.tree = this.buildTree(content.tree);
        if (treeExists) {
          this.fileBrowserJ.tree('loadData', this.tree.children);
        } else {
          this.fileBrowserJ.tree({
            data: this.tree.children,
            autoOpen: true,
            dragAndDrop: true,
            onCanMoveTo: this.onCanMoveTo,
            onCreateLi: this.onCreateLi
          });
          this.fileBrowserJ.bind('tree.click', this.onNodeClicked);
          this.fileBrowserJ.bind('tree.dblclick', this.onNodeDoubleClicked);
          this.fileBrowserJ.bind('tree.move', this.onFileMoved);
        }
        this.tree = this.fileBrowserJ.tree('getTree');
        this.tree.path = '';
        this.updateTree();
        this.load();
      };

      FileManager.prototype.onNodeClicked = function(event) {
        var elementIsTitle, elementIsToggler;
        if (event.node.type === 'tree') {
          elementIsToggler = $(event.click_event.target).hasClass('jqtree-toggler');
          elementIsTitle = $(event.click_event.target).hasClass('jqtree-title-folder');
          if (elementIsToggler || elementIsTitle) {
            this.fileBrowserJ.tree('toggle', event.node);
          }
          return;
        }
        if (event.node.source != null) {
          R.showCodeEditor(event.node);
        } else {
          this.loadFile(event.node.path, this.openFile);
        }
      };

      FileManager.prototype.submitNewName = function(event) {
        var id, inputGroupJ, newName, node;
        if (event.type === 'keyup' && event.which !== 13) {
          return;
        }
        inputGroupJ = $(event.target).parents('.input-group');
        newName = inputGroupJ.find('.name-input').val();
        id = inputGroupJ.attr('data-node-id');
        node = this.fileBrowserJ.tree('getNodeById', id);
        if (newName === '') {
          newName = node.name;
        }
        inputGroupJ.replaceWith('<span class="jqtree-title jqtree_common">' + newName + '</span>');
        $(node.element).find('button.delete:first').show();
        delete node.parent.leaves[node.name];
        node.parent.leaves[newName] = node;
        node.newPath = node.path.replace(node.name, newName);
        node.name = newName;
      };

      FileManager.prototype.onNodeDoubleClicked = function(event) {
        var buttonJ, inputGroupJ, inputJ, node;
        node = event.node;
        inputGroupJ = $("<div class=\"input-group\">\n	<input type=\"text\" class=\"form-control name-input\" placeholder=\"\">\n	<span class=\"input-group-btn\">\n		<button class=\"btn btn-default\" type=\"button\">Ok</button>\n	</span>\n</div>");
        inputGroupJ.attr('data-node-id', node.id);
        inputJ = inputGroupJ.find('.name-input');
        inputJ.attr('placeholder', node.name);
        inputJ.keyup(this.submitNewName);
        inputJ.blur(this.submitNewName);
        buttonJ = inputGroupJ.find('.btn');
        buttonJ.click(this.submitNewName);
        $(node.element).find('.jqtree-title:first').replaceWith(inputGroupJ);
        inputJ.focus();
        $(node.element).find('button.delete:first').hide();
      };

      FileManager.prototype.openFile = function(file) {
        var fileNode, path;
        path = file.path.replace('coffee/', '');
        fileNode = this.getNodeFromPath(path);
        fileNode.source = atob(file.content);
        R.showCodeEditor(fileNode);
      };

      FileManager.prototype.createName = function(newNode, parentTree) {
        var i;
        i = 1;
        while (parentTree.leaves[newNode.label] != null) {
          newNode.label = 'NewScript' + i + '.coffee';
        }
      };

      FileManager.prototype.onCreateFile = function() {
        var method, newNode, node, parentNode, parentTree;
        node = this.fileBrowserJ.tree('getSelectedNode');
        newNode = {
          label: 'NewScript.coffee',
          type: 'blob',
          children: [],
          leaves: {},
          source: '',
          id: this.tree.id++
        };
        parentNode = null;
        parentTree = null;
        method = 'appendNode';
        if (node === false) {
          newNode.path = newNode.label;
          parentTree = this.tree;
        } else if (node.type === 'tree') {
          newNode.path = node.path + '/' + newNode.label;
          parentNode = node;
          parentTree = parentNode;
        } else {
          newNode.path = node.parent.path ? node.parent.path + '/' + newNode.label : newNode.label;
          method = 'addNodeAfter';
          parentNode = node.parent;
          parentTree = parentNode || this.tree;
        }
        this.createName(newNode, parentTree);
        newNode = this.fileBrowserJ.tree(method, newNode, parentNode);
        parentTree.leaves[newNode.name] = newNode;
        R.showCodeEditor(newNode);
      };

      FileManager.prototype.onFileMoved = function(event) {
        var parent, parentPath;
        console.log('moved_node', event.move_info.moved_node);
        console.log('target_node', event.move_info.target_node);
        console.log('position', event.move_info.position);
        console.log('previous_parent', event.move_info.previous_parent);
        parent = event.move_info.moved_node.parent;
        parentPath = (parent != null) && parent.path !== '' ? parent.path + '/' : '';
        event.move_info.moved_node.newPath = parentPath + event.move_info.moved_node.name;
        this.save();
      };

      FileManager.prototype.saveFile = function(fileNode, source) {
        fileNode.source = source;
        $(fileNode.element).addClass('modified');
        this.save();
      };

      FileManager.prototype.onDeleteFile = function(event) {
        var node, path;
        path = $(event.target).attr('data-path');
        node = this.getNodeFromPath(path);
        node["delete"] = true;
      };

      FileManager.prototype.loadFile = function(path, callback) {
        this.request('https://api.github.com/repos/arthursw/romanesco-client-code/contents/coffee/' + path, callback);
      };

      FileManager.prototype.getNodes = function(tree, nodes) {
        var name, node, _ref;
        if (tree == null) {
          tree = this.tree;
        }
        if (nodes == null) {
          nodes = [];
        }
        _ref = tree.leaves;
        for (name in _ref) {
          node = _ref[name];
          if (node.type === 'tree') {
            nodes = this.getNodes(node, nodes);
          }
          nodes.push(node);
        }
        return nodes;
      };

      FileManager.prototype.save = function() {
        var file, files, forkFiles, node, nodes, _i, _len;
        nodes = this.getNodes();
        forkFiles = [];
        for (_i = 0, _len = nodes.length; _i < _len; _i++) {
          node = nodes[_i];
          if (node.type === 'tree') {
            continue;
          }
          if ((node.source != null) || (node.create != null) || (node["delete"] != null)) {
            file = {
              name: node.name,
              type: node.type,
              path: node.path,
              newPath: node.newPath,
              source: node.source,
              create: node.create,
              "delete": node["delete"]
            };
            forkFiles.push(file);
          }
        }
        files = {};
        files[this.owner] = forkFiles;
        Utils.LocalStorage.set('files', files);
      };

      FileManager.prototype.load = function() {
        var file, files, node, _i, _len, _ref;
        files = Utils.LocalStorage.get('files');
        if (files[this.owner] != null) {
          _ref = files[this.owner];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            file = _ref[_i];
            node = this.getNodeFromPath(file.path);
            node.source = file.source;
            node.create = file.create;
            node["delete"] = file["delete"];
            node.newPath = file.newPath;
            $(node.element).addClass('modified');
          }
        }
      };

      FileManager.prototype.checkError = function(message) {
        console.log(message);
      };

      FileManager.prototype.fileToData = function(file, commitMessage, content, sha) {
        var data;
        if (content == null) {
          content = false;
        }
        if (sha == null) {
          sha = false;
        }
        data = {
          path: file.newPath || file.path,
          message: commitMessage
        };
        if (content) {
          data.content = btoa(file.source);
        }
        if (sha) {
          data.sha = file.sha;
        }
        return data;
      };

      FileManager.prototype.requestFile = function(file, data, method) {
        var path;
        if (method == null) {
          method = 'put';
        }
        path = 'coffee/' + file.path;
        this.request('https://api.github.com/repos/' + this.owner + '/romanesco-client-code/contents/' + path, this.checkError, method, data);
        if (file.newPath != null) {
          file.path = file.newPath;
          delete file.newPath;
        }
      };

      FileManager.prototype.createFile = function(file, commitMessage) {
        var data;
        data = this.fileToData(file, commitMessage, true);
        this.requestFile(file, data);
      };

      FileManager.prototype.updateFile = function(file, commitMessage) {
        var data;
        data = this.fileToData(file, commitMessage, true, true);
        $(file.element).removeClass('modified');
        this.requestFile(file, data);
      };

      FileManager.prototype.deleteFile = function(file, commitMessage) {
        var data;
        data = this.fileToData(file, commitMessage, false, true);
        this.requestFile(file, data, 'delete');
        delete file["delete"];
      };

      FileManager.prototype.runLastCommit = function(branch) {
        R.repository.owner = this.owner;
        R.repository.commit = branch.commit.sha;
        R.view.updateHash();
        location.reload();
      };

      FileManager.prototype.runFork = function(data) {
        if ((data != null ? data.owner : void 0) != null) {
          this.owner = data.owner;
        }
        this.request('https://api.github.com/repos/' + this.owner + '/romanesco-client-code/branches/master', this.runLastCommit);
      };

      FileManager.prototype.onCommitClicked = function(event) {
        var modal;
        modal = Modal.createModal({
          title: 'Commit',
          submit: this.commit
        });
        modal.addTextInput({
          name: 'commitMessage',
          placeholder: 'Added the coffee maker feature.',
          label: 'Message',
          required: true
        });
        modal.show();
      };

      FileManager.prototype.commit = function(data) {
        var file, nodes, nothingToCommit, _i, _len;
        nodes = this.getNodes();
        nothingToCommit = true;
        for (_i = 0, _len = nodes.length; _i < _len; _i++) {
          file = nodes[_i];
          if (file["delete"] || (file.source != null)) {
            nothingToCommit = false;
          }
          if (file["delete"]) {
            this.deleteFile(file, data.commitMessage);
            continue;
          } else if (file.source != null) {
            if (file.create) {
              this.createFile(file, data.commitMessage);
            } else {
              this.updateFile(file, data.commitMessage);
            }
          }
        }
        if (nothingToCommit) {
          R.alertManager.alert('Nothing to commit.', 'Info');
        }
      };

      FileManager.prototype.createPullRequest = function() {
        var modal;
        modal = Modal.createModal({
          title: 'Create pull request',
          submit: this.createPullRequestSubmit
        });
        modal.addTextInput({
          name: 'title',
          placeholder: 'Amazing new feature',
          label: 'Title of the pull request',
          required: true
        });
        modal.addTextInput({
          name: 'branch',
          placeholder: 'master',
          label: 'Branch',
          required: true
        });
        modal.addTextInput({
          name: 'body',
          placeholder: 'Please pull this in!',
          label: 'Message',
          required: false
        });
        modal.show();
      };

      FileManager.prototype.createPullRequestSubmit = function(data) {
        data = {
          title: data.title,
          head: this.owner + ':' + data.branch,
          base: 'master',
          body: data.body
        };
        this.request('https://api.github.com/repos/arthursw/romanesco-client-code/pulls', this.checkError, 'post', data);
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
        _ref = pathDirectory.leaves;
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
        this.createButtons(this.tree.leaves['Items'].leaves['Paths']);
      };

      FileManager.prototype.registerModule = function(module) {
        this.module = module;
        this.loadFile(this.tree.leaves['ModuleLoader'].path, this.registerModuleInModuleLoader);
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
