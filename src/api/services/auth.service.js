const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

exports.register = async (data) => {
  const user = new User(data);
  return await user.save();
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });

  return { token, user };
};

exports.getProfile = async (userId) => {
  return await User.findById(userId).select('-password');
};
