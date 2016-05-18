// Generated by CoffeeScript 1.10.0
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['socketio'], function(ioo) {
    var Socket;
    Socket = (function() {
      function Socket() {
        this.onSetUserName = bind(this.onSetUserName, this);
        this.startChatting = bind(this.startChatting, this);
        this.updateRoom = bind(this.updateRoom, this);
        this.sendMessage = bind(this.sendMessage, this);
        this.submitChatUserName = bind(this.submitChatUserName, this);
        this.onConnectionError = bind(this.onConnectionError, this);
        this.onKeyPress = bind(this.onKeyPress, this);
        this.addMessage = bind(this.addMessage, this);
        this.initialize();
        return;
      }

      Socket.prototype.emit = function() {
        this.socket.emit.apply(this.socket, arguments);
      };

      Socket.prototype.initialize = function() {
        this.chatJ = $("#chatContent");
        this.chatMainJ = this.chatJ.find("#chatMain");
        this.chatRoomJ = this.chatMainJ.find("#chatRoom");
        this.chatUsernamesJ = this.chatMainJ.find("#chatUserNames");
        this.chatMessagesJ = this.chatMainJ.find("#chatMessages");
        this.chatMessageJ = this.chatMainJ.find("#chatSendMessageInput");
        this.chatMessageJ.blur();
        this.socket = io.connect("/chat");
        this.socket.on("connect", this.updateRoom);
        this.socket.on("announcement", this.addMessage);
        this.socket.on("nicknames", (function(_this) {
          return function(nicknames) {
            var i;
            _this.chatUsernamesJ.empty().append($("<span>Online: </span>"));
            for (i in nicknames) {
              _this.chatUsernamesJ.append($("<b>").text(i > 0 ? ', ' + nicknames[i] : nicknames[i]));
            }
          };
        })(this));
        this.socket.on("msg_to_room", (function(_this) {
          return function(from, msg) {
            _this.addMessage(msg, from);
          };
        })(this));
        this.socket.on("reconnect", (function(_this) {
          return function() {
            _this.chatMessagesJ.remove();
            _this.addMessage("Reconnected to the server", "System");
          };
        })(this));
        this.socket.on("reconnecting", (function(_this) {
          return function() {
            _this.addMessage("Attempting to re-connect to the server", "System");
          };
        })(this));
        this.socket.on("error", (function(_this) {
          return function(e) {
            _this.addMessage((e ? e : "A unknown error occurred"), "System");
          };
        })(this));
        this.chatMainJ.find("#chatSendMessageSubmit").submit(this.sendMessage);
        this.chatMessageJ.keypress(this.onKeyPress);
        this.chatConnectionTimeout = setTimeout(this.onConnectionError, 2000);
        if (this.chatJ.find("#chatUserNameInput").length > 0) {
          this.initializeUserName();
        }
        return this.socket.on("bounce", this.onBounce);
      };

      Socket.prototype.initializeUserName = function() {
        var adjectives, things, username, usernameJ;
        this.chatJ.find("a.sign-in").click(this.onSignInClick);
        this.chatJ.find("a.change-username").click(this.onChangeUserNameClick);
        usernameJ = this.chatJ.find("#chatUserName");
        usernameJ.find('#chatUserNameInput').keypress(this.onUserNameInputKeypress);
        usernameJ.find("#chatUserNameSubmit").submit(this.submitChatUserName);
        adjectives = ["Cool", "Masked", "Bloody", "Super", "Mega", "Giga", "Ultra", "Big", "Blue", "Black", "White", "Red", "Purple", "Golden", "Silver", "Dangerous", "Crazy", "Fast", "Quick", "Little", "Funny", "Extreme", "Awsome", "Outstanding", "Crunchy", "Vicious", "Zombie", "Funky", "Sweet"];
        things = ["Hamster", "Moose", "Lama", "Duck", "Bear", "Eagle", "Tiger", "Rocket", "Bullet", "Knee", "Foot", "Hand", "Fox", "Lion", "King", "Queen", "Wizard", "Elephant", "Thunder", "Storm", "Lumberjack", "Pistol", "Banana", "Orange", "Pinapple", "Sugar", "Leek", "Blade"];
        username = Utils.Array.random(adjectives) + " " + Utils.Array.random(things);
        this.submitChatUserName(username, false);
      };

      Socket.prototype.addMessage = function(message, from) {
        var author;
        if (from == null) {
          from = null;
        }
        if (from != null) {
          author = from === R.me ? "me" : from;
          this.chatMessagesJ.append($("<p>").append($("<b>").text(author + ": "), message));
        } else {
          this.chatMessagesJ.append($("<p>").append(message));
        }
        this.chatMessageJ.val('');
        if (from === R.me) {
          $("#chatMessagesScroll").mCustomScrollbar("scrollTo", "bottom");
          $(".sidebar-scrollbar.chatMessagesScroll").mCustomScrollbar("scrollTo", "bottom");
        } else if ($(document.activeElement).parents("#Chat").length > 0) {
          $("#chatMessagesScroll").mCustomScrollbar("scrollTo", "bottom");
        }
      };

      Socket.prototype.onKeyPress = function(event) {
        if (event.which === 13) {
          event.preventDefault();
          this.sendMessage();
        }
      };

      Socket.prototype.onConnectionError = function() {
        this.chatMainJ.find("#chatConnectingMessage").text("Impossible to connect to chat.");
      };

      Socket.prototype.onSignInClick = function(event) {
        $("#user-login-group > button").click();
        event.preventDefault();
        return false;
      };

      Socket.prototype.onChangeUserNameClick = function(event) {
        $("#chatUserName").show();
        $("#chatUserNameInput").focus();
        event.preventDefault();
        return false;
      };

      Socket.prototype.onUserNameInputKeypress = function(event) {
        if (event.which === 13) {
          event.preventDefault();
          this.submitChatUserName();
        }
      };

      Socket.prototype.submitChatUserName = function(username, focusOnChat) {
        if (focusOnChat == null) {
          focusOnChat = true;
        }
        $("#chatUserName").hide();
        if (username == null) {
          username = usernameJ.find('#chatUserNameInput').val();
        }
        this.startChatting(username, false, focusOnChat);
      };

      Socket.prototype.sendMessage = function() {
        this.socket.emit("user message", this.chatMessageJ.val());
        this.addMessage(this.chatMessageJ.val(), R.me);
      };

      Socket.prototype.updateRoom = function() {
        var room;
        room = this.getChatRoom();
        if (R.room !== room) {
          this.chatRoomJ.empty().append("<span>Room: </span>" + room);
          this.socket.emit("join", room);
          return R.room = room;
        }
      };

      Socket.prototype.startChatting = function(username, realUsername, focusOnChat) {
        if (realUsername == null) {
          realUsername = true;
        }
        if (focusOnChat == null) {
          focusOnChat = true;
        }
        this.socket.emit("nickname", username, this.onSetUserName);
        if (focusOnChat) {
          this.chatMessageJ.focus();
        }
        if (realUsername) {
          this.chatJ.find("#chatLogin").addClass("hidden");
        } else {
          this.chatJ.find("#chatLogin p.default-username-message").html("You are logged as <strong>" + username + "</strong>");
        }
      };

      Socket.prototype.onSetUserName = function(set) {
        if (set) {
          window.clearTimeout(this.chatConnectionTimeout);
          this.chatMainJ.removeClass("hidden");
          this.chatMainJ.find("#chatConnectingMessage").addClass("hidden");
          this.chatJ.find("#chatUserNameError").addClass("hidden");
        } else {
          this.chatJ.find("#chatUserNameError").removeClass("hidden");
        }
      };

      Socket.prototype.onBounce = function(data) {
        var allowedFunctions, id, item, itemClass, itemMustBeRasterized, rFunction, ref, ref1, ref2, ref3, tool;
        if (R.ignoreSockets) {
          return;
        }
        if ((data["function"] != null) && (data["arguments"] != null)) {
          if (data.tool != null) {
            tool = R.tools[data.tool];
            if ((ref = data["function"]) !== 'begin' && ref !== 'update' && ref !== 'end' && ref !== 'createPath') {
              console.log('Error: not authorized to call' + data["function"]);
              return;
            }
            rFunction = tool != null ? tool[data["function"]] : void 0;
            if (rFunction != null) {
              data["arguments"][0] = Event.prototype.fromJSON(data["arguments"][0]);
              rFunction.apply(tool, data["arguments"]);
            }
          } else if (data.itemPk != null) {
            item = R.items[data.itemPk];
            if ((item != null) && (item.currentCommand == null)) {
              allowedFunctions = ['setRectangle', 'setRotation', 'moveTo', 'setParameter', 'modifyPoint', 'modifyPointType', 'modifySpeed', 'setPK', 'delete', 'create', 'addPoint', 'deletePoint', 'modifyControlPath', 'setText'];
              if (ref1 = data["function"], indexOf.call(allowedFunctions, ref1) < 0) {
                console.log('Error: not authorized to call: ' + data["function"]);
                return;
              }
              rFunction = item[data["function"]];
              if (rFunction == null) {
                console.log('Error: function is not valid: ' + data["function"]);
                return;
              }
              id = 'rasterizeItem-' + item.pk;
              itemMustBeRasterized = ((ref2 = data["function"]) !== 'setPK' && ref2 !== 'create') && !item.drawing.visible;
              if ((R.updateTimeout[id] == null) && itemMustBeRasterized) {
                R.rasterizer.drawItems();
                R.rasterizer.rasterize(item, true);
              }
              item.drawing.visible = true;
              item.socketAction = true;
              rFunction.apply(item, data["arguments"]);
              delete item.socketAction;
              if (itemMustBeRasterized && ((ref3 = data["function"]) !== 'delete')) {
                Utils.deferredExecution(this.rasterizeItem, id, 1000);
              }
            }
          } else if (data.itemClass && data["function"] === 'create') {
            itemClass = g[data.itemClass];
            if (Item.prototype.isPrototypeOf(itemClass)) {
              itemClass.socketAction = true;
              itemClass.create.apply(itemClass, data["arguments"]);
            }
          }
          P.view.update();
        }
      };

      Socket.prototype.rasterizeItem = function() {
        if (!item.currentCommand) {
          R.rasterizer.rasterize(item);
        }
      };

      Socket.prototype.getChatRoom = function() {
        return 'x: ' + Math.round(P.view.center.x / R.scale) + ', y: ' + Math.round(P.view.center.y / R.scale);
      };

      return Socket;

    })();
    return Socket;
  });

}).call(this);
