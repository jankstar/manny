import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";

@UI5("manny.client.worklist.controller.App")
export default class App extends BaseController {

    public onInit() {
        var oViewModel: JSONModel,
            fnSetAppNotBusy,
            iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

        oViewModel = new JSONModel({
            busy: true,
            delay: 0
        }, true);

        this.setModel(oViewModel, "appView");

        fnSetAppNotBusy = () => {
            oViewModel.setProperty("/busy", false);
            oViewModel.setProperty("/delay", iOriginalBusyDelay);
        };

        (<sap.ui.model.odata.v2.ODataModel> this.getOwnerComponent().getModel()).metadataLoaded().
            then(fnSetAppNotBusy);

        // apply content density mode to root view
        this.getView().addStyleClass((<any> this.getOwnerComponent()).getContentDensityClass());
    }
}