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
define(["require", "exports", "sap/ui/core/mvc/Controller"], function (require, exports, Controller_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BaseController = /** @class */ (function (_super) {
        __extends(BaseController, _super);
        function BaseController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Convenience method for accessing the router.
         * @public
         * @returns {sap.ui.core.routing.Router} the router for this component
         */
        BaseController.prototype.getRouter = function () {
            return this.getOwnerComponent().getRouter();
        };
        /**
          * Convenience method for getting the view model by name.
          * @public
          * @param {string} [sName] the model name
          * @returns {sap.ui.model.Model} the model instance
          */
        BaseController.prototype.getModel = function (sName) {
            return this.getView().getModel(sName);
        };
        /**
          * Convenience method for setting the view model.
          * @public
          * @param {sap.ui.model.Model} oModel the model instance
          * @param {string} sName the model name
          * @returns {sap.ui.mvc.View} the view instance
          */
        BaseController.prototype.setModel = function (oModel, sName) {
            var view = this.getView();
            view.setModel(oModel, sName);
            return view;
        };
        /**
          * Getter for the resource bundle.
          * @public
          * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
          */
        BaseController.prototype.getResourceBundle = function () {
            var resourceModel = this.getOwnerComponent().getModel("i18n");
            return resourceModel.getResourceBundle();
        };
        /**
         * Convenience method for getting the typed owner component.
         * @public
         * @override
         * @returns {typescript.example.ui5app.Component} the owner component
         */
        BaseController.prototype.getOwnerComponent = function () {
            return _super.prototype.getOwnerComponent.call(this);
        };
        /**
         * Convenience method for getting an typed element by Id.
         * @public
         * @override
         * @returns the element
         */
        BaseController.prototype.byId = function (sId) {
            return _super.prototype.byId.call(this, sId);
        };
        /**
          * Event handler when the share by E-Mail button has been clicked
          * @public
          */
        BaseController.prototype.onShareEmailPress = function () {
            var oViewModel = (this.getModel("objectView") || this.getModel("worklistView"));
            sap.m.URLHelper.triggerEmail(null, oViewModel.getProperty("/shareSendEmailSubject"), oViewModel.getProperty("/shareSendEmailMessage"));
        };
        /**
          *
          */
        BaseController.prototype.getUser = function () {
        };
        BaseController = __decorate([
            UI5("manny.client.worklist.controller.BaseController")
        ], BaseController);
        return BaseController;
    }(Controller_1.default));
    exports.default = BaseController;
});
//# sourceMappingURL=BaseController.js.map