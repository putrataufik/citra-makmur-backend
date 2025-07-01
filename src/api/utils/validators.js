// utils/validators.js

function validateUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9]{3,20}$/; // hanya huruf dan angka, 3-20 karakter
  if (!usernameRegex.test(username)) {
    throw new Error('Username harus terdiri dari 3-20 karakter alfanumerik tanpa simbol.');
  }
}

function validatePassword(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new Error('Password harus minimal 8 karakter dan mengandung huruf besar, huruf kecil, angka, dan simbol.');
  }
}

module.exports = {
  validateUsername,
  validatePassword
};
