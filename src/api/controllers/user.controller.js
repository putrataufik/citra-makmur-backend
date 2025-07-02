const userService = require('../services/user.service');

// GET /auth/profile
exports.getProfile = async (req, res) => {
  try {
    console.log("req.user:", req.user); // DEBUG
    const user = await userService.getProfile(req.user._id); // ← FIX di sini
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /auth/invite (admin only)
exports.createInvite = async (req, res) => {
  try {
    const code = await userService.generateInviteCode();
    res.status(201).json({ message: 'Kode undangan berhasil dibuat', code });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllStaff = async (req, res) => {
  try {
    const staffList = await userService.getAllStaff();
    res.json({ staff: staffList });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updated = await userService.updateUser(req.params.id, req.body);
    res.json({ message: 'User diperbarui', user: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ message: 'User berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePermissions = async (req, res) => {
  try {
    const updated = await userService.updatePermissions(req.params.id, req.body.permissions);
    res.json({ message: 'Izin user diperbarui', user: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


