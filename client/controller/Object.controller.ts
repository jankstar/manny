import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import History from "sap/ui/core/routing/History";
import formatter from "../lib/formatter";

@UI5("manny.client.worklist.controller.Object")
export default class Object extends BaseController {

    public formatter = formatter;

    /* =========================================================== */
    /* lifecycle methods                                           */
    /* =========================================================== */

    /**
     * Called when the worklist controller is instantiated.
     * @public
     */
    public onInit() {
        // Model used to manipulate control states. The chosen values make sure,
        // detail page is busy indication immediately so there is no break in
        // between the busy indication for loading the view's meta data
        var iOriginalBusyDelay: any,
            oViewModel = new JSONModel({
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
        }
        );
    }

    /* =========================================================== */
    /* event handlers                                              */
    /* =========================================================== */


    /**
     * Event handler  for navigating back.
     * It there is a history entry we go one step back in the browser history
     * If not, it will replace the current entry of the browser history with the worklist route.
     * @public
     */
    public onNavBack() {
        var sPreviousHash = History.getInstance().getPreviousHash();

        if (sPreviousHash !== undefined) {
            history.go(-1);
        } else {
            this.getRouter().navTo("worklist", {}, true);
        }
    }

    /* =========================================================== */
    /* internal methods                                            */
    /* =========================================================== */

    /**
     * Binds the view to the object path.
     * @function
     * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
     * @private
     */
    private _onObjectMatched(oEvent: sap.ui.base.Event) {
        var sObjectId = oEvent.getParameter("arguments").id;
        this.getModel().metadataLoaded().then(function () {
            var sObjectPath = this.getModel().createKey("property", {
                id: sObjectId
            });
            this._bindView("/" + sObjectPath);
        }.bind(this));
    }

    /**
     * Binds the view to the object path.
     * @function
     * @param {string} sObjectPath path to the object to be bound
     * @private
     */
    private _bindView(sObjectPath: string) {
        var oViewModel = this.getModel("objectView"),
            oDataModel = this.getModel();

        this.getView().bindElement({
            path: sObjectPath,
            events: {
                change: this._onBindingChange.bind(this),
                dataRequested: () => {
                    oDataModel.metadataLoaded().then(function () {
                        // Busy indicator on view should only be set if metadata is loaded,
                        // otherwise there may be two busy indications next to each other on the
                        // screen. This happens because route matched handler already calls '_bindView'
                        // while metadata is loaded.
                        oViewModel.setProperty("/busy", true);
                    });
                },
                dataReceived: () => {
                    oViewModel.setProperty("/busy", false);
                }
            }
        });
    }

    /**
     * Binds the view to the object path.
     * @function
     * @private
     */
    private _onBindingChange() {
        var oView = this.getView(),
            oViewModel = this.getModel("objectView"),
            oElementBinding = oView.getElementBinding();

        // No data for the binding
        if (!oElementBinding.getBoundContext()) {
            this.getRouter().getTargets().display("objectNotFound");
            return;
        }

        var oResourceBundle = this.getResourceBundle(),
            oObject = oView.getBindingContext().getObject(),
            sObjectId = oObject.ObjectID,
            sObjectName = oObject.Name;

        // Everything went fine.
        oViewModel.setProperty("/busy", false);
        oViewModel.setProperty("/shareSendEmailSubject",
            oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
        oViewModel.setProperty("/shareSendEmailMessage",
            oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
    }

}