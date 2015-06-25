// Generated by CoffeeScript 1.7.1
(function() {
  define(['Utils/Utils'], function() {
    var AlertManager;
    AlertManager = (function() {
      function AlertManager() {
        this.alertsContainer = $("#Romanesco_alerts");
        this.alerts = [];
        this.currentAlert = -1;
        this.alertTimeOut = -1;
        this.alertsContainer.find(".btn-up").click((function(_this) {
          return function() {
            return _this.showAlert(_this.currentAlert - 1);
          };
        })(this));
        this.alertsContainer.find(".btn-down").click((function(_this) {
          return function() {
            return _this.showAlert(_this.currentAlert + 1);
          };
        })(this));
        return;
      }

      AlertManager.prototype.showAlert = function(index) {
        var alertJ, prevType;
        if (this.alerts.length <= 0 || index < 0 || index >= this.alerts.length) {
          return;
        }
        prevType = this.alerts[this.currentAlert].type;
        this.currentAlert = index;
        alertJ = this.alertsContainer.find(".alert");
        alertJ.removeClass(prevType).addClass(this.alerts[this.currentAlert].type).text(this.alerts[this.currentAlert].message);
        this.alertsContainer.find(".alert-number").text(this.currentAlert + 1);
      };

      AlertManager.prototype.alert = function(message, type, delay) {
        var alertJ;
        if (type == null) {
          type = "";
        }
        if (delay == null) {
          delay = 2000;
        }
        if (type.length === 0) {
          type = "info";
        } else if (type === "error") {
          type = "danger";
        }
        type = " alert-" + type;
        alertJ = this.alertsContainer.find(".alert");
        this.alertsContainer.removeClass("r-hidden");
        this.currentAlert = this.alerts.length;
        this.alerts.push({
          type: type,
          message: message
        });
        if (this.alerts.length > 0) {
          this.alertsContainer.addClass("activated");
        }
        this.showAlert(this.alerts.length - 1);
        this.alertsContainer.addClass("show");
        if (delay !== 0) {
          clearTimeout(R.alertTimeOut);
          this.alertTimeOut = setTimeout((function() {
            return this.alertsContainer.removeClass("show");
          }), delay);
        }
      };

      return AlertManager;

    })();
    return AlertManager;
  });

}).call(this);

//# sourceMappingURL=Alert.map
