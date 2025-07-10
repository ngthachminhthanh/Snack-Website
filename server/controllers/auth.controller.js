const CustomerEntity = require("../models/customers.model");
const OtpToken = require("../models/OtpToken.model");
const bcrypt = require("bcrypt");
const { sendOtpMail } = require("../utils/mailer");
const userFacade = require('../facades/user.facade');

exports.register = async (req, res) => {
    try {
        const result = await userFacade.registerUser(req.body);
        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(400).json({ msg: err.message });
    }
};

exports.loginWithEmailandPassword = async (req, res) => {
    try {
        const result = await userFacade.loginUser(req.body);
        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(400).json({ msg: err.message });
    }
};

exports.sendResetOtp = async (req, res) => {
    const { email } = req.body;
  
    const user = await CustomerEntity.findOne({ email });
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng." });
  
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 phút
  
    await OtpToken.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    );
  
    await sendOtpMail(email, otp);
  
    res.json({ message: "OTP đã được gửi đến email." });
};
  
exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
  
    const otpRecord = await OtpToken.findOne({ email });
    if (!otpRecord) return res.status(400).json({ message: "OTP không hợp lệ." });
  
    if (otpRecord.otp !== otp)
      return res.status(400).json({ message: "Mã OTP sai." });
  
    if (otpRecord.expiresAt < new Date())
      return res.status(400).json({ message: "Mã OTP đã hết hạn." });
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await CustomerEntity.findOneAndUpdate({ email }, { password: hashedPassword });
  
    await OtpToken.deleteOne({ email });
  
    res.json({ message: "Đặt lại mật khẩu thành công." });
};