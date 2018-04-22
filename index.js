var path = require ("path");
var express = require("express");

// load an instance of app express
var app = express();

// link to html file
app.use(express.static(path.join(__dirname,"public")));
app.use("/bower_components", express.static(path.join(__dirname, "bower_components")));

// set the port
app.set("port", parseInt(process.argv[2]||3000));

//listen to port
app.listen(app.get("port"), function(){
    console.log("Application is on port %d at %s", app.get("port"), new Date())
})