// Generated by CoffeeScript 1.12.7
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['UI/Button'], function(Button) {
    var Tool;
    Tool = (function() {
      Tool.label = Tool.name;

      Tool.description = null;

      Tool.iconURL = null;

      Tool.favorite = true;

      Tool.category = null;

      Tool.cursor = {
        position: {
          x: 0,
          y: 0
        },
        name: 'default'
      };

      Tool.drawItems = false;


      /*
      		parameters =
      			'First folder':
      				firstParameter:
      					type: 'slider' 									# type is only required when adding a color (then it must be 'color') or a string input (then it must be 'string')
      																	 * if type is 'string' and there is no onChange nor onFinishChange callback:
      																	 * the default onChange callback will be called on onFinishChange since we often want to update only when the change is finished
      																	 * to override this behaviour, define both onChange and onFinishChange methods
      					label: 'Name of the parameter'					# label of the controller (name displayed in the gui)
      					default: 0 										# default value
      					step: 5 										# values will be incremented/decremented by step
      					min: 0 											# minimum value
      					max: 100 										# maximum value
      					simplified: 0 									# value during the simplified mode (useful to quickly draw an RPath, for example when modifying a curve)
      					defaultFunction: () -> 							# called to get a default value
      					onChange: (value)->  							# called when controller changes
      					onFinishChange: (value)-> 						# called when controller finishes change
      					setValue: (value)-> 							# called on set value of controller
      					defaultCheck: true 								# checked/activated by default or not
      					initializeController: (controller)->			# called just after controller is added to dat.gui, enables to customize the gui and add functionalities
      				secondParameter:
      					type: 'slider'
      					label: 'Second parameter'
      					value: 1
      					min: 0
      					max: 10
      			'Second folder':
      				thirdParameter:
      					type: 'slider'
      					label: 'Third parameter'
      					value: 1
      					min: 0
      					max: 10
       */

      Tool.initializeParameters = function() {
        return {};
      };

      Tool.parameters = Tool.initializeParameters();

      function Tool(createButton) {
        this.select = bind(this.select, this);
        if (createButton) {
          this.createButton();
        }
        this.name = this.constructor.label;
        return;
      }

      Tool.prototype.createButton = function() {
        this.btn = new Button({
          name: this.constructor.label,
          iconURL: this.constructor.iconURL,
          favorite: this.constructor.favorite,
          category: this.constructor.category,
          description: this.constructor.description,
          popover: true,
          order: this.constructor.order
        });
        this.btn.btnJ.click(this.select);
      };

      Tool.prototype.select = function(deselectItems, updateParameters) {
        var ref;
        if (deselectItems == null) {
          deselectItems = true;
        }
        if (updateParameters == null) {
          updateParameters = true;
        }
        if (R.selectedTool === this) {
          return;
        }
        R.previousTool = R.selectedTool;
        if ((ref = R.selectedTool) != null) {
          ref.deselect();
        }
        R.selectedTool = this;
        this.updateCursor();
        if (deselectItems) {
          R.tools.select.deselectAll();
        }
        if (updateParameters) {
          this.updateParameters();
        }
      };

      Tool.prototype.updateParameters = function() {
        R.controllerManager.setSelectedTool(this.constructor);
      };

      Tool.prototype.updateCursor = function() {
        if (this.constructor.cursor.icon != null) {
          R.stageJ.css('cursor', 'url(' + location.origin + '/static/images/cursors/' + this.constructor.cursor.icon + '.png) ' + this.constructor.cursor.position.x + ' ' + this.constructor.cursor.position.y + ',' + this.constructor.cursor.name);
        } else {
          R.stageJ.css('cursor', this.constructor.cursor.name);
        }
      };

      Tool.prototype.deselect = function() {};

      Tool.prototype.begin = function(event) {};

      Tool.prototype.update = function(event) {};

      Tool.prototype.move = function(event) {};

      Tool.prototype.end = function(event) {};

      Tool.prototype.keyUp = function(event) {};

      Tool.prototype.disableSnap = function() {
        return false;
      };

      return Tool;

    })();
    R.Tools = {};
    R.tools = {};
    return Tool;
  });

}).call(this);
