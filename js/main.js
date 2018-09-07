var init = function(){
    engine = EngineGame();
    socket = SocketClient();
    
    var scatter = new Scatter()

    board = Board(scatter, socket);
    board.setChessEngine(engine);
    board.setSocket(socket);
    newGame = function(){
        engine.setBoard(board);
        engine.reset();
        engine.setDepth();
        engine.setPlayerColor("white");
        engine.start();
    }
    socket.setBoard(board);
    newGame();
}
init()