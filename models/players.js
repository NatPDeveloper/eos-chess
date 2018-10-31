const mongoose = require('mongoose');

const playersSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    player_name: String,
    wins: {type: Number, default: '0'},
    // draws: {type: Number, default: '0'},
    losses: {type: Number, default: '0'},
    created: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('Player', playersSchema);