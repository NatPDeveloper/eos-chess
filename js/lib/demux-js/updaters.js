
var dotenv = require('dotenv');
dotenv.config();
// var url = process.env.MONGOLAB_URI;

var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost/chess_eos";

  function updateMatchStatus(state, payload, blockInfo, context) {
    // update Mongo object if username exists and add win/draw/loss
    
    console.log(payload.data["account"])

    // if(payload.data["account"] == "win"){
      // if no account, add account with 1 win
      // if account, add 1 win
    // } else {
      // if no account, add account with 1 loss
      // if account, add 1 loss
    // }
    
    MongoClient.connect(url, function(err, db) {
      
      var dbo = db.db("chess_eos");
      if (err) throw err;
      dbo.collection("players").findOne({player_name: payload.data["account"]}, function(err, result) {
        if (err) throw err;
        console.log(result);
        if(result === null){
          if(payload.data["status"] == "win"){
            var myobj = { player_name: payload.data["account"], wins: "1", losses: "0" };
            dbo.collection("players").insertOne(myobj, function(err, res) {
              if (err) throw err;
              console.log("1 document inserted");
              // db.close();
            });
          } else {
            var myobj = { player_name: payload.data["account"], wins: "0", losses: "1" };
            dbo.collection("players").insertOne(myobj, function(err, res) {
              if (err) throw err;
              console.log("1 document inserted");
              // db.close();
            });
          }
        } else {
          if(payload.data["status"] == "win"){
            // MongoClient.connect(url, function(err, db) {
              if (err) throw err;
              // var dbo = db.db("mydb");
              var myquery = { player_name: payload.data["account"] };
              var newvalues = { $set: { wins: (parseInt(result.wins) + 1).toString() } };
              dbo.collection("players").updateOne(myquery, newvalues, function(err, res) {
                if (err) throw err;
                console.log("1 document updated");
                // db.close();
              });
            // });
          } else {
            // MongoClient.connect(url, function(err, db) {
              if (err) throw err;
              // var dbo = db.db("mydb");
              var myquery = { player_name: payload.data["account"] };
              var newvalues = { $set: { losses: (parseInt(result.losses) + 1).toString() } };
              dbo.collection("players").updateOne(myquery, newvalues, function(err, res) {
                if (err) throw err;
                console.log("1 document updated");
                // db.close();
              });
            // });
          }
        }
        db.close();
      });
      
    });
  }
  
  const updaters = [
    {
      actionType: "eosio::setstat",
      updater: updateMatchStatus,
    },
  ]
  
  module.exports = updaters