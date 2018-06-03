# Manny

testing for Loopback and SapUi5-client.

## Project
this project use 
- [LoopBack](http://loopback.io)
- [n_odata_server](https://github.com/htammen/n-odata-server)
- [SAPUI5](https://sapui5.hana.ondemand.com/)

## Loopback Server 

### Odata-Server
change `component-config.json` for Odata-Server customizing 
```
  "n-odata-server": {
    "path": "/odata/*",
    "odataversion": "2",
    "useViaMiddleware": true
  }
```

### Autorization
autorization with header token is activ and `sap.ui.model.odata.v2.ODataModel` need options `headers: {"Authorization":"xx"}`  


### Initialization
at boot-time `init_db` will set an `admin` user by default

# SAPUi5 Client
library `models.ts` will handle users with autorization-token
if no token found, `Login.view' will start 

