define(["require", "exports", "sap/ui/model/odata/v2/ODataModel"], function (require, exports, ODataModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        userData: {
            "name": "",
            "token": "",
            "id": 0
        },
        /**
         * @function createDeviceModel
         * @description erstellt ein odataModel und ermittelt ggf. aus cookie das User-Token
         */
        createDeviceModel: function (accessToken) {
            if (accessToken) {
                if (this.userData.token != accessToken) {
                    this.userData.name = "";
                    this.userData.token = accessToken;
                }
                ;
            }
            else {
                // kein token mitgegeben -> aus cookie
                if (!this.userData.token) {
                    this.getUser();
                }
                ;
            }
            ;
            var sOrigin = window.location.origin + '/odata';
            var oModel = new ODataModel_1.default(sOrigin, {
                useBatch: false,
                headers: { "Authorization": this.userData.token }
            });
            oModel.setDefaultBindingMode("OneWay");
            return oModel;
        },
        /**************************************************************
        *
        */
        getUserFromDB: function (i_token, i_id) {
            if (!i_token && !this.userData.token || !i_id) {
                return;
            }
            ;
            var _this = this;
            var l_url = "/api/Users/" + i_id;
            jQuery.ajax({
                type: "GET",
                contentType: "application/json",
                url: l_url,
                dataType: "json",
                async: false,
                headers: {
                    "Authorization": i_token
                },
                //data: JSON.stringify({
                //}),
                success: function (oResult) {
                    console.log(oResult);
                    _this.userData.name = oResult.username;
                    _this.userData.id = oResult.id;
                    _this.userData.token = i_token;
                },
                error: function (oJqXHR, sTextStatus, sErrorThrown) {
                    console.log(oJqXHR.responseText);
                    _this.userData.token = _this.userData.name = _this.userData.id = "";
                }
            });
        },
        /****************************************************************
         *
         */
        checkUser: function () {
            if (!this.userData.token) {
                return false;
            }
            ;
            if (!this.userData.id) {
                return false;
            }
            ;
            return true;
        },
        /*******************************************************************
         * @function getUser
         * @returns userDate json
         * @description liefert die User-Daten zurück; wenn kein token, dann
         *              wird dieses aus cookie ermitelt
         */
        getUser: function () {
            //token schon da?
            if (this.userData.token && this.userData.id) {
                if (!this.userData.name) {
                    this.getUserFromDB(this.userData.token, this.userData.id);
                }
                ;
                return this.userData;
            }
            ;
            var l_token = "manytoken" + "=";
            var l_id = "manyid" + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            this.userData.token = "";
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(l_token) == 0) {
                    this.userData.token = c.substring(l_token.length, c.length);
                    if (l_token && l_id) { }
                    ;
                }
                ;
                if (c.indexOf(l_id) == 0) {
                    this.userData.token = c.substring(l_token.length, c.length);
                    if (l_token && l_id) { }
                    ;
                }
            }
            ;
            if (this.userData.token && this.userData.id) {
                this.getUserFromDB(this.userData.token, this.userData.id);
            }
            ;
            return this.userData;
        },
        /*************************************************************
         *
         */
        setUser: function (i_token, i_id) {
            var l_d = new Date();
            var l_token = encodeURIComponent(i_token);
            var l_id = encodeURIComponent(i_id);
            l_d.setTime(l_d.getTime() + (1 * 24 * 60 * 60 * 1000));
            var l_expires = "expires=" + l_d.toUTCString();
            document.cookie = "mannytoken" + "=" + l_token + ";" + l_expires + ";path=/";
            document.cookie = "mannyid" + "=" + l_id + ";" + l_expires + ";path=/";
        },
        /*************************************************************
         *
         */
        clearUser: function () {
            this.setUser("", "");
        },
    };
});
//# sourceMappingURL=models.js.map