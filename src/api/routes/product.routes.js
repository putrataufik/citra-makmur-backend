const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminOnlyMiddleware = require('../middlewares/adminOnly.middleware');

router.use(authMiddleware);

// Route spesifik harus ditaruh sebelum route dinamis
router.post('/addproduct',adminOnlyMiddleware, productController.addProduct);
router.get('/listproducts', productController.listProducts);
router.delete('/deleteall', adminOnlyMiddleware, productController.deleteAllProducts);

// Ini harus di bawah karena bersifat dinamis
router.get('/:id', productController.getProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
