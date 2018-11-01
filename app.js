const express = require("express");
const app = express();
const morgan = require('morgan');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var dotenv = require('dotenv');
dotenv.config();
var url = "mongodb://trying:asdf1p@ds147723.mlab.com:47723/chesseos";
// process.env.MONGOLAB_URI;

// WIPE DB FOR DEMUX TO REBUILD DB
function delDB(){
    players.remove({}, function(err){
       if(err){
           console.log(err);
       }
    })
}
// delDB();

// DEMUX ACTION READER SETUP
const { NodeosActionReader } = require("demux-eos")
const MyActionHandler = require("./js/lib/demux-js/ActionHandler")
const { BaseActionWatcher } = require("demux")
const updaters = require("./js/lib/demux-js/updaters")
const effects = require("./js/lib/demux-js/effects") 

// OLD
// const actionReader = new NodeosActionReader(
//     "http://127.0.0.1:8888", // Locally hosted node needed for reasonable indexing speed
//     179000, // First actions relevant to this dapp happen at this block
// )

// NEW CONNECTION
const actionReader = new NodeosActionReader(
    "https://jungle.eosio.cr:443", // Locally hosted node needed for reasonable indexing speed
    22208700, // First actions relevant to this dapp happen at this block
)

const actionHandler = new MyActionHandler(
    updaters,
    effects,
)

const actionWatcher = new BaseActionWatcher(
    actionReader,
    actionHandler,
    1000, // Poll at twice the block interval for less latency
)

// actionWatcher.watch() // Start watch loop

// SERVER SETUP
const HOST = '0.0.0.0';
const PORT = process.env.PORT || 3000;
var server = app.listen(PORT, HOST, function () {
    console.log(`Our app is running on port ${ PORT }`);
});

// SOCKET IO SETUP
var io = require('socket.io')(server);

var players = require("./models/players.js");

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

// MONGO CONNECT
// mongoose.connect("mongodb://localhost/chess_eos");
mongoose.connect(url);

// APP CONFIG
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); // EXTRACTS JSON DATA
app.use(morgan('dev'));

// CHANGE * to MY SERVER SO ONLY I CAN INTERACT WITH API
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*'); // * Gives access to any client
//     // res.header(
//     //     'Access-Control-Allow-Headers', 
//     //     'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//     // );
//     // if (req.method === 'OPTIONS') {
//     //     res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
//     //     return res.status(200).json({});
//     // }
//     next();
// });

// SETUP RESOURCES TO BE USED
app.use("/js", express.static(__dirname + '/js'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/img/chesspieces/wikipedia", express.static(__dirname + '/img/chesspieces/wikipedia'));
app.use("/stylesheets", express.static(__dirname + '/stylesheets'));
app.use("/node_modules", express.static(__dirname + '/node_modules'));

// ROUTES
const indexRoutes = require('./routes/index.js')
app.use(indexRoutes);

const aboutRoutes = require('./routes/about.js')
app.use("/about", aboutRoutes);

const statRoutes = require('./routes/players.js')
app.use("/players", statRoutes);

// HANDLE ERRORS
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
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