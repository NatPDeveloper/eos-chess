![](https://github.com/NatPDeveloper/eos-chess/blob/master/ChessEOS.png?raw=true "ChessEOS")

- - - -

An EOS based chess game built on [chess.js's](https://github.com/jhlywa/chess.js/blob/master/README.md) move generation/validation, piece placement/movement, and check/checkmate/stalemate detection as well as [chessboard.js's UI](http://chessboardjs.com/).

Link*: https://chesseos.herokuapp.com/ 

*note this is currently hosted on the [Jungle Testnet](http://jungle.cryptolions.io), so in order to use it, you'll need to create a Jungle account then import the Jungle testnet's address and chain ID into Scatter.

### EOSIO Integration: ###

* [Scatter Wallet](https://get-scatter.com/)
* [EOSIO Smart Contract](https://github.com/eosio/eos)
* [Jungle Testnet](http://jungle.cryptolions.io)
* [demux-js](https://github.com/EOSIO/demux-js) library used to update MongoDB

In order to run this locally, start with **npm install** to get all of the dependencies then change the external MongoDB setup to the local one commented out.