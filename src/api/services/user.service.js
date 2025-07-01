const Invite = require('../models/invite.model');
const User = require('../models/user.model');
const crypto = require('crypto');

exports.generateInviteCode = async () => {
  const code = crypto.randomBytes(3).toString('hex').toUpperCase(); // contoh: 'A1B2C3'
  
  const invite = new Invite({ code });
  await invite.save();

  return invite.code;
};

exports.getProfile = async (userId) => {
  return await User.findById(userId).select('-password');
};

// Ambil semua user dengan role 'staff'
exports.getAllStaff = async () => {
  return await User.find({ role: 'staff' }).select('-password');
};

exports.getUserById = async (id) => {
  return await User.findById(id).select('-password');
};

exports.updateUser = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, { new: true }).select('-password');
};

exports.deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
}

exports.updatePermissions = async (id, permissions) => {
  return await User.findByIdAndUpdate(
    id,
    { $set: { permissions } },
    { new: true, runValidators: true }
  ).select('-password');
};


