function SocketClient(){
    // change to SocketClient.js instead of main
    var game; // attach the game board and engine
    var room; // testing
    var socket = io.connect();   
    var engineGame;
        board = Board();
        board.setChessEngine(engine);
        engine.setBoard(board);
        engine.reset();
        engine.setDepth();
        engine.setPlayerColor("white");
        engine.start();
        var list = document.getElementById('moves');
        var entry = document.createElement('li');

        // // // SOCKETIO LOGIC        
        socket = io();
        
        // submits room value from EOS account name box
        document.querySelector('#nameForm').addEventListener('submit', function (e) {
            e.preventDefault();
            var formInput = document.querySelector('#eosName');
            socket.emit("sendName",formInput.value);
            console.log(formInput.value);
            return false;
        });
        
        socket.on('roomId',function(roomId){
            room = roomId;
            console.log("set room to roomId " + room);
        })

        socket.on('sendMessage',function(message){
            console.log("hit send message" + message);
        })

        socket.on("joinRequestFrom",function(socketId){
            console.log("join request from " + socketId);
            if(board.isCompetingCpu()){
                var confirm = window.confirm("Join Request, Do you accept?");
                if(confirm){
                    socket.emit("joinRequestAnswer","yes",socketId);
                    board.setOrientation('white');
                    board.competingHuman();
                    board.reset();
                }
            } else {
                socket.emit("joinRequestAnswer","no",socketId);
            }
            
            while( list.firstChild ){
                list.removeChild( list.firstChild );
            }
        })

        socket.on("newGameRequest",function(){
            var confirm = window.confirm("You won! Opponent want to reset the game");
            if(confirm){
                socket.emit("newGame",room);
            }
        })
        socket.on("newGame",function(){
            board.start();
            socket.emit("newGameRequest",room);
        })
        socket.on("joinRoom",function(newRoom,host){
            window.alert("Joined room " + host);
            room = newRoom;
            board.reset();
            socket.emit("joinRoom",room);
            board.setOrientation('black');
            board.startBoard();
            board.competingHuman();
            while( list.firstChild ){
                list.removeChild( list.firstChild );
            }
        });

        // submits room value from EOS account name box
        document.querySelector('#hostForm').addEventListener('submit', function (e) {
            e.preventDefault();
            if(room)
                socket.emit("joinRequestTo",hostName.value);
            else{
                alert("You did not have a name");
            }
        });
        socket.on("changeColor",function(moveData){
            console.log("this is the moveData " + moveData.color);
            if(moveData.color == "w"){
                document.querySelector("h3").style.backgroundColor = "black";
                document.querySelector("h3").style.color = "white";
                document.querySelector("h3").innerHTML = "BLACK TO MOVE"
                console.log("changed to black");
            } else if(moveData.color == "b") {
                document.querySelector("h3").style.backgroundColor = "white";
                document.querySelector("h3").style.color = "black";
                document.querySelector("h3").innerHTML = "WHITE TO MOVE"
                console.log("changed to white");
            } else {
                console.log("not needed");
            }
        })
        
        socket.on('move',function(moveData){
            // ADDS LI TO MOVES LIST AFTER DROP EVENT #NOT DRY
            var list = document.getElementById('moves');
            var entry = document.createElement('li');
            entry.className = "playerMoves";
            entry.appendChild(document.createTextNode(moveData.from + " to " + moveData.to));
            list.prepend(entry);
            
            // Board().updateStatus();  
            var from,to,promo;
            from = moveData.from;
            to = moveData.to;
            promo = moveData.promo;
            board.makeMove(from, to,promo);
            board.setFenPosition();
        })

        socket.on('opponentDisconnect',function(){
            alert("Opponent left the room");
            board.setOrientation('white');
            board.reset();
            board.competingCpu();
            while( list.firstChild ){
                list.removeChild( list.firstChild );
            }
            document.querySelector("h3").style.backgroundColor = "white";
            document.querySelector("h3").style.color = "black";
            document.querySelector("h3").innerHTML = "WHITE TO MOVE"
        })
        return {
            setBoard:function(newBoard){
                board= newBoard;
            },
            sendMove:function(playerColor,source,target,promo){
                socket.emit("move",room,{color:playerColor, from:source,to:target,promotion:promo||''});
            },requestNewGame:function(){
                socket.emit("newGameRequest",room);
            }
        }
    }