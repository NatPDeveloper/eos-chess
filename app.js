var express = require("express");
var app = express();
var bodyParser       = require("body-parser");
var mongoose         = require("mongoose");

var http = require('http')
  , https = require('https');

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.render("index");
});

// SERVER PROCESS
app.listen(3001, 'localhost', function() {
    console.log("... port %d in %s mode");
});