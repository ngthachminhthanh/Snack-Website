const mongoose = require('mongoose');

const OtpTokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model('OtpToken', OtpTokenSchema, 'otp_tokens');
