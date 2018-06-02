import BaseController from "manny/client/worklist/controller/BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import formatter from "../lib/formatter";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import mannyModels from "manny/client/worklist/lib/models";

@UI5("manny.client.worklist.controller.Login")
export default class Login extends BaseController {

    public formatter = formatter;


    /* =========================================================== */
    /* lifecycle methods                                           */
    /* =========================================================== */

    /**
     * Called when the login controller is instantiated.
     * @public
     */
    public onInit() {

        var oView = this.getView(),
            oCore = sap.ui.getCore();


        //LoginDialog data model
        var oViewModel = new JSONModel({
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
    }

    /* =========================================================== */
    /* event handlers                                              */
    /* =========================================================== */

    /**
     * if press the submis button to login
     * @param {sap.ui.base.Event} oEvent
     */
    onDialogSubmitButton(oEvent: sap.ui.base.Event) {

        var oView = this.getView(),
            oViewModel = oView.getModel(),
            oRouter = this.getRouter(),
            oCore = sap.ui.getCore(),
            oApp = oCore.byId("app"),
            oData = oView.oParent.oParent.oParent.getModel();
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
                };
                mannyModels.getUserFromDB(oResult.id, oResult.userId);
                mannyModels.setUser(oResult.id, oResult.userId);

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
    }

    /**
     * if press the cancel button to clear input and go history back 
     * @param {sap.ui.base.Event} oEvent
     */
    public onDialogCancelButton(oEvent: sap.ui.base.Event) {
        history.go(-1);
    }


    /**
     * Event handler for navigating back.
     * We navigate back in the browser historz
     * @public
     */
    public onNavBack() {
        history.go(-1);
    }



    /**
     * Event handler for refresh event. Keeps filter, sort
     * and group settings and refreshes the list binding.
     * @public
     */
    public onRefresh() {
        //this._oTable.getBinding("items").refresh();
    }

}