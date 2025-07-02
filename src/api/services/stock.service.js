const { GoogleGenerativeAI } = require("@google/generative-ai");
const StockTransaction = require('../models/stockTransaction.model');
const Product = require('../models/product.model');
const {convertToPCS} = require('../utils/converterToPCS')

exports.recordStockTransaction = async ({ productId, type, quantity, unit, source, note, userId }) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error('Produk tidak ditemukan');

  const qtyPCS = convertToPCS(quantity, unit);

  if (type === 'out' && product.stock < qtyPCS) {
    throw new Error('Stok tidak mencukupi untuk dikeluarkan');
  }

  // Update stok produk
  if (type === 'in') {
    product.stock += qtyPCS;
  } else {
    product.stock -= qtyPCS;
  }
  await product.save();

  // Catat transaksi
  const transaction = new StockTransaction({
    product: productId,
    type,
    quantity: qtyPCS,
    unit: 'pcs',
    source,
    note,
    createdBy: userId
  });

  return await transaction.save();
};

exports.scanAndRecordStock = async ({ file, type, userId }) => {
  const base64Image = Buffer.from(file.buffer).toString("base64");

  const prompt = `Kamu adalah sistem manajemen gudang. Saya ingin kamu membaca gambar nota belanja dan mengembalikan data JSON dalam format berikut:

  [
    {
      "productName": "Nama barang",
      "quantity": jumlah dalam angka,
      "unit": "pcs" atau "lusin" atau "kodi"
    }
  ]

Petunjuk tambahan:
- Ambil semua item dari nota yang merupakan produk fisik.
- Jangan sertakan total harga, diskon, atau nilai uang.
- Jangan buat kategori atau id, hanya nama barang, jumlah, dan satuan saja.
- Pastikan JSON valid, jangan kirim teks tambahan atau markdown.`;

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });
  const result = await model.generateContent([
    { inlineData: { data: base64Image, mimeType: file.mimetype } },
    prompt
  ]);

  const text = result.response.text();
  const cleaned = text.replace(/```json|```/g, "").trim();
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error("Format JSON tidak valid dari Gemini");
  }

  if (!Array.isArray(parsed)) throw new Error("Hasil bukan array JSON");

  const matched = [];
  const unmatched = [];

  for (const item of parsed) {
    const { productName, quantity, unit } = item;
    const product = await Product.findOne({
      $or: [
        { name: { $regex: productName, $options: 'i' } },
        { aliases: { $regex: productName, $options: 'i' } }
      ]
    });

    if (!product) {
      unmatched.push({ productName, quantity, unit });
      continue;
    }

    const qtyPCS = convertToPCS(quantity, unit);

    if (type === 'out' && product.stock < qtyPCS) {
      unmatched.push({ productName, reason: 'stok tidak cukup', currentStock: product.stock });
      continue;
    }

    if (type === 'in') {
      product.stock += qtyPCS;
    } else {
      product.stock -= qtyPCS;
    }
    await product.save();

    const transaction = new StockTransaction({
      product: product._id,
      type,
      quantity: qtyPCS,
      unit: 'pcs',
      source: 'nota',
      note: `Scan nota: ${productName}`,
      createdBy: userId
    });

    await transaction.save();
    matched.push(transaction);
  }

  return { matched, unmatched };
};

exports.getAllTransactions = async () => {
  return await StockTransaction.find()
    .select('product type quantity unit source note createdAt')
    .populate('product', 'name sku')           // hanya ambil name dan sku dari product
    .populate('createdBy', 'name role')        // hanya ambil nama dan role user
    .sort({ createdAt: -1 });
};

