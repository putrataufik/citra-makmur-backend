const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const Invite = require('../models/invite.model');

exports.register = async ({ name, email, password, role, invitationCode }) => {
  if (!name || !email || !password || !role) {
    throw new Error('Data tidak lengkap (name, email, password, role wajib diisi)');
  }

  if (role === 'staff') {
    const invite = await Invite.findOne({ code: invitationCode });
    if (!invite || invite.used) {
      throw new Error('Invitation code tidak valid atau sudah digunakan');
    }
    invite.used = true;
    await invite.save();
  }

  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email sudah digunakan');

  const user = new User({
    name,
    email,
    password: password,
    role,
    permissions: role === 'staff' ? {
      canAddProduct: true,
      canEditProduct: true,
      canRecordStockIn: true,
      canRecordStockOut: true,
      canRecordSale: true
    } : undefined
  });

  await user.save();

  if (role === 'staff') {
    await Invite.updateOne({ code: invitationCode }, { usedBy: user._id });
  }

  return;
};

exports.login = async (email, password) => {
    console.log(email)
    console.log(password)
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });

  return { token, user };
};