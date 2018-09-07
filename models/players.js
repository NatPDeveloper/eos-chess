const mongoose = require('mongoose');

const playersSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    player_name: String,
    wins: {type: Number, default: '0'},
    draws: {type: Number, default: '0'},
    losses: {type: Number, default: '0'},
    match: [
        {
            opponent: String,
            win_loss_draw: {type: String, default: "Game in progress..."},
            match_transaction_id: String,
            moves: [
                {
                    piece: String,
                    from: String,
                    to: String,
                    move_transaction_id: {type: String, default: "Game in progress..."}
                }
            ]
        }
    ],
    created: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('Player', playersSchema);