import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import formatter from "../lib/formatter";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import mannyModel from "../lib/models";

@UI5("manny.client.worklist.controller.Worklist")
export default class Worklist extends BaseController {

    public formatter = formatter;
    _oTable: any;
    // keeps the search state
    _oTableSearchState = [];

    /* =========================================================== */
    /* lifecycle methods                                           */
    /* =========================================================== */

    /**
     * Called when the worklist controller is instantiated.
     * @public
     */
    public onInit() {

        var oViewModel: any,
            iOriginalBusyDelay: any;

        this._oTable = this.byId("table");;

        // Put down worklist table's original value for busy indicator delay,
        // so it can be restored later on. Busy handling on the table is
        // taken care of by the table itself.
        iOriginalBusyDelay = this._oTable.getBusyIndicatorDelay();


        // Model used to manipulate control states
        oViewModel = new JSONModel({
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
    }

    /**
     * event after rendering worklist
     *  @public
     */
    public onAfterRendering(): void {
    }

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
    public onUpdateFinished(oEvent: sap.ui.base.Event) {
        // update the worklist's object counter after the table update
        var sTitle: string,
            oTable = <sap.m.Table> oEvent.getSource(),
            iTotalItems = oEvent.getParameter("total");
        // only update the counter if the length is final and
        // the table is not empty
        if (iTotalItems && (<sap.ui.model.ListBinding>oTable.getBinding("items")).isLengthFinal()) {
            sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
        } else {
            sTitle = this.getResourceBundle().getText("worklistTableTitle");
        }
        this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
    }

    /**
     * Event handler when a table item gets pressed
     * @param {sap.ui.base.Event} oEvent the table selectionChange event
     * @public
     */
    public onPress(oEvent: sap.ui.base.Event) {
        // The source is the list item that got pressed
        //			this._showObject(oEvent.getSource());
    }


    /**
     * Event handler for navigating back.
     * We navigate back in the browser historz
     * @public
     */
    public onNavBack() {
        //navigate back
        history.go(-1);
    }

    /**
     * Event search for search-field in the Table
     * @public
     */
    public onSearch(oEvent: sap.ui.base.Event) {
        if (oEvent.getParameters().refreshButtonPressed) {
            // Search field's 'refresh' button has been pressed.
            // This is visible if you select any master list item.
            // In this case no new search is triggered, we only
            // refresh the list binding.
            this.onRefresh();
        } else {
            // edit the search-field will chnage the query 
            // of the table by field name
            var oTableSearchState = new Array<Filter>();
            var sQuery = oEvent.getParameter("query");

            if (sQuery && sQuery.length > 0) {
                oTableSearchState = [new Filter("name", FilterOperator.Contains, sQuery)];
            }
            this._applySearch(oTableSearchState);
        }

    }

    /**
     * Event handler for refresh event. Keeps filter, sort
     * and group settings and refreshes the list binding.
     * @public
     */
    public onRefresh() {
        // refresch the table
        this._oTable.getBinding("items").refresh();
    }

    /**
     * Event detail button in table is press on 
     */
    public onDetailPress(oEvent: sap.ui.base.Event) {
        // The source is the list item that got pressed
        this._showObject(<sap.m.ObjectListItem> oEvent.getSource());
    }

    /**
     * event add button
     */
    public onDialogAddButton(oEvent: sap.ui.base.Event) {

    }
    /* =========================================================== */
    /* internal methods                                            */
    /* =========================================================== */

    /**
     * Shows the selected item on the object page
     * On phones a additional history entry is created
     * @param {sap.m.ObjectListItem} oItem selected Item
     * @private
     */
    private _showObject(oItem: sap.m.ObjectListItem) {
        this.getRouter().navTo("object", {
            id: oItem.getBindingContext().getProperty("id")
        });
    }

    /**
     * Internal helper method to apply both filter and search state together on the list binding
     * @param {object} oTableSearchState an array of filters for the search
     * @private
     */
    private _applySearch(oTableSearchState: Array<Filter>) {
        var oViewModel = this.getModel("worklistView");
        this._oTable.getBinding("items").filter(oTableSearchState, "Application");
        // changes the noDataText of the list in case there are no filter results
        if (oTableSearchState.length !== 0) {
            oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
        }
    }

    /**
     * Binds the view to the object path.
     * @function
     * @param {sap.ui.base.Event} oEvent pattern match event in route 'worklist'
     * @private
     */
    private _onObjectMatched(oEvent: sap.ui.base.Event) {

        if (mannyModel.checkUser() == false) {
            //erst einmal login ausführen
            this.getRouter().navTo("login");
        } else {
            //User in Button schreiben
            (<sap.m.Button>this.byId("button_user_id")).setText(mannyModel.getUser().name);
        };

        //			var sObjectId = oEvent.getParameter("arguments").id;
        //			this.getModel().metadataLoaded().then(function () {
        //				var sObjectPath = this.getModel().createKey("property", {
        //					id: sObjectId
        //				});
        //				this._bindView("/" + sObjectPath);
        //			}.bind(this));

        this.onRefresh();
    }


}