const mongoose = require('mongoose');

const moveSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    player: String,
    piece: String,
    from: String,
    to: String,
    move_transaction_id: {type: String, default: "Game in progress..."},
    created: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('Move', moveSchema);