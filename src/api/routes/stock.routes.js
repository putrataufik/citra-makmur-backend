const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stock.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');

// Semua endpoint di bawah ini butuh autentikasi
router.use(authMiddleware);

// Manual Input
router.post('/in', stockController.stockIn);        // POST /api/stock/in
router.post('/out', stockController.stockOut);      // POST /api/stock/out
router.get('/', stockController.listTransactions);  // GET /api/stock/

// Scan Nota
router.post('/scan/:type', uploadMiddleware, stockController.scanAndRecordStock); // POST /api/stock/scan/in|out

module.exports = router;
