var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "manny/client/worklist/controller/BaseController", "sap/ui/model/json/JSONModel", "../lib/formatter", "manny/client/worklist/lib/models"], function (require, exports, BaseController_1, JSONModel_1, formatter_1, models_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Login = /** @class */ (function (_super) {
        __extends(Login, _super);
        function Login() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.formatter = formatter_1.default;
            return _this;
        }
        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */
        /**
         * Called when the login controller is instantiated.
         * @public
         */
        Login.prototype.onInit = function () {
            var oView = this.getView(), oCore = sap.ui.getCore();
            //LoginDialog data model
            var oViewModel = new JSONModel_1.default({
                user: {
                    username: "admin",
                    email: "",
                    password: "admin",
                    access_token: "",
                    userId: 0,
                    login: false
                }
            }, true);
            oView.setModel(oViewModel);
            oView.setModel(oCore.getModel("i18n"), "i18n");
        };
        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */
        /**
         * if press the submis button to login
         * @param {sap.ui.base.Event} oEvent
         */
        Login.prototype.onDialogSubmitButton = function (oEvent) {
            var oView = this.getView(), oViewModel = oView.getModel(), oRouter = this.getRouter(), oCore = sap.ui.getCore(), oApp = oCore.byId("app"), oData = oView.oParent.oParent.oParent.getModel();
            //oData = oView.getModel();//('database')
            console.log(oViewModel.getProperty("/user"));
            // clear login 
            oViewModel.setProperty("/user/login", false);
            jQuery.ajax({
                type: "POST",
                contentType: "application/json",
                url: "/api/Users/login",
                dataType: "json",
                async: false,
                data: JSON.stringify({
                    "username": oViewModel.getProperty("/user/username"),
                    "password": oViewModel.getProperty("/user/password")
                }),
                success: function (oResult) {
                    console.log(oResult);
                    //					oViewModel.setProperty("/user/password", "");
                    oViewModel.setProperty("/user/access_token", oResult.id);
                    oViewModel.setProperty("/user/userId", oResult.userId);
                    oViewModel.setProperty("/user/login", true);
                    // set access token as header in odatamodel
                    if (oData) {
                        oData.setHeaders({
                            "Authorization": oResult.id
                        });
                    }
                    ;
                    models_1.default.getUserFromDB(oResult.id, oResult.userId);
                    models_1.default.setUser(oResult.id, oResult.userId);
                    // navigation zurück
                    oRouter.navTo("worklist");
                    //oRouter.go(-1);
                },
                error: function (oJqXHR, sTextStatus, sErrorThrown) {
                    console.log(oJqXHR.responseText);
                    oViewModel.setProperty("/user/password", "");
                    oViewModel.setProperty("/user/login", false);
                }
            });
            //clear the password 
            oViewModel.setProperty("/user/password", "");
        };
        /**
         * if press the cancel button to clear input and go history back
         * @param {sap.ui.base.Event} oEvent
         */
        Login.prototype.onDialogCancelButton = function (oEvent) {
            history.go(-1);
        };
        /**
         * Event handler for navigating back.
         * We navigate back in the browser historz
         * @public
         */
        Login.prototype.onNavBack = function () {
            history.go(-1);
        };
        /**
         * Event handler for refresh event. Keeps filter, sort
         * and group settings and refreshes the list binding.
         * @public
         */
        Login.prototype.onRefresh = function () {
            //this._oTable.getBinding("items").refresh();
        };
        Login = __decorate([
            UI5("manny.client.worklist.controller.Login")
        ], Login);
        return Login;
    }(BaseController_1.default));
    exports.default = Login;
});
//# sourceMappingURL=Login.controller.js.map