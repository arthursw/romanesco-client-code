// Generated by CoffeeScript 1.7.1
(function() {
  define(['domReady!'], function(document) {
    var Modal;
    Modal = (function() {
      Modal.modals = [];

      Modal.extractors = [];

      Modal.modalJ = $('#customModal');

      Modal.modalBodyJ = Modal.modalJ.find('.modal-body');

      Modal.modalJ.on('shown.bs.modal', function(event) {
        return Modal.modalJ.find('input.form-control:visible:first').focus();
      });

      Modal.modalJ.find('.btn-primary').click(function(event) {
        return Modal.modalSubmit();
      });

      Modal.initialize = function(title, submitCallback, validation, hideOnSubmit) {
        this.submitCallback = submitCallback;
        this.validation = validation != null ? validation : null;
        this.hideOnSubmit = hideOnSubmit != null ? hideOnSubmit : true;
        this.modalBodyJ.empty();
        this.extractors = {};
        this.modalJ.find("h4.modal-title").html(title);
        this.modalJ.find(".modal-footer").show().find(".btn").show();
      };

      Modal.alert = function(message, title) {
        if (title == null) {
          title = 'Info';
        }
        this.initialize(title);
        this.addText(message);
        R.RModal.modalJ.find("[name='cancel']").hide();
        R.RModal.show();
      };

      Modal.addText = function(text) {
        return this.modalBodyJ.append("<p>" + text + "</p>");
      };

      Modal.addTextInput = function(name, placeholder, type, className, label, submitShortcut, id, required, errorMessage) {
        var inputJ;
        if (placeholder == null) {
          placeholder = null;
        }
        if (type == null) {
          type = null;
        }
        if (className == null) {
          className = null;
        }
        if (label == null) {
          label = null;
        }
        if (submitShortcut == null) {
          submitShortcut = false;
        }
        if (id == null) {
          id = null;
        }
        if (required == null) {
          required = false;
        }
        inputJ = this.addTextInputA({
          name: name,
          placeholder: placeholder,
          type: type,
          className: className,
          label: label,
          submitShortcut: submitShortcut,
          id: id,
          required: required,
          errorMessage: errorMessage
        });
        return inputJ;
      };

      Modal.addTextInputA = function(args) {
        var className, divJ, errorMessage, extractor, id, inputID, inputJ, label, labelJ, name, placeholder, required, submitShortcut, type;
        name = args.name;
        placeholder = args.placeholder;
        type = args.type;
        className = args.className;
        label = args.label;
        submitShortcut = args.submitShortcut;
        id = args.id;
        required = args.required;
        errorMessage = args.errorMessage;
        submitShortcut = submitShortcut ? 'submit-shortcut' : '';
        inputJ = $("<input type='" + type + "' class='" + className + " form-control " + submitShortcut + "'>");
        if ((placeholder != null) && placeholder !== '') {
          inputJ.attr("placeholder", placeholder);
        }
        if (required) {
          if (errorMessage == null) {
            errorMessage = "<em>" + (label || name) + "</em> is invalid.";
          }
          inputJ.attr('data-error', errorMessage);
        }
        args = inputJ;
        extractor = function(data, inputJ, name, required) {
          if (required == null) {
            required = false;
          }
          data[name] = inputJ.val();
          return (!required) || ((data[name] != null) && data[name] !== '');
        };
        if (label) {
          inputID = 'modal-' + name + '-' + Math.random().toString();
          inputJ.attr('id', inputID);
          divJ = $("<div id='" + id + "' class='form-group " + className + "-group'></div>");
          labelJ = $("<label for='" + inputID + "'>" + label + "</label>");
          divJ.append(labelJ);
          divJ.append(inputJ);
          inputJ = divJ;
        }
        this.addCustomContent(name, inputJ, extractor, args, required);
        return inputJ;
      };

      Modal.addCheckbox = function(name, label, helpMessage) {
        var checkboxJ, divJ, extractor, helpMessageJ;
        if (helpMessage == null) {
          helpMessage = null;
        }
        divJ = $("<div>");
        checkboxJ = $("<label><input type='checkbox' form-control>" + label + "</label>");
        divJ.append(checkboxJ);
        if (helpMessage) {
          helpMessageJ = $("<p class='help-block'>" + helpMessage + "</p>");
          divJ.append(helpMessageJ);
        }
        extractor = function(data, checkboxJ, name) {
          data[name] = checkboxJ.is(':checked');
          return true;
        };
        this.addCustomContent(name, divJ, extractor, checkboxJ);
        return divJ;
      };

      Modal.addRadioGroup = function(name, radioButtons) {
        var checked, divJ, extractor, inputJ, labelJ, radioButton, radioJ, submitShortcut, _i, _len;
        divJ = $("<div>");
        for (_i = 0, _len = radioButtons.length; _i < _len; _i++) {
          radioButton = radioButtons[_i];
          radioJ = $("<div class='radio'>");
          labelJ = $("<label>");
          checked = radioButton.checked ? 'checked' : '';
          submitShortcut = radioButton.submitShortcut ? 'class="submit-shortcut"' : '';
          inputJ = $("<input type='radio' name='" + name + "' value='" + radioButton.value + "' " + checked + " " + submitShortcut + ">");
          labelJ.append(inputJ);
          labelJ.append(radioButton.label);
          radioJ.append(labelJ);
          divJ.append(radioJ);
        }
        extractor = function(data, divJ, name, required) {
          var choiceJ, _ref;
          if (required == null) {
            required = false;
          }
          choiceJ = divJ.find("input[type=radio][name=" + name + "]:checked");
          data[name] = (_ref = choiceJ[0]) != null ? _ref.value : void 0;
          return (!required) || (data[name] != null);
        };
        this.addCustomContent(name, divJ, extractor);
        return divJ;
      };

      Modal.addCustomContent = function(name, div, extractor, args, required) {
        if (args == null) {
          args = null;
        }
        if (required == null) {
          required = false;
        }
        if (args == null) {
          args = div;
        }
        div.attr('id', 'modal-' + name);
        this.modalBodyJ.append(div);
        this.extractors[name] = {
          extractor: extractor,
          args: args,
          div: div,
          required: required
        };
        return div;
      };

      Modal.show = function() {
        this.modalJ.find('.submit-shortcut').keypress((function(_this) {
          return function(event) {
            if (event.which === 13) {
              event.preventDefault();
              _this.modalSubmit();
            }
          };
        })(this));
        this.modalJ.modal('show');
      };

      Modal.hide = function() {
        this.modalJ.modal('hide');
      };

      Modal.modalSubmit = function() {
        var data, errorMessage, extractor, name, valid, _ref;
        data = {};
        this.modalJ.find(".error-message").remove();
        valid = true;
        _ref = this.extractors;
        for (name in _ref) {
          extractor = _ref[name];
          valid &= extractor.extractor(data, extractor.args, name, extractor.required);
          if (!valid) {
            errorMessage = extractor.div.find("[data-error]").attr('data-error');
            if (errorMessage == null) {
              errorMessage = 'The field "' + name + '"" is invalid.';
            }
            this.modalBodyJ.append("<div class='error-message'>" + errorMessage + "</div>");
          }
        }
        if (!valid || (this.validation != null) && !this.validation(data)) {
          return;
        }
        if (typeof this.submitCallback === "function") {
          this.submitCallback(data);
        }
        this.extractors = {};
        if (this.hideOnSubmit) {
          this.modalBodyJ.empty();
          this.modalJ.modal('hide');
        }
      };

      Modal.createModal = function(args) {
        var modal, zIndex;
        modal = new RModal(args);
        if (this.modals.length > 0) {
          zIndex = parseInt(_.last(this.modals).modalJ.css('z-index'));
          modal.modalJ.css('z-index', zIndex + 2);
        }
        this.modals.push(modal);
        return modal;
      };

      Modal.deleteModal = function(modal) {
        modal["delete"]();
        Utils.Array.remove(this.modals, modal);
      };

      Modal.getModalByTitle = function(title) {
        var modal, _i, _len, _ref;
        _ref = this.modals;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          modal = _ref[_i];
          if (modal.title === title) {
            return modal;
          }
        }
        return null;
      };

      Modal.getModalByName = function(name) {
        var modal, _i, _len, _ref;
        _ref = this.modals;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          modal = _ref[_i];
          if (modal.name === name) {
            return modal;
          }
        }
        return null;
      };

      function Modal(args) {
        this.data = {
          data: args.data
        };
        this.title = args.title;
        this.name = args.name;
        this.validation = args.validation;
        this.postSubmit = args.postSubmit || 'hide';
        this.submitCallback = args.submit;
        this.extractors = [];
        this.modalJ = this.constructor.modalJ.clone();
        R.templatesJ.find('.modals').append(this.modalJ);
        this.modalBodyJ = this.modalJ.find('.modal-body');
        this.modalBodyJ.empty();
        this.modalJ.find(".modal-footer").show().find(".btn").show();
        this.modalJ.on('shown.bs.modal', (function(_this) {
          return function(event) {
            var zIndex;
            _this.modalJ.find('input.form-control:visible:first').focus();
            zIndex = parseInt(_this.modalJ.css('z-index'));
            return $('body').find('.modal-backdrop:last').css('z-index', zIndex - 1);
          };
        })(this));
        this.modalJ.on('hidden.bs.modal', (function(_this) {
          return function(event) {
            return R.RModal.deleteModal(_this);
          };
        })(this));
        this.modalJ.find('.btn-primary').click((function(_this) {
          return function(event) {
            return _this.modalSubmit();
          };
        })(this));
        this.extractors = {};
        this.modalJ.find("h4.modal-title").html(args.title);
        this.modalJ.find(".modal-footer").show().find(".btn").show();
        return;
      }

      Modal.prototype.addText = function(text) {
        this.modalBodyJ.append("<p>" + text + "</p>");
      };

      Modal.prototype.addTextInput = function(args) {
        var className, defaultValue, divJ, errorMessage, extractor, id, inputID, inputJ, label, labelJ, name, placeholder, required, submitShortcut, type;
        name = args.name;
        placeholder = args.placeholder;
        type = args.type;
        className = args.className;
        label = args.label;
        submitShortcut = args.submitShortcut;
        id = args.id;
        required = args.required;
        errorMessage = args.errorMessage;
        defaultValue = args.defaultValue;
        if (required) {
          if (errorMessage == null) {
            errorMessage = "<em>" + (label || name) + "</em> is invalid.";
          }
        }
        submitShortcut = submitShortcut ? 'submit-shortcut' : '';
        inputJ = $("<input type='" + type + "' class='" + className + " form-control " + submitShortcut + "'>");
        if ((placeholder != null) && placeholder !== '') {
          inputJ.attr("placeholder", placeholder);
        }
        inputJ.val(defaultValue);
        args = inputJ;
        extractor = function(data, inputJ, name, required) {
          if (required == null) {
            required = false;
          }
          data[name] = inputJ.val();
          return (!required) || ((data[name] != null) && data[name] !== '');
        };
        if (label) {
          inputID = 'modal-' + name + '-' + Math.random().toString();
          inputJ.attr('id', inputID);
          divJ = $("<div id='" + id + "' class='form-group " + className + "-group'></div>");
          labelJ = $("<label for='" + inputID + "'>" + label + "</label>");
          divJ.append(labelJ);
          divJ.append(inputJ);
          inputJ = divJ;
        }
        this.addCustomContent({
          name: name,
          divJ: inputJ,
          extractor: extractor,
          args: args,
          required: required,
          errorMessage: errorMessage
        });
        return inputJ;
      };

      Modal.prototype.addCheckbox = function(args) {
        var checkboxJ, defaultValue, divJ, extractor, helpMessage, helpMessageJ, label, name;
        name = args.name;
        label = args.label;
        helpMessage = args.helpMessage;
        defaultValue = args.defaultValue;
        divJ = $("<div>");
        checkboxJ = $("<label><input type='checkbox' form-control>" + label + "</label>");
        if (defaultValue) {
          checkboxJ.find('input').attr('checked', true);
        }
        divJ.append(checkboxJ);
        if (helpMessage) {
          helpMessageJ = $("<p class='help-block'>" + helpMessage + "</p>");
          divJ.append(helpMessageJ);
        }
        extractor = function(data, checkboxJ, name) {
          data[name] = checkboxJ.is(':checked');
          return true;
        };
        this.addCustomContent({
          name: name,
          divJ: divJ,
          extractor: extractor,
          args: checkboxJ
        });
        return divJ;
      };

      Modal.prototype.addRadioGroup = function(args) {
        var checked, divJ, extractor, inputJ, labelJ, name, radioButton, radioButtons, radioJ, submitShortcut, _i, _len;
        name = args.name;
        radioButtons = args.radioButtons;
        divJ = $("<div>");
        for (_i = 0, _len = radioButtons.length; _i < _len; _i++) {
          radioButton = radioButtons[_i];
          radioJ = $("<div class='radio'>");
          labelJ = $("<label>");
          checked = radioButton.checked ? 'checked' : '';
          submitShortcut = radioButton.submitShortcut ? 'class="submit-shortcut"' : '';
          inputJ = $("<input type='radio' name='" + name + "' value='" + radioButton.value + "' " + checked + " " + submitShortcut + ">");
          labelJ.append(inputJ);
          labelJ.append(radioButton.label);
          radioJ.append(labelJ);
          divJ.append(radioJ);
        }
        extractor = function(data, divJ, name, required) {
          var choiceJ, _ref;
          if (required == null) {
            required = false;
          }
          choiceJ = divJ.find("input[type=radio][name=" + name + "]:checked");
          data[name] = (_ref = choiceJ[0]) != null ? _ref.value : void 0;
          return (!required) || (data[name] != null);
        };
        this.addCustomContent({
          name: name,
          divJ: divJ,
          extractor: extractor
        });
        return divJ;
      };

      Modal.prototype.addCustomContent = function(args) {
        if (args.args == null) {
          args.args = args.divJ;
        }
        args.divJ.attr('id', 'modal-' + args.name);
        this.modalBodyJ.append(args.divJ);
        this.extractors[args.name] = args;
      };

      Modal.prototype.show = function() {
        this.modalJ.find('.submit-shortcut').keypress((function(_this) {
          return function(event) {
            if (event.which === 13) {
              event.preventDefault();
              _this.modalSubmit();
            }
          };
        })(this));
        this.modalJ.modal('show');
      };

      Modal.prototype.hide = function() {
        this.modalJ.modal('hide');
      };

      Modal.prototype.addProgressBar = function() {
        var progressJ;
        progressJ = $(" <div class=\"progress modal-progress-bar\">\n	<div class=\"progress-bar progress-bar-striped active\" role=\"progressbar\" aria-valuenow=\"100\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 100%\">\n		<span class=\"sr-only\">Loading...</span>\n	</div>\n</div>");
        this.modalBodyJ.append(progressJ);
      };

      Modal.prototype.removeProgressBar = function() {
        this.modalBodyJ.find('.modal-progress-bar').remove();
      };

      Modal.prototype.modalSubmit = function() {
        var errorMessage, extractor, name, valid, _ref;
        this.modalJ.find(".error-message").remove();
        valid = true;
        _ref = this.extractors;
        for (name in _ref) {
          extractor = _ref[name];
          valid &= extractor.extractor(this.data, extractor.args, name, extractor.required);
          if (!valid) {
            errorMessage = extractor.errorMessage;
            if (errorMessage == null) {
              errorMessage = 'The field "' + name + '"" is invalid.';
            }
            this.modalBodyJ.append("<div class='error-message'>" + errorMessage + "</div>");
          }
        }
        if (!valid || (this.validation != null) && !this.validation(data)) {
          return;
        }
        if (typeof this.submitCallback === "function") {
          this.submitCallback(this.data);
        }
        this.extractors = {};
        switch (this.postSubmit) {
          case 'hide':
            this.modalJ.modal('hide');
            break;
          case 'load':
            this.modalBodyJ.children().hide();
            this.addProgressBar();
        }
      };

      Modal.prototype["delete"] = function() {
        this.modalJ.remove();
      };

      return Modal;

    })();
    return Modal;
  });

}).call(this);

//# sourceMappingURL=Modal.map