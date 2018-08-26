var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// DEMUX ACTION READER SETUP
const { NodeosActionReader } = require("demux-eos")
const MyActionHandler = require("./js/ActionHandler")
const { BaseActionWatcher } = require("demux")
const updaters = require("./js/updaters")
const effects = require("./js/effects")

const actionReader = new NodeosActionReader(
    "http://127.0.0.1:8888", // Locally hosted node needed for reasonable indexing speed
    144438, // First actions relevant to this dapp happen at this block
)

const actionHandler = new MyActionHandler(
    updaters,
    effects,
)

const actionWatcher = new BaseActionWatcher(
    actionReader,
    actionHandler,
    250, // Poll at twice the block interval for less latency
)

actionWatcher.watch() // Start watch loop

// SOCKET FORWARD DECLARATIONS
var http = require('http').Server(app);
var io = require('socket.io')(http);

// USERS LIST
var users = []

// ROOM ID GENERATOR
function generateRoomId() {
    var result = "";
    var length = 16;
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-@";
  
    for (var i = 0; i < length; i++)
      result += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return result;
}

// APP CONFIG
mongoose.connect("mongodb://localhost/chess_eos");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// MONGOOSE/MODEL CONFIG
var moveSchema = new mongoose.Schema({
    player: String,
    roomId: String,
    move: String,
    created: {type: Date, default: Date.now()}
});

var Move = mongoose.model("Move", moveSchema);

var data = [
    {
        player: "Cloud's rest", 
        roomId: "df98as7dfa98sd7",
        move: "RE1"
    },
    {
        player: "Cloud's rest", 
        roomId: "df98as7gasd8sd7",
        move: "RE4"
    },
    {
        player: "Cloud's rest", 
        roomId: "dfgaddfa98sd7",
        move: "RE6"
    },
    {
        player: "Cloud's rest", 
        roomId: "df98aasdfa98sd7",
        move: "RE6"
    },
    {
        player: "Cloud's rest", 
        roomId: "df98asdf98sd7",
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
        // data.forEach(function(seed){
        //     Move.create(seed, function(err, move){
        //         if(err){
        //             console.log(err)
        //         } else {
        //             console.log("added a move");
        //         }; 
        //     });
        // });
    });
};

seedDB()

// SETUP RESOURCES TO BE USED
app.use("/js", express.static(__dirname + '/js'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/img/chesspieces/wikipedia", express.static(__dirname + '/img/chesspieces/wikipedia'));
app.use("/stylesheets", express.static(__dirname + '/stylesheets'));
app.use("/node_modules", express.static(__dirname + '/node_modules'));

// ROUTES
app.get("/", function(req, res) {
    Move.find({}, function(err, allMoves){
        if(err){
            console.log(err);
        } else {
           res.render("index",{moves : allMoves});
        }
     });
});

app.get("/about", function(req, res){
    res.render('about');
});

app.get("/stats", function(req, res){
    res.render('stats');
});

// SOCKET LOGIC
io.on('connection', function(socket) {
    socket.on('move', broadcastMove);
    function broadcastMove(room, moveData){
        socket.broadcast.to(room).emit("move",moveData);
        socket.broadcast.to(room).emit("changeColor",moveData);
        console.log(moveData.color);
    }

    socket.on('sendName',sendName)
    function sendName(name){
        var isNameValid = true;
        for(var i=0;i<users.length;i++){
            if(users[i].name===name){
                isNameValid = false;
                socket.emit('nameError','Name is already existed, Try again');
                return;
            }
        } 
        if(isNameValid){
            var room = generateRoomId();
            users.push({id:socket.id, name:name, room:room});
            socket.join(room);
            socket.emit("roomId",room);
        } 
    }
    
    socket.on("joinRoom",joinRoom);
    function joinRoom(room){
        console.log("joined room " + room);
        socket.broadcast.to(room).emit("sendMessage","SERVER : a user just joined");
        if(room){
            socket.join(room);
            console.log(room);
            for(var i = 0; i < users.length; i++){
                if(users[i].id == socket.id){
                    users[i].room = room;
                } else {
                    console.log("no match");
                }
            }
        }
    }

    socket.on("joinRequestTo",joinRequestTo)
    function joinRequestTo(name){
        console.log('sendRequest to ' + name);
        for(var i=0;i<users.length;i++){
            if(users[i].name===name){
                socket.broadcast.to(users[i].room).emit("joinRequestFrom",socket.id);
                break;
            }
        }
    }

    socket.on('newGame',newGame);
    function newGame(room){
        io.to(room).emit("newGame");
    }

    socket.on('newGameRequest',newGameRequest);
    function newGameRequest(room){
        if(room)
            socket.broadcast.to(room).emit("newGameRequest");
    }

    socket.on('joinRequestAnswer',joinRequestAnswer)
    function joinRequestAnswer(answer,socketId){
        var user = users.filter(user=>user.id == socket.id)[0];

        if(answer=="yes"){
            socket.to(socketId).emit("joinRoom",user.room, user.name);
        }
    }

    socket.on('disconnect',disconnect)
    function disconnect(){
        for(var i =0;i<users.length;i++){
            if(users[i].id == socket.id){
                socket.broadcast.to(users[i].room).emit("opponentDisconnect");
                users.splice(i,1);
                break;
            }
        }
    }
})

http.listen(3000, function(){
    console.log('listening on *:3000');
});