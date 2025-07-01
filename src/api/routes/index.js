const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Citra Makmur Warehouse API Yow' });
});

router.use('/auth', require('./auth.routes'));

module.exports = router;
