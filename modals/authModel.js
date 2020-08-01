const mongoose = require('mongoose');

const authSchema = mongoose.Schema({
  mobileNo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  otpExpiresIn: Date,
});

module.exports = mongoose.model('authTable', authSchema);
