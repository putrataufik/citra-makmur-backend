const AuditLog = require("../models/auditLog.model");

exports.getAuditLogs = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Hanya admin yang dapat melihat audit log" });
    }

    const logs = await AuditLog.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil audit log", error: err.message });
  }
};

