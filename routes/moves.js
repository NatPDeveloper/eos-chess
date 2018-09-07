const express = require('express');
const router = express.Router();

router.get("/", function(req, res) {
    res.render("moves");
});

router.post('/', (req, res, next) => {
    const product = {
        player: req.body.player,
        piece: req.body.piece,
        from: req.body.from,
        to: req.body.to,
        transaction_id: req.body.transaction_id
    }
    res.status(201).json({
        message: 'Handing POST request to /products',
        createdProduct: product
    });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if (id === 'special') {
        res.status(200).json({
            message: 'You discovered the special ID',
            id: id
        }); 
    } else {
            res.status(200).json({
                message: 'You passed an ID'
        });
    }
})

router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Updated product!'
    })
})

router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted product!'
    })
})

module.exports = router;