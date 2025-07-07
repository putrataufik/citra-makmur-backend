// utils/logAudit.js
const AuditLog = require("../models/auditLog.model");

/**
 * Mencatat aktivitas pengguna ke dalam audit log.
 * @param {string} userId - ID pengguna
 * @param {string} action - Nama aksi (misal: CREATE_PRODUCT, STOCK_IN)
 * @param {string} note - Catatan singkat tentang aktivitas
 * @param {string} userName - Username pengguna
 */
exports.logAudit = async (userId, action, note, userName) => {
  try {
    await AuditLog.create({
      user: userId,
      userName,
      action,
      note,
    });
  } catch (error) {
    console.error("Gagal mencatat audit log:", error.message);
  }
};