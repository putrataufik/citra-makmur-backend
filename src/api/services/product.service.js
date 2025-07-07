const Product = require("../models/product.model");
const { convertToPCS } = require("../utils/converterToPCS");
const { logAudit } = require("../utils/logAudit");
exports.createProduct = async (data) => {
  const {
    name,
    sku,
    category,
    capital,
    stock = 0,
    description,
    imageUrl,
    unit = "pcs",
  } = data;

  const product = new Product({
    name,
    sku,
    category,
    capital,
    stock,
    description,
    imageUrl,
    unit,
  });
  return await product.save();
};

exports.getAllProducts = async () => {
  return await Product.find().sort({ createdAt: -1 });
};

exports.getProductById = async (id) => {
  return await Product.findById(id);
};

exports.updateProduct = async (id, data, user) => {
  const { stock, unit = "pcs", ...rest } = data;

  const before = await Product.findById(id).lean();
  if (!before) return null;

  const updated = await Product.findByIdAndUpdate(
    id,
    {
      ...rest,
      stock: convertToPCS(stock, unit),
      unit: "pcs",
    },
    { new: true }
  );

  const ignoredFields = ["_id", "sku"];
  const changes = [];

  for (const key in rest) {
    if (
      !ignoredFields.includes(key) &&
      rest[key] != null &&
      rest[key] !== before[key]
    ) {
      changes.push(`${key}: '${before[key]}' → '${rest[key]}'`);
    }
  }

  if (
    stock !== undefined &&
    convertToPCS(stock, unit) !== before.stock &&
    !ignoredFields.includes("stock")
  ) {
    changes.push(`stock: '${before.stock}' → '${convertToPCS(stock, unit)}'`);
  }

  if (changes.length > 0 && user) {
    await logAudit(
      user._id,
      "UPDATE_PRODUCT",
      `Mengedit produk '${before.name}'. Perubahan: ${changes.join(", ")}`,
      user.username
    );
  }

  return updated;
};

exports.deleteProduct = async (id, user) => {
  const deleted = await Product.findByIdAndDelete(id);
  if (!deleted) return null;

  if (user) {
    await logAudit(
      user._id,
      "DELETE_PRODUCT",
      `Menghapus produk '${deleted.name}'`,
      user.username
    );
  }

  return deleted;
};

exports.deleteAllProducts = async () => {
  console.log;
  return await Product.deleteMany({});
};
