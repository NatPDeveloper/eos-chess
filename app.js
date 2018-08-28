const express = require("express");
const app = express();
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

// actionWatcher.watch() // Start watch loop

// SOCKET IO SETUP
var server = app.listen(3000);
var io = require('socket.io')(server);

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

//MONGOOSE/MODEL CONFIG
var playersSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    layer: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Player"
        },
        username: String
    },
    wins: {type: Number, default: '0'},
    losses: {type: Number, default: '0'},
    draws: {type: Number, default: '0'},
    matches: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Match"
        }
    ],
    created: {type: Date, default: Date.now()}
});

var matchSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    player: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Player"
        },
        username: String
    },
    opponent: String,
    status: {type: String, default: "Game in progress ..."}, // WIN / DRAW / LOOSE (if player leaves, other player wins)
    tx_id: String,
    moves: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Move"
        }
     ],
    created: {type: Date, default: Date.now()}
});

var moveSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    player: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Player"
        },
        username: String
    },
    piece: String,
    from: String,
    to: String,
    created: {type: Date, default: Date.now()}
});

var playerSchema = mongoose.Schema({
    username: String,
    created: {type: Date, default: Date.now()}
});

var Players = mongoose.model("Players", playersSchema);
var Match = mongoose.model("Match", matchSchema);
var Move = mongoose.model("Move", moveSchema);
var Player = mongoose.model("Player", playerSchema);

var the_players = [
    {
        player: {
            username:'test1'
        },
        wins: '1',
        losses: '0',
        draws: '2'
    },
    {
        player: {
            username:'test1'
        },
        wins: '1',
        losses: '0',
        draws: '2'
    },
    {
        player: {
            username:'test1'
        }
    }
]

var matches = [
    { 
        matchId: '35000f32ef542f2b8e693fee15b73dddd433b18484070120b4ddf4f112c17221',
        opponent: 'test2',
        status: 'DRAW' // WIN / DRAW / LOOSE (if player leaves, other player wins)
    },
    { 
        matchId: '35000f32ef542f2b8e693fee15b73dddd433b18484070120b4ddf4f112c17221',
        opponent: 'test2',
        status: 'WIN' // WIN / DRAW / LOOSE (if player leaves, other player wins)
    },
    { 
        matchId: '35000f32ef542f2b8e693fee15b73dddd433b18484070120b4ddf4f112c17221',
        opponent: 'test2',
        status: 'LOSS' // WIN / DRAW / LOOSE (if player leaves, other player wins)
    },
    { 
        opponent: 'test2', // SHOULD SAY TBD
    }
]

var moves = [
    { 
        piece: 'p',
        from: 'a4',
        to: 'a5' 
    },
    { 
        piece: 'p',
        from: 'a4',
        to: 'a5' 
    },
    { 
        piece: 'p',
        from: 'a4',
        to: 'a5' 
    },
]

function seedDB(){
    // Remove all campgrounds
    Players.remove({}, function(err){
        if(err){
            console.log(err);
        }
        Match.remove({}, function(err){
            if(err){
                console.log(err);
            }
            console.log("removed moves!");
            the_players.forEach(function(seed){
                Players.create(seed, function(err, player){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("added a player");
                        Match.create(
                            {
                                player: {
                                    username:'test1'
                                },
                                opponent: "test2",
                                tx_id: "35000f32ef542f2b8e693fee15b73dddd433b18484070120b4ddf4f112c17221",
                                // moves: 
                                // [{
                                //     player: "test1",
                                //     piece: 'p',
                                //     from: 'a4',
                                //     to: 'a5' 
                                // }],
                            }, function(err, match){
                                if(err){
                                    console.log(err);
                                } else {
                                    player.matches.push(match);
                                    player.save();
                                    console.log("Created new match");
                                }
                        });
                        // Move.create(
                        //     {
                        //         player: "test1",
                        //         piece: 'p',
                        //         from: 'a4',
                        //         to: 'a5' 
                        //     }, function(err, move){
                        //         if(err){
                        //             console.log(err);
                        //         } else {
                        //             matches.moves.push(move);
                        //             matches.save();
                        //             console.log("Created new match");
                        //         }
                        // });
                    }; 
                });
            });
        });
    });
};

// seedDB()

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
    Players.find({}, function(err, allPlayers){
        if(err){
            console.log(err);
        } else {
           res.render("stats",{players : allPlayers});
        }
     });
});

app.get("/matches", function(req, res){
    Match.find({}, function(err, allMatches){
        if(err){
            console.log(err);
        } else {
           res.render("matches",{matches : allMatches});
        }
     });
});

app.get("/moves", function(req, res){
    res.render('moves');
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

module.exports = app;

// http.listen(3000, function(){
//     console.log('listening on *:3000');
// });