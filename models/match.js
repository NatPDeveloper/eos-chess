const mongoose = require('mongoose');

const matchSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    opponent: String,
    win_loss_draw: {type: String, default: "Game in progress..."},
    match_transaction_id: String,
    player_name: String,
    moves: [
        {
            player: String,
            piece: String,
            from: String,
            to: String,
            move_transaction_id: String
        }
    ],
    created: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('Match', matchSchema);