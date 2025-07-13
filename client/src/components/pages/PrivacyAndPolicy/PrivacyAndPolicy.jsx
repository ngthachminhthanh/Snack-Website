import Header from "../../Header";

const PrivacyAndPolicy = () => {
  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto mt-12 px-6 py-12 text-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-purple-700">
          Chính sách quyền riêng tư
        </h1>

        <p className="mb-4">
          Tại <strong>Ăn vặt cùng tôi</strong>, chúng tôi cam kết bảo vệ quyền
          riêng tư và thông tin cá nhân của bạn. Chính sách này giải thích cách
          chúng tôi thu thập, sử dụng và bảo vệ thông tin người dùng khi sử dụng
          dịch vụ của chúng tôi.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          1. Thông tin chúng tôi thu thập
        </h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Thông tin tài khoản: tên, email, số điện thoại.</li>
          <li>Thông tin đơn hàng: địa chỉ giao hàng, sản phẩm đã đặt.</li>
          <li>
            Dữ liệu đăng nhập từ bên thứ ba (Google, Facebook) nếu bạn sử dụng
            chức năng đăng nhập xã hội.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          2. Cách chúng tôi sử dụng thông tin
        </h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Xử lý đơn hàng và giao hàng.</li>
          <li>Cải thiện trải nghiệm người dùng.</li>
          <li>Gửi thông báo về chương trình khuyến mãi (nếu bạn đồng ý).</li>
          <li>Bảo mật tài khoản người dùng.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          3. Chia sẻ thông tin
        </h2>
        <p className="mb-4">
          Chúng tôi không chia sẻ thông tin cá nhân của bạn với bên thứ ba trừ
          khi có sự đồng ý rõ ràng của bạn hoặc khi được pháp luật yêu cầu.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          4. Bảo mật thông tin
        </h2>
        <p className="mb-4">
          Chúng tôi áp dụng các biện pháp bảo mật phù hợp để bảo vệ thông tin cá
          nhân của bạn khỏi truy cập trái phép hoặc bị mất mát.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          5. Quyền của người dùng
        </h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Truy cập và chỉnh sửa thông tin cá nhân.</li>
          <li>Yêu cầu xóa tài khoản hoặc dữ liệu cá nhân.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          6. Thay đổi chính sách
        </h2>
        <p className="mb-4">
          Chính sách này có thể được cập nhật định kỳ. Chúng tôi sẽ thông báo
          cho bạn nếu có thay đổi quan trọng.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">7. Liên hệ</h2>
        <p>
          Nếu bạn có câu hỏi về chính sách quyền riêng tư, vui lòng liên hệ với
          chúng tôi qua email:{" "}
          <a
            href="mailto:support@snackshop.com"
            className="text-purple-600 hover:underline"
          >
            websiteanvatcungtoi@gmail.com
          </a>
        </p>
      </div>
    </>
  );
};

export default PrivacyAndPolicy;
