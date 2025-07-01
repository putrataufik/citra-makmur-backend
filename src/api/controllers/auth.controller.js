const authService = require('../services/auth.service');

exports.register = async (req, res) => {
  try {
    await authService.register(req.body);
    res.status(201).json({ message: 'User berhasil didaftarkan' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// POST /auth/login
exports.login = async (req, res) => {
  try {
    const { token } = await authService.login(req.body.username, req.body.password);
    res.json({ token, message: 'Login sukses' });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

