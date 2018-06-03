# Manny

## Project
The project use 
- [LoopBack](http://loopback.io)
- [n_odata_server](https://github.com/htammen/n-odata-server)
- [SAPUI5](https://sapui5.hana.ondemand.com/)

## Loopback 

### Odata-Server
change `component-config.json` for Odata-Server customizing 
```
  "n-odata-server": {
    "path": "/odata/*",
    "odataversion": "2",
    "useViaMiddleware": true
  }
```


