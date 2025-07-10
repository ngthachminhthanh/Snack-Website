const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

exports.sendOtpMail = async (to, otp) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject: 'Mã xác nhận đặt lại mật khẩu',
    html: `
      <div style="max-width: 480px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 24px; border-radius: 8px; background-color: #fafafa;">
        <h2 style="text-align: center; color: #6b21a8;">🔐 Xác nhận đặt lại mật khẩu</h2>

        <p>Xin chào,</p>

        <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản sử dụng email: <strong>${to}</strong>.</p>

        <p>Vui lòng sử dụng mã OTP bên dưới để xác minh yêu cầu của bạn:</p>

        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; letter-spacing: 8px; font-weight: bold; color: #6b21a8;">${otp}</span>
        </div>

        <p style="color: #333;">
          ⚠️ Mã OTP sẽ hết hạn sau <strong>5 phút</strong>. Vui lòng không chia sẻ mã này với bất kỳ ai vì lý do bảo mật.
        </p>

        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này. Tài khoản của bạn vẫn an toàn.</p>

        <hr style="margin: 24px 0;" />

        <p style="font-size: 12px; color: #999; text-align: center;">
          © ${new Date().getFullYear()} AnVatCungToi. Mọi quyền được bảo lưu.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
