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
define(["require", "exports", "./BaseController", "sap/ui/model/json/JSONModel", "../lib/formatter", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "../lib/models"], function (require, exports, BaseController_1, JSONModel_1, formatter_1, Filter_1, FilterOperator_1, models_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Worklist = /** @class */ (function (_super) {
        __extends(Worklist, _super);
        function Worklist() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.formatter = formatter_1.default;
            // keeps the search state
            _this._oTableSearchState = [];
            return _this;
        }
        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */
        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        Worklist.prototype.onInit = function () {
            var oViewModel, iOriginalBusyDelay;
            this._oTable = this.byId("table");
            ;
            // Put down worklist table's original value for busy indicator delay,
            // so it can be restored later on. Busy handling on the table is
            // taken care of by the table itself.
            iOriginalBusyDelay = this._oTable.getBusyIndicatorDelay();
            // Model used to manipulate control states
            oViewModel = new JSONModel_1.default({
                worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
                saveAsTileTitle: this.getResourceBundle().getText("worklistViewTitle"),
                shareOnJamTitle: this.getResourceBundle().getText("worklistViewTitle"),
                shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
                shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
                tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
                tableBusyDelay: 0
            }, true);
            this.setModel(oViewModel, "worklistView");
            // Make sure, busy indication is showing immediately so there is no
            // break after the busy indication for loading the view's meta data is
            // ended (see promise 'oWhenMetadataIsLoaded' in AppController)
            this._oTable.attachEventOnce("updateFinished", function () {
                // Restore original busy indicator delay for worklist's table
                oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
            });
            // to be fire an event navigate to worklist
            this.getRouter().getRoute("worklist").attachPatternMatched(this._onObjectMatched, this);
        };
        /**
         * event after rendering worklist
         *  @public
         */
        Worklist.prototype.onAfterRendering = function () {
        };
        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */
        /**
         * Triggered by the table's 'updateFinished' event: after new table
         * data is available, this handler method updates the table counter.
         * This should only happen if the update was successful, which is
         * why this handler is attached to 'updateFinished' and not to the
         * table's list binding's 'dataReceived' method.
         * @param {sap.ui.base.Event} oEvent the update finished event
         * @public
         */
        Worklist.prototype.onUpdateFinished = function (oEvent) {
            // update the worklist's object counter after the table update
            var sTitle, oTable = oEvent.getSource(), iTotalItems = oEvent.getParameter("total");
            // only update the counter if the length is final and
            // the table is not empty
            if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
                sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
            }
            else {
                sTitle = this.getResourceBundle().getText("worklistTableTitle");
            }
            this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
        };
        /**
         * Event handler when a table item gets pressed
         * @param {sap.ui.base.Event} oEvent the table selectionChange event
         * @public
         */
        Worklist.prototype.onPress = function (oEvent) {
            // The source is the list item that got pressed
            //			this._showObject(oEvent.getSource());
        };
        /**
         * Event handler for navigating back.
         * We navigate back in the browser historz
         * @public
         */
        Worklist.prototype.onNavBack = function () {
            //navigate back
            history.go(-1);
        };
        /**
         * Event search for search-field in the Table
         * @public
         */
        Worklist.prototype.onSearch = function (oEvent) {
            if (oEvent.getParameters().refreshButtonPressed) {
                // Search field's 'refresh' button has been pressed.
                // This is visible if you select any master list item.
                // In this case no new search is triggered, we only
                // refresh the list binding.
                this.onRefresh();
            }
            else {
                // edit the search-field will chnage the query 
                // of the table by field name
                var oTableSearchState = [];
                var sQuery = oEvent.getParameter("query");
                if (sQuery && sQuery.length > 0) {
                    oTableSearchState = [new Filter_1.default("name", FilterOperator_1.default.Contains, sQuery)];
                }
                this._applySearch(oTableSearchState);
            }
        };
        /**
         * Event handler for refresh event. Keeps filter, sort
         * and group settings and refreshes the list binding.
         * @public
         */
        Worklist.prototype.onRefresh = function () {
            // refresch the table
            this._oTable.getBinding("items").refresh();
        };
        /**
         * Event detail button in table is press on
         */
        Worklist.prototype.onDetailPress = function (oEvent) {
            // The source is the list item that got pressed
            this._showObject(oEvent.getSource());
        };
        /**
         * event add button
         */
        Worklist.prototype.onDialogAddButton = function (oEvent) {
        };
        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */
        /**
         * Shows the selected item on the object page
         * On phones a additional history entry is created
         * @param {sap.m.ObjectListItem} oItem selected Item
         * @private
         */
        Worklist.prototype._showObject = function (oItem) {
            this.getRouter().navTo("object", {
                id: oItem.getBindingContext().getProperty("id")
            });
        };
        /**
         * Internal helper method to apply both filter and search state together on the list binding
         * @param {object} oTableSearchState an array of filters for the search
         * @private
         */
        Worklist.prototype._applySearch = function (oTableSearchState) {
            var oViewModel = this.getModel("worklistView");
            this._oTable.getBinding("items").filter(oTableSearchState, "Application");
            // changes the noDataText of the list in case there are no filter results
            if (oTableSearchState.length !== 0) {
                oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
            }
        };
        /**
         * Binds the view to the object path.
         * @function
         * @param {sap.ui.base.Event} oEvent pattern match event in route 'worklist'
         * @private
         */
        Worklist.prototype._onObjectMatched = function (oEvent) {
            if (models_1.default.checkUser() == false) {
                //erst einmal login ausführen
                this.getRouter().navTo("login");
            }
            else {
                //User in Button schreiben
                this.byId("button_user_id").setText(models_1.default.getUser().name);
            }
            ;
            //			var sObjectId = oEvent.getParameter("arguments").id;
            //			this.getModel().metadataLoaded().then(function () {
            //				var sObjectPath = this.getModel().createKey("property", {
            //					id: sObjectId
            //				});
            //				this._bindView("/" + sObjectPath);
            //			}.bind(this));
            this.onRefresh();
        };
        Worklist = __decorate([
            UI5("manny.client.worklist.controller.Worklist")
        ], Worklist);
        return Worklist;
    }(BaseController_1.default));
    exports.default = Worklist;
});
//# sourceMappingURL=Worklist.controller.js.map