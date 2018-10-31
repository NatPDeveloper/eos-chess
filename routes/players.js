const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Player = require('../models/players');
// const Match = require('../models/match');

router.get("/", function(req, res) {
    Player.find({}, function(err, allPlayers){
        if(err){
            res.status(500).json({
                error: err
            });
        } else {
            res.render("players",{players : allPlayers});
        }
    })
});

router.post('/', (req, res, next) => {
    // Match.findById(req.body.matchId)
    // .then(product => {
    //     if(!product) {
    //         return res.status(404).json({
    //             message: 'Match not found'
    //         });
    //     }
    
    const player = new Player({
        _id: new mongoose.Types.ObjectId(),
        player_name: req.body.player_name,
        wins: req.body.wins,
        draws: req.body.draws,
        losses: req.body.losses,
        match: req.body.match
    });
        return player.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Player stored',
                createdPlayer: {
                    _id: result._id,
                    player_name: result.player_name,
                    wins: result.wins,
                    // draws: result.draws,
                    losses: result.losses
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/players/' + result._id
                }
            });
        })
        .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.patch('/:playerId', (req, res, next) => {
    const id = req.params.player_name;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({player_name: id}, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/'
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
})

router.delete('/:playerId', (req, res, next) => {
    const id = req.params.playerId
    Player.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;