const productService = require('../services/product.service');

exports.addProduct = async (req, res) => {
  try {
    console.log('User permissions:', req.user.permissions); // ✅ log semua permission
    console.log('canAddProduct:', req.user.permissions?.canAddProduct); // ✅ log spesifik

    if (!req.user.permissions?.canAddProduct) {
      return res.status(403).json({ message: 'Anda tidak memiliki akses untuk menambahkan produk baru' });
    }

    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Gagal menambahkan produk', error: err.message });
  }
};


exports.listProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil produk', error: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil detail produk', error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    if (!req.user.permissions?.canEditProduct) {
      return res.status(403).json({ message: 'Anda tidak memiliki akses untuk edit produk' });
    }

    const updated = await productService.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengupdate produk', error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    if (!req.user.permissions?.canEditProduct) {
      return res.status(403).json({ message: 'Akses ditolak' });
    }

    const deleted = await productService.deleteProduct(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    res.json({ message: 'Produk berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus produk', error: err.message });
  }
};
