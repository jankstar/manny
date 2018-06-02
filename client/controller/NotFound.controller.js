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
define(["require", "exports", "./BaseController", "../lib/models"], function (require, exports, BaseController_1, models_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NotFound = /** @class */ (function (_super) {
        __extends(NotFound, _super);
        function NotFound() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Navigates to the worklist when the link is pressed
         * @public
         */
        NotFound.prototype.onLinkPressed = function () {
            this.getRouter().navTo("worklist");
        };
        /**
        * @param {sap.ui.base.Event} oEvent the update finished event
        * @public
        */
        NotFound.prototype.onAfterRendering = function () {
            // update the worklist's object counter after the table update
            if (models_1.default.checkUser() == false) {
                //erst einmal login ausführen
                this.getRouter().navTo("login");
            }
            ;
        };
        NotFound = __decorate([
            UI5("manny.client.worklist.controller.NotFound")
        ], NotFound);
        return NotFound;
    }(BaseController_1.default));
    exports.default = NotFound;
});
//# sourceMappingURL=NotFound.controller.js.map