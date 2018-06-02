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
define(["require", "exports", "./BaseController", "sap/ui/model/json/JSONModel", "sap/ui/core/routing/History", "../lib/formatter"], function (require, exports, BaseController_1, JSONModel_1, History_1, formatter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Object = /** @class */ (function (_super) {
        __extends(Object, _super);
        function Object() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.formatter = formatter_1.default;
            return _this;
        }
        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */
        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        Object.prototype.onInit = function () {
            // Model used to manipulate control states. The chosen values make sure,
            // detail page is busy indication immediately so there is no break in
            // between the busy indication for loading the view's meta data
            var iOriginalBusyDelay, oViewModel = new JSONModel_1.default({
                busy: true,
                delay: 0
            }, true);
            this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
            // Store original busy indicator delay, so it can be restored later on
            iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
            this.setModel(oViewModel, "objectView");
            this.getOwnerComponent().getModel().metadataLoaded().then(function () {
                // Restore original busy indicator delay for the object view
                oViewModel.setProperty("/delay", iOriginalBusyDelay);
            });
        };
        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */
        /**
         * Event handler  for navigating back.
         * It there is a history entry we go one step back in the browser history
         * If not, it will replace the current entry of the browser history with the worklist route.
         * @public
         */
        Object.prototype.onNavBack = function () {
            var sPreviousHash = History_1.default.getInstance().getPreviousHash();
            if (sPreviousHash !== undefined) {
                history.go(-1);
            }
            else {
                this.getRouter().navTo("worklist", {}, true);
            }
        };
        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */
        /**
         * Binds the view to the object path.
         * @function
         * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
         * @private
         */
        Object.prototype._onObjectMatched = function (oEvent) {
            var sObjectId = oEvent.getParameter("arguments").id;
            this.getModel().metadataLoaded().then(function () {
                var sObjectPath = this.getModel().createKey("property", {
                    id: sObjectId
                });
                this._bindView("/" + sObjectPath);
            }.bind(this));
        };
        /**
         * Binds the view to the object path.
         * @function
         * @param {string} sObjectPath path to the object to be bound
         * @private
         */
        Object.prototype._bindView = function (sObjectPath) {
            var oViewModel = this.getModel("objectView"), oDataModel = this.getModel();
            this.getView().bindElement({
                path: sObjectPath,
                events: {
                    change: this._onBindingChange.bind(this),
                    dataRequested: function () {
                        oDataModel.metadataLoaded().then(function () {
                            // Busy indicator on view should only be set if metadata is loaded,
                            // otherwise there may be two busy indications next to each other on the
                            // screen. This happens because route matched handler already calls '_bindView'
                            // while metadata is loaded.
                            oViewModel.setProperty("/busy", true);
                        });
                    },
                    dataReceived: function () {
                        oViewModel.setProperty("/busy", false);
                    }
                }
            });
        };
        /**
         * Binds the view to the object path.
         * @function
         * @private
         */
        Object.prototype._onBindingChange = function () {
            var oView = this.getView(), oViewModel = this.getModel("objectView"), oElementBinding = oView.getElementBinding();
            // No data for the binding
            if (!oElementBinding.getBoundContext()) {
                this.getRouter().getTargets().display("objectNotFound");
                return;
            }
            var oResourceBundle = this.getResourceBundle(), oObject = oView.getBindingContext().getObject(), sObjectId = oObject.ObjectID, sObjectName = oObject.Name;
            // Everything went fine.
            oViewModel.setProperty("/busy", false);
            oViewModel.setProperty("/shareSendEmailSubject", oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
            oViewModel.setProperty("/shareSendEmailMessage", oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
        };
        Object = __decorate([
            UI5("manny.client.worklist.controller.Object")
        ], Object);
        return Object;
    }(BaseController_1.default));
    exports.default = Object;
});
//# sourceMappingURL=Object.controller.js.map