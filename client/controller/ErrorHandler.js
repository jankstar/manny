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
define(["require", "exports", "sap/ui/base/Object", "sap/m/MessageBox"], function (require, exports, Object_1, MessageBox_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ErrorHandler = /** @class */ (function (_super) {
        __extends(ErrorHandler, _super);
        /**
         * Handles application errors by automatically attaching to the model events and displaying errors when needed.
         * @class
         * @param {sap.ui.core.UIComponent} oComponent reference to the app's component
         * @public
         * @alias sap.ui.demo.worklist.controller.ErrorHandler
         */
        function ErrorHandler(oComponent) {
            var _this = _super.call(this) || this;
            _this._oResourceBundle = oComponent.getModel("i18n").getResourceBundle();
            _this._oComponent = oComponent;
            _this._oModel = oComponent.getModel();
            _this._bMessageOpen = false;
            _this._sErrorText = _this._oResourceBundle.getText("errorText");
            _this._oModel.attachMetadataFailed(function (oEvent) {
                var oParams = oEvent.getParameters();
                this._showMetadataError(oParams.response);
            }, _this);
            var that = _this;
            _this._oModel.attachRequestFailed(function (oEvent) {
                var oParams = oEvent.getParameters();
                // An entity that was not found in the service is also throwing a 404 error in oData.
                // We already cover this case with a notFound target so we skip it here.
                // A request that cannot be sent to the server is a technical error that we have to handle though
                if (oParams.response.statusCode !== "404" || (oParams.response.statusCode === 404 && oParams.response.responseText.indexOf("Cannot POST") === 0)) {
                    that._showServiceError(oParams.response);
                }
            }, _this);
            return _this;
        }
        ;
        /**
         * Shows a {@link sap.m.MessageBox} when the metadata call has failed.
         * The user can try to refresh the metadata.
         * @param {string} sDetails a technical error to be displayed on request
         * @private
         */
        ErrorHandler.prototype._showMetadataError = function (sDetails) {
            MessageBox_1.default.error(this._sErrorText, {
                id: "metadataErrorMessageBox",
                details: sDetails,
                styleClass: this._oComponent.getContentDensityClass(),
                actions: [MessageBox_1.default.Action.RETRY, MessageBox_1.default.Action.CLOSE],
                onClose: function (sAction) {
                    if (sAction === MessageBox_1.default.Action.RETRY) {
                        this._oModel.refreshMetadata();
                    }
                }.bind(this)
            });
        };
        ;
        /**
         * Shows a {@link sap.m.MessageBox} when a service call has failed.
         * Only the first error message will be display.
         * @param {string} sDetails a technical error to be displayed on request
         * @private
         */
        ErrorHandler.prototype._showServiceError = function (sDetails) {
            if (this._bMessageOpen) {
                return;
            }
            this._bMessageOpen = true;
            MessageBox_1.default.error(this._sErrorText, {
                id: "serviceErrorMessageBox",
                details: sDetails,
                styleClass: this._oComponent.getContentDensityClass(),
                actions: [MessageBox_1.default.Action.CLOSE],
                onClose: function () {
                    this._bMessageOpen = false;
                }.bind(this)
            });
        };
        ErrorHandler = __decorate([
            UI5("manny.client.worklist.controller.ErrorHandler")
        ], ErrorHandler);
        return ErrorHandler;
    }(Object_1.default));
    exports.default = ErrorHandler;
});
//# sourceMappingURL=ErrorHandler.js.map