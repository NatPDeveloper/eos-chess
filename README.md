![](https://github.com/NatPDeveloper/eos-chess/blob/master/ChessEOS.png?raw=true "ChessEOS")

- - - -

An EOS based chess game built on [chess.js's](https://github.com/jhlywa/chess.js/blob/master/README.md) move generation/validation, piece placement/movement, and check/checkmate/stalemate detection as well as [chessboard.js's UI](http://chessboardjs.com/).

Link*: https://chesseos.herokuapp.com/ 

*note this is currently hosted on the [Jungle Testnet](http://jungle.cryptolions.io), so in order to use it, you'll need to [create a Jungle account](https://monitor.jungletestnet.io/#account) then import the Jungle testnet's address and chain ID into Scatter. Tutorial: https://eosio.stackexchange.com/questions/3270/how-to-get-local-testnet-account-for-use-with-scatter

### How to Play: ###

By default you are playing the AI.. Good luck there.  Or you can enter a random account name (does not need to be EOS account name despite what the box says) to connect with them after they've entered their own.  The names are forgotten after you refresh. This uses socket.io to handle the game logic communication.  You may need to open up the console or remove the blocking of pop ups as chrome doesn't seem to like pushing the notifications through that are necessary to confirm connecting to the other player.

### EOSIO Integration: ###

* [Scatter Wallet](https://get-scatter.com/)
* [EOSIO Smart Contract](https://github.com/eosio/eos)
* [Jungle Testnet](https://monitor.jungletestnet.io/)
* [demux-js](https://github.com/EOSIO/demux-js) library used to update MongoDB

### Stack: ###

Bootstrap, Express, Mongoose, C++

### How to set up: ###

* Install EOSIO (docs: https://developers.eos.io/eosio-home/docs), NodeJS, MongoDB, and the EOS wallet: https://get-scatter.com/. I built this using chrome, so I cannot guarantee any other browsers will play nice.

* `git clone https://github.com/NatPDeveloper/eos-chess --recursive`

* `cd eos-chess`

* `npm install`

* run `mongod` in separate window

* `touch .env` file in root and add: `MONGOLAB_URI="mongodb://localhost/chess_eos"`

* run `mongo` to enter mongo shell

* `use chess_eos` to set database then CNTRL+C to exit shell

* In app.js, comment out lines 48-52 since that is for the jungle testnet then uncomment out 42-46 for localhosted chain.  Be sure to set line 45 to whatever block your chain is currently at.

* create a user on your local nodeos instance `cleos create account eosio your_new_account_name YOUR_PUBLIC_KEY_OWNER YOUR_PUBLIC_KEY_ACTIVE -p eosio@active`

  * Tutorial if you're having trouble with step 10: https://developers.eos.io/eosio-home/docs/accounts-1

* compile the contract and push it to the chain with your newly create user `cleos set contract your_new_account_name /dir/to/contract/chess.cpp -p your_new_account_name@active`

  * Tutorial if you're having trouble with step 11: https://developers.eos.io/eosio-home/docs/your-first-contract

* import your key pair to Scatter and create a profile using your localhost as the network of choice, see this tutorial if you need help: https://eosio.stackexchange.com/questions/3270/how-to-get-local-testnet-account-for-use-with-scatter

* Run `node app.js` and you should have it running on: http://localhost:3000/, also be sure your nodeos instance is running

* Open 2 windows with your developer tools open (has to be open or else web socket notifications won't show in window).

* Click Sign in With Scatter, should give you a console response showing you're logged in

* In first window and first box (one that says "enter your eos account name"), enter any name (does not need to be eos account name).  Do the same for the other window but with a different name, then in the second window, second box, enter username entered in first window from first box.  You should get a notification to join the room and one side will get set to white, the other black. Game on

* Start playing against each other.  When one user checkmates the other, a Scatter prompt will come up to push a setstatus action to the chain for a loss.  Then on the other screen you will get a set status for winning.  If you check your logs, you should hopefully see demux picking the action off the chain and appending your MongoDB.  Then navigate to the stats tab to see your stats update.  You should see the account name you inported to scatter and 1 win and 1 loss.

If you have questions, hit me with them. I'm on the gram: https://t.me/natpd & Stack Exchange: https://eosio.stackexchange.com/users/1049/nat
