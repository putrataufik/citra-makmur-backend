const authService = require('../services/auth.service');

exports.register = async (req, res) => {
  try {
    await authService.register(req.body);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { token } = await authService.login(req.body.email, req.body.password);
    res.json({ token, message:"login Success" });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await authService.getProfile(req.user.userId);
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
