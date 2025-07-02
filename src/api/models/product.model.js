const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  category: { type: String },
  stock: { type: Number, default: 0 }, // selalu disimpan dalam pcs
  description: { type: String },
  imageUrl: { type: String },
  unit: { type: String, default: 'pcs', required: true } // selalu disimpan sebagai 'pcs'
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
