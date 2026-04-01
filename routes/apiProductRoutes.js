const express = require('express');
const { apiGetProducts, apiGetProduct } = require('../controllers/productController');

const router = express.Router();

router.get('/', apiGetProducts);
router.get('/:id', apiGetProduct);

module.exports = router;
