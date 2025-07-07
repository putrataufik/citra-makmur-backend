const { GoogleGenerativeAI } = require("@google/generative-ai");
const StockTransaction = require("../models/stockTransaction.model");
const Product = require("../models/product.model");
const { convertToPCS } = require("../utils/converterToPCS");
const { logAudit } = require("../utils/logAudit");

exports.recordStockTransaction = async ({
  productId,
  type,
  quantity,
  unit,
  capital,
  source,
  note,
  userId,
  userName,
}) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Produk tidak ditemukan");

  const qtyPCS = convertToPCS(quantity, unit);

  const transaction = await StockTransaction.create({
    product: productId,
    type,
    quantity: qtyPCS,
    unit: "pcs",
    capital,
    source,
    note,
    user: userId,
  });

  if (type === "in") {
    product.stock += qtyPCS;
  } else if (type === "out") {
    if (product.stock < qtyPCS) {
      throw new Error("Stok tidak mencukupi");
    }
    product.stock -= qtyPCS;
  }

  await product.save();

  // Tambahkan log audit dengan nama dan SKU
  await logAudit(
    userId,
    type === "in" ? "STOCK_IN" : "STOCK_OUT",
    `${type === "in" ? "Menambahkan" : "Mengurangi"} stok ${quantity} ${unit} untuk '${product.name}' (SKU: ${product.sku})`,
    userName
  );

  return transaction;
};

exports.scanAndRecordStock = async ({ file }) => {
  // Ambil semua produk
  const allProducts = await Product.find().select("name sku _id").lean();

  const productList = allProducts
    .map((p) => `${p.name} (ID: ${p._id}, SKU: ${p.sku})`)
    .join("\n");

  const base64Image = file.buffer.toString("base64");

  const prompt = `Kamu adalah sistem manajemen gudang. Saya ingin kamu membaca gambar nota belanja dan mencocokkannya dengan daftar produk berikut:

=== Daftar Produk Tersedia ===
${productList}
===

Ambil hanya barang yang sesuai dari nota dan kembalikan data JSON valid dengan struktur berikut:

{
  "matched": [
    {
      "productId": "ID produk sesuai daftar di atas",
      "sku": "SKU produk sesuai daftar di atas",
      "productName": "Nama produk di database yang cocok dengan nota",
      "quantity": jumlah dalam angka,
      "unit": "pcs" atau "lusin" atau "kodi"
    }
  ],
  "unmatched": {
    "reason": "Produk tidak ditemukan di database",
    "items": [
      {
        "productName": "Nama Produk dari Nota"
      }
    ]
  }
}

Petunjuk tambahan:
- Jangan ubah ID produk.
- Jangan ubah SKU produk.
- Jangan sertakan total harga, diskon, atau nilai uang.
- Jika tidak cocok dengan daftar, masukkan ke dalam "unmatched.items".
- Jangan ulangi "reason" di setiap item unmatched.
- Kembalikan hanya JSON valid, tanpa teks tambahan, tanpa komentar, dan tanpa markdown (\`\`\`).`;

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });

  const result = await model.generateContent([
    { inlineData: { data: base64Image, mimeType: file.mimetype } },
    prompt,
  ]);

  const rawText = result.response.text();
  console.log("=== RAW RESPONSE DARI GEMINI ===\n", rawText);

  const cleaned = rawText.replace(/```json|```/g, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.error("Gagal parsing JSON:\n", cleaned);
    throw new Error("Format JSON tidak valid dari Gemini");
  }

  if (!Array.isArray(parsed.matched)) {
    throw new Error("Struktur JSON tidak sesuai ekspektasi (matched harus array)");
  }

  const matched = parsed.matched.map((item) => ({
    ...item,
    note: `Scan nota: ${item.productName}`,
  }));

  const unmatched = parsed.unmatched?.items?.length > 0 ? parsed.unmatched : [];

  return {
    matched,
    unmatched,
  };
};

exports.getAllTransactions = async () => {
  return await StockTransaction.find()
    .select("product type quantity unit source note createdAt")
    .populate("product", "name sku")
    .populate("createdBy", "name role")
    .sort({ createdAt: -1 });
};
