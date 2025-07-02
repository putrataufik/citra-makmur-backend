const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

// Route spesifik harus ditaruh sebelum route dinamis
router.post('/addproduct', productController.addProduct);
router.get('/listproducts', productController.listProducts);

// Ini harus di bawah karena bersifat dinamis
router.get('/:id', productController.getProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
