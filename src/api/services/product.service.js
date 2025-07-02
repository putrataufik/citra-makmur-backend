const Product = require('../models/product.model');
const {convertToPCS} = require('../utils/converterToPCS')
// // Fungsi konversi satuan ke pcs
// const convertToPCS = (value, unit) => {
//   switch (unit) {
//     case 'lusin': return value * 12;
//     case 'kodi': return value * 20;
//     default: return value;
//   }
// };

exports.createProduct = async (data) => {
  const { stock, unit = 'pcs', ...rest } = data;

  const product = new Product({
    ...rest,
    stock: convertToPCS(stock, unit),
    unit: 'pcs'
  });

  return await product.save();
};

exports.getAllProducts = async () => {
  return await Product.find().sort({ createdAt: -1 });
};

exports.getProductById = async (id) => {
  return await Product.findById(id);
};

exports.updateProduct = async (id, data) => {
  const { stock, unit = 'pcs', ...rest } = data;

  const updated = await Product.findByIdAndUpdate(
    id,
    {
      ...rest,
      stock: convertToPCS(stock, unit),
      unit: 'pcs'
    },
    { new: true }
  );

  return updated;
};

exports.deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};
