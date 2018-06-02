import BaseController from "./BaseController";
import mannyModel from "../lib/models";

@UI5("manny.client.worklist.controller.NotFound")
export default class NotFound extends BaseController {
    /**
     * Navigates to the worklist when the link is pressed
     * @public
     */
    public onLinkPressed() {
        this.getRouter().navTo("worklist");
    }

    /**
    * @param {sap.ui.base.Event} oEvent the update finished event
    * @public
    */
    public onAfterRendering() {
        // update the worklist's object counter after the table update

        if (mannyModel.checkUser() == false) {
            //erst einmal login ausführen
            this.getRouter().navTo("login");
        };
    }
}