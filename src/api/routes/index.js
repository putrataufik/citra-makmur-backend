const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Citra Makmur Warehouse API Yow' });
});

module.exports = router;
