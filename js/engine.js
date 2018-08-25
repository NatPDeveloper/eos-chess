function EngineGame(options){
    var board = Board();

    var stockFish = new Worker('../js/stockfish.js');

    var engine = stockFish;
    // show the engine status to the front end
    var isEngineReady = false; // default
    //var engineFeedback = null; // the format could be Depth: <something> Nps: <something> 

    var time = { depth:5 };
    var playerColor = "white"; //default


    //interface to send commands to the UCI
    function uciCmd(cmd){
        // console.log("[INPUT] UCI: " + cmd);
        engine.postMessage(cmd);
    }

    // tell the engine to use UCI
    uciCmd('uci');

    function reportEngineStatus(){
        var status = 'Engine ';
        if(!isEngineReady){
            status+='Loading ...';
        } else {
            status+='Ready';
        }
        $(".engineStatus").html(status);
    }

    //get all the moves were made 
    function getMoves(){
        var moves = "";
        var history = board.getMoveHistory();
        for(var i =0;i<history.length;i++){
            var move = history[i];
            moves+= " " + move.from + move.to + (move.promotion?move.promotion:"");
        }
        console.log("MOVES : " + moves);
        return moves;
    }

    //prepare the move, this function asks the engine to start
    //look for best move, the engine will invoke onmessage when
    //it has completed search within specific depth
    function prepareMove(){
        $('.logge').text(board.getPgn()+'\n');
       
        console.log("CPU is thinking ... ");
        //update the latest board positions before search for moves
        board.setFenPosition();
        var turn = board.getTurn()=='w'?'white':'black';

        if(!board.isGameOver() && turn!=playerColor){
            //tell the engines all the moves that were made
            uciCmd('position startpos moves ' + getMoves());
            //start searching, if depth exists, use depth paramter, else let the engine use default
            uciCmd('go '+(time.depth?'depth ' +time.depth:''));
        }
    }

    engine.onmessage = function(event){
        var line = event.data;  //?event.data:event;
        // console.log("[OUTPUT] UCI :" + line);
        if(line == 'readyok'){
            isEngineReady=true;
            reportEngineStatus();
        } else {
            var match = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?.\bbestmoveSan ...([+]|[#])?/);
            // console.log("match " + match);
            if(match){
                if(match[4]=="+"){ // player is being checked
                    //window.alert("You're being Checked");

                } else if(match[4]=="#"){ // player lose,  game over
                    window.alert("Game Over! You lose :)");
                    board.reset();
                    
                    // NOT WORKING YET
                    var list = document.getElementById('moves');
                    while( list.firstChild ){
                        list.removeChild( list.firstChild );
                    }
                }
                var list = document.getElementById('moves');
                var entry = document.createElement('li');
                entry.setAttribute("class", "playerMoves");
                entry.appendChild(document.createTextNode(match[1] + " to " + match[2]));
                list.prepend(entry)
                board.makeMove(match[1],match[2],match[3]);
                prepareMove();
            }
        }
    }
    
    return {
        setBoard:function(newBoard){
            board = newBoard;
        },
        reset:function(){
            // reset the board position
            board.reset();
        },
        setSocket:function(newSocket){
            socket= newSocket;
        },
        setPlayerColor:function(color){ // set the player color, black or white
            playerColor = color;
            board.setOrientation(playerColor);
        },
        setDepth:function(depth){
            time = {depth:depth}
        },
        start:function(){
            uciCmd('ucinewgame');
            uciCmd('isready');
            reportEngineStatus();
            board.startBoard();
            prepareMove();
        },
        prepareAiMove:function(){
            prepareMove();
        }
    }


}