var express = require("express");
var app = express();
var bodyParser       = require("body-parser");
var mongoose         = require("mongoose");

// APP CONFIG
mongoose.connect("mongodb://localhost/chess_eos");
app.set("view engine", "ejs");
app.use(express.static("public"));

// MONGOOSE/MODEL CONFIG
var moveSchema = new mongoose.Schema({
    player: String,
    move: String,
    created: {type: Date, default: Date.now()}
});

var Move = mongoose.model("Move", moveSchema);

var data = [
    {
        player: "Cloud's rest", 
        move: "RE1"
    },
    {
        player: "Cloud's rest", 
        move: "RE4"
    },
    {
        player: "Cloud's rest", 
        move: "RE6"
    }
]

function seedDB(){
    // Remove all campgrounds
    Move.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed moves!");
        data.forEach(function(seed){
            Move.create(seed, function(err, move){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a move");
                }; 
            });
        });
    });
};

seedDB()

// SETUP RESOURCES TO BE USED
app.use("/js", express.static(__dirname + '/js'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/img/chesspieces/wikipedia", express.static(__dirname + '/img/chesspieces/wikipedia'));
app.use("/stylesheets", express.static(__dirname + '/stylesheets'));

// INDEX ROUTE
app.get("/", function(req, res) {
    Move.find({}, function(err, allMoves){
        if(err){
            console.log(err);
        } else {
           res.render("index",{moves : allMoves});
        }
     });
});

// SERVER PROCESS
app.listen(3001, 'localhost', function() {
    console.log("server is up...");
});