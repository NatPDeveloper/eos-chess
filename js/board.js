function Board(scatter){
    var socket= io();
    var chess = Chess();
    var chessEngine;
    var color;
    console.log(window);

    var isStockfishOn = true; // true until a player connects;
    // var statusEl = $('#status');
    var onDragStart = function(source, piece, position, orientation) {
        if(chess.in_checkmate()){
            var confirm = window.confirm("You Lost! Reset the game?");
            if(confirm){
                if(isStockfishOn){
                    chess.reset();
                    board.start();
                } else {
                    socket.requestNewGame();
                }
            }
        }
        if ((orientation === 'white' && piece.search(/^w/) === -1) ||
                (orientation === 'black' && piece.search(/^b/) === -1)) {
                return false;
            }
      };

      var onDrop = function(source, target) {
        // see if the move is legal
        var turn = chess.turn();
        var move = chess.move({
            from: source,
            to: target
        });

        // illegal move
        if (move === null) return 'snapback';
        //player just end turn, CPU starts searching after a second
        if(isStockfishOn)
            window.setTimeout(chessEngine.prepareAiMove(),500);
        else { 
            socket.sendMove(turn, move.from, move.to);
            if(move.color == "w"){
                document.querySelector("h3").style.backgroundColor = "black";
                document.querySelector("h3").style.color = "white";
                document.querySelector("h3").innerHTML = "BLACK TO MOVE"
                console.log("changed to black LOCALLY");
            } else if(move.color == "b") {
                document.querySelector("h3").style.backgroundColor = "white";
                document.querySelector("h3").style.color = "black";
                document.querySelector("h3").innerHTML = "WHITE TO MOVE"
                console.log("changed to white LOCALLY");
            } else {
                console.log("not needed");
            }
        }
        // ADDS LI TO MOVES LIST AFTER DROP EVENT #NOT DRY
        var list = document.getElementById('moves');
        var entry = document.createElement('li');
        entry.setAttribute("class", "playerMoves");
        entry.appendChild(document.createTextNode(move.from + " to " + move.to));
        list.prepend(entry);

        var scatterMove = move.from + " to " + move.to;
        scatter.setMove(scatterMove)
    };

    var updateStatus= function(){
        var status = "";
        var moveColor = "White";
        
        var status = "";
        var moveColor = "White";
        if(chess.turn()=='b'){   
            moveColor = "Black";
        }
        if(chess.in_checkmate()==true){
            status=  "You won, " + moveColor + " is in checkmate";
            window.alert(status);
            if(isStockfishOn){
                chess.reset();
                board.start();
            }
            return; 

            } else if(chess.in_draw()){
                status = "Game Over, Drawn";
                window.alert(status);
                return;
            } else {
                status = moveColor + ' to move';
                // check?
                if (chess.in_check() === true) {
                    status += ', ' + moveColor + ' is in check';
                }
        
            }
        // statusEl.html(status);
    };
    
    updateStatus();

    var cfg = {
        showErrors: true,
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
    };

    var board = new ChessBoard('board', cfg);
    
    return {
        competingHuman:function(){
            isStockfishOn=false;
        },
        competingCpu:function(){
            isStockfishOn=true;
        }, setSocket:function(newSocket){
            socket = newSocket;
        }, setChessEngine:function(engine){
            chessEngine = engine;
        },setOrientation:function(playerColor){
            color = playerColor.charAt(0).toLowerCase();
            if(color=='w' || color=='b')
                board.orientation(playerColor);
        },setFenPosition:function(){
            board.position(chess.fen());
        },getMoveHistory:function(){
            return chess.history({verbose:true});
        }, getPgn:function(){
            return chess.pgn();
        }, getPos:function(pos){
            var a = chess.get(pos.type);
            console.log(a);
            return a;
        }, getFen:function(){
            return chess.fen();
        }, getTurn:function(){
            return chess.turn();
        }, isCompetingCpu:function(){
            return isStockfishOn;
        }, isGameOver:function(){
            return chess.game_over();
        }, makeMove:function(source, target, promo ){
            chess.move({from:source,to:target,promotion:promo});
        }, reset:function(){
            chess.reset();
            board.start();
        },startBoard:function(){
            board.start();
        }
    }
    
}