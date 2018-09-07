const express = require('express');
const router = express.Router();

router.get("/", function(req, res) {
    var allMoves = [];
    res.render("index",{moves : allMoves});
});

module.exports = router;