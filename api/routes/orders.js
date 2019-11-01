const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const OrderController = require('../controllers/orders');

router.get('/', checkAuth, OrderController.getAll);

 router.get('/:id', checkAuth, OrderController.getOne);

router.post('/', checkAuth, OrderController.post);

router.patch('/:id', checkAuth, OrderController.update);

module.exports = router;