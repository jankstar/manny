/*global history */
import Controller from "sap/ui/core/mvc/Controller";
import History from "sap/ui/core/routing/History";
import UIComponent from "sap/ui/core/UIComponent";

@UI5("manny.client.worklist.controller.BaseController")
export default class BaseController extends Controller {

	/**
	 * Convenience method for accessing the router.
	 * @public
	 * @returns {sap.ui.core.routing.Router} the router for this component
	 */
    public getRouter(): sap.ui.core.routing.Router {
        return (<sap.ui.core.UIComponent>this.getOwnerComponent()).getRouter();
    }

    /**
      * Convenience method for getting the view model by name.
      * @public
      * @param {string} [sName] the model name
      * @returns {sap.ui.model.Model} the model instance
      */
    public getModel<T extends sap.ui.model.json.JSONModel = sap.ui.model.json.JSONModel>(sName?: string): T {
        return <T>this.getView().getModel(sName);
    }

    /**
      * Convenience method for setting the view model.
      * @public
      * @param {sap.ui.model.Model} oModel the model instance
      * @param {string} sName the model name
      * @returns {sap.ui.mvc.View} the view instance
      */
    public setModel(oModel: sap.ui.model.Model, sName?: string | undefined): sap.ui.core.mvc.View {
        let view = this.getView();
        view.setModel(oModel, sName);
        return view;
    }

    /**
      * Getter for the resource bundle.
      * @public
      * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
      */
    public getResourceBundle(): typeof jQuery.sap.util.ResourceBundle {
        let resourceModel = <sap.ui.model.resource.ResourceModel>this.getOwnerComponent().getModel("i18n");
        return <any>resourceModel.getResourceBundle();
    }

    /**
     * Convenience method for getting the typed owner component.
     * @public
     * @override
     * @returns {typescript.example.ui5app.Component} the owner component
     */
    public getOwnerComponent(): UIComponent {
        return <UIComponent>super.getOwnerComponent();
    }

    /**
     * Convenience method for getting an typed element by Id.
     * @public
     * @override
     * @returns the element
     */
    public byId<T extends sap.ui.core.Element>(sId: string): T {
        return <T>super.byId(sId);
    }

    /**
      * Event handler when the share by E-Mail button has been clicked
      * @public
      */
    public onShareEmailPress() {
        var oViewModel = (this.getModel("objectView") || this.getModel("worklistView"));
        sap.m.URLHelper.triggerEmail(
            '',
            oViewModel.getProperty("/shareSendEmailSubject"),
            oViewModel.getProperty("/shareSendEmailMessage")
        );
    }

    /**
      * 
      */
    public getUser() {

    }
}
