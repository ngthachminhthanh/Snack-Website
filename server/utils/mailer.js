const nodemailer = require('nodemailer');
require('dotenv').config();

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

exports.sendSuccessOrderMail = async (to, order) => {
  const { orderId, address, products, total_price, payment, note, date_order } = order;

  const productsHtml = products.map(p => `
    <tr>
      <td>${p.name}</td>
      <td>${p.quantity}</td>
      <td>${p.price.toLocaleString()}đ</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject: '🛒 Đặt hàng thành công - Cảm ơn bạn đã mua sắm tại website của chúng tôi!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #2ecc71;">✅ Đơn hàng của bạn đã được xác nhận!</h2>
        <p>Xin chào,</p>
        <p>Cảm ơn bạn đã đặt hàng tại website của chúng tôi. Dưới đây là thông tin chi tiết đơn hàng của bạn:</p>

        <h3>📦 Mã đơn hàng: ${orderId}</h3>
        <p><strong>Ngày đặt:</strong> ${new Date(date_order).toLocaleString()}</p>
        <p><strong>Giao đến:</strong> ${address}</p>
        <p><strong>Phương thức thanh toán:</strong> ${payment.method}</p>
        ${note ? `<p><strong>Ghi chú:</strong> ${note}</p>` : ''}

        <table border="1" cellspacing="0" cellpadding="8" width="100%" style="border-collapse: collapse;">
          <thead style="background-color: #f0f0f0;">
            <tr>
              <th>Sản phẩm</th>
              <th>Số lượng</th>
              <th>Giá</th>
            </tr>
          </thead>
          <tbody>
            ${productsHtml}
          </tbody>
        </table>

        <h3 style="text-align: right;">Tổng cộng: ${total_price.toLocaleString()}đ</h3>

        <p>Chúng tôi sẽ xử lý đơn hàng và giao đến bạn sớm nhất có thể.</p>
        <p>Trân trọng,<br />Đội ngũ bán hàng AnVatCungToi.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};