const stockService = require('../services/stock.service');

exports.stockIn = async (req, res) => {
  try {
    if (!req.user.permissions?.canRecordStockIn) {
      return res.status(403).json({ message: 'Tidak memiliki izin untuk menambahkan stok' });
    }

    const { productId, quantity, unit = 'pcs', note } = req.body;
    const result = await stockService.recordStockTransaction({
      productId,
      type: 'in',
      quantity,
      unit,
      source: 'manual',
      note,
      userId: req.user._id
    });

    res.status(201).json({ message: 'Stok masuk berhasil dicatat', result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.stockOut = async (req, res) => {
  try {
    if (!req.user.permissions?.canRecordStockOut) {
      return res.status(403).json({ message: 'Tidak memiliki izin untuk mengurangi stok' });
    }

    const { productId, quantity, unit = 'pcs', note } = req.body;
    const result = await stockService.recordStockTransaction({
      productId,
      type: 'out',
      quantity,
      unit,
      source: 'manual',
      note,
      userId: req.user._id
    });

    res.status(201).json({ message: 'Stok keluar berhasil dicatat', result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.scanAndRecordStock = async (req, res) => {
  try {
    const { type } = req.params;
    if (!['in', 'out'].includes(type)) {
      return res.status(400).json({ error: "Tipe harus 'in' atau 'out'" });
    }

    const result = await scanService.scanAndRecordStock({
      file: req.file,
      type,
      userId: req.user._id
    });

    res.status(200).json({
      message: `Transaksi stock ${type} berhasil diproses`,
      ...result
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listTransactions = async (req, res) => {
  try {
    const transactions = await stockService.getAllTransactions();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data transaksi' });
  }
};
