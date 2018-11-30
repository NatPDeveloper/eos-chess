
var dotenv = require('dotenv');
dotenv.config();
var url = process.env.MONGOLAB_URI;

var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost/chess_eos";

  function updateMatchStatus(state, payload, blockInfo, context) {    
    console.log(payload.data["account"])
    
    MongoClient.connect(url, function(err, db) {
      var dbo = db.db("chesseos");
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
            });
          } else {
            var myobj = { player_name: payload.data["account"], wins: "0", losses: "1" };
            dbo.collection("players").insertOne(myobj, function(err, res) {
              if (err) throw err;
              console.log("1 document inserted");
            });
          }
        } else {
          if(payload.data["status"] == "win"){
              if (err) throw err;
              var myquery = { player_name: payload.data["account"] };
              var newvalues = { $set: { wins: (parseInt(result.wins) + 1).toString() } };
              dbo.collection("players").updateOne(myquery, newvalues, function(err, res) {
                if (err) throw err;
                console.log("1 document updated");
              });
          } else {
              if (err) throw err;
              var myquery = { player_name: payload.data["account"] };
              var newvalues = { $set: { losses: (parseInt(result.losses) + 1).toString() } };
              dbo.collection("players").updateOne(myquery, newvalues, function(err, res) {
                if (err) throw err;
                console.log("1 document updated");
              });
          }
        }
        db.close();
      });
    });
  }
  
  const updaters = [
    {
      actionType: "chesseosches::setstat", // updated with current contract account name
      updater: updateMatchStatus,
    },
  ]
  
  module.exports = updaters