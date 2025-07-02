const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Citra Makmur Warehouse API Yow' });
});

router.use('/auth', require('./auth.routes'));
router.use('/user', require('./user.routes'));
router.use('/product', require('./product.routes'));
router.use('/stock', require('./stock.routes'));

module.exports = router;
