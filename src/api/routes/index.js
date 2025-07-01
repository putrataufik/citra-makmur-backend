const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Citra Makmur Warehouse API Yow' });
});

router.use('/auth', require('./auth.routes'));
router.use('/user', require('./user.routes'));

module.exports = router;
