const express = require('express');
const { apiRequireAuth } = require('../middleware/auth');
const { apiMyOrders } = require('../controllers/customerController');

const router = express.Router();

router.get('/orders', apiRequireAuth, apiMyOrders);

module.exports = router;
