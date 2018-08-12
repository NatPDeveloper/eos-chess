var express = require("express");
var app = express();
var bodyParser       = require("body-parser");
var mongoose         = require("mongoose");

app.set("view engine", "ejs");
app.use(express.static("public"));

// SETUP RESOURCES TO BE USED
app.use("/js", express.static(__dirname + '/js'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/img/chesspieces/wikipedia", express.static(__dirname + '/img/chesspieces/wikipedia'));
app.use("/stylesheets", express.static(__dirname + '/stylesheets'));

// ROUTES
app.get("/", function(req, res) {
    res.render("index");
});

// SERVER PROCESS
app.listen(3001, 'localhost', function() {
    console.log("... port %d in %s mode");
});