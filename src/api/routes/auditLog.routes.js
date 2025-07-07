// routes/auditLogs.js
const express = require("express");
const router = express.Router();
const auditLogController = require("../controllers/auditLogController");
const authMiddleware = require('../middlewares/auth.middleware');
const adminOnly = require('../middlewares/adminOnly.middleware');

router.use(authMiddleware);

router.get("/", adminOnly, auditLogController.getAuditLogs);

module.exports = router;