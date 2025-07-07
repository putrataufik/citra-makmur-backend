const productService = require("../services/product.service");
const { logAudit } = require("../utils/logAudit");

exports.addProduct = async (req, res) => {
  try {

    if (req.user.role !== "admin" && !req.user.permissions?.canAddProduct) {
      return res.status(403).json({
        message: "Anda tidak memiliki akses untuk menambahkan produk baru",
      });
    }

    if (typeof req.body.capital !== "number") {
      return res.status(400).json({
        message: 'Field "capital" harus berupa angka dan wajib diisi',
      });
    }

    const product = await productService.createProduct(req.body);

    // ✅ Audit log
    await logAudit(
      req.user._id,
      "ADD_PRODUCT",
      `Menambahkan produk '${product.name}'`,
      req.user.username
    );

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({
      message: "Gagal menambahkan produk",
      error: err.message,
    });
  }
};

exports.listProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal mengambil produk", error: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    res.json(product);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal mengambil detail produk", error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    if (req.user.role !== "admin" && !req.user.permissions?.canEditProduct) {
      return res
        .status(403)
        .json({ message: "Anda tidak memiliki akses untuk edit produk" });
    }

    // Kirim juga req.user ke service untuk pencatatan audit
    const updated = await productService.updateProduct(req.params.id, req.body, req.user);
    if (!updated) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({
      message: "Gagal mengupdate produk",
      error: err.message
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    if (req.user.role !== "admin" && !req.user.permissions?.canEditProduct) {
      return res
        .status(403)
        .json({
          message: "Anda tidak memiliki akses untuk menambahkan produk baru",
        });
    }

    const deleted = await productService.deleteProduct(req.params.id,req.user);
    if (!deleted)
      return res.status(404).json({ message: "Produk tidak ditemukan" });

    res.json({ message: "Produk berhasil dihapus" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal menghapus produk", error: err.message });
  }
};

exports.deleteAllProducts = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Hanya admin yang bisa menghapus semua produk" });
    }

    const result = await productService.deleteAllProducts();
    res.json({
      message: "Semua produk berhasil dihapus",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal menghapus semua produk", error: err.message });
  }
};
