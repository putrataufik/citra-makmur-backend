// models/auditLog.model.js
const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},
userName: {
  type: String,
  required: true
},
  action: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  versionKey: false,
  collection: "audit_logs",
});

module.exports = mongoose.model("AuditLog", auditLogSchema);