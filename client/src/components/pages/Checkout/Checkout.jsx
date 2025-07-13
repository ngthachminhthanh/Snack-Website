import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  FileText,
  ShoppingCart,
  Home,
  CalendarDays,
} from "lucide-react";
import Header from "../../Header";

const Checkout = () => {
  // Đặt hàng thành công => xóa những sản phẩm đã đặt trong giỏ hàng
  localStorage.removeItem("cart");

  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};

  useEffect(() => {
    if (!location.state?.order) {
      // Không có dữ liệu đơn hàng => quay lại trang chủ
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">Không tìm thấy thông tin đơn hàng</p>
      </div>
    );
  }

  const formattedDate = new Date(order.date).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <Header input={false} />

      <div className="container mx-auto mt-16 px-4 flex flex-col items-center">
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="flex items-center">
              <CheckCircle className="text-green-500 mr-2" size={32} />
              <h1 className="text-2xl font-bold text-green-500">
                Xác Nhận Đơn Hàng
              </h1>
            </div>
            <p className="text-gray-600 mt-2 text-center">
              Cảm ơn bạn đã tin tưởng và mua hàng tại website của chúng tôi!
            </p>
          </div>

          <div className="mb-6 border-b pb-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Thông Tin Khách Hàng
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Mail className="mr-2 mt-1 sm:mt-0 text-blue-500" size={20} />
                <span className="text-sm break-words">{order.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="mr-2 mt-1 sm:mt-0 text-green-500" size={20} />
                <span className="text-sm break-words">{order.phone}</span>
              </div>
              <div className="flex items-center col-span-1 sm:col-span-2">
                <MapPin className="mr-2 mt-1 sm:mt-0 text-red-500" size={22} />
                <span className="text-sm break-words">
                  {order.address}, {order.ward}, {order.district},{" "}
                  {order.province}
                </span>
              </div>
              <div className="flex items-center col-span-1 sm:col-span-2">
                <CalendarDays
                  className="mr-2 mt-1 sm:mt-0 text-purple-500"
                  size={20}
                />
                <span className="text-sm">Ngày đặt hàng: {formattedDate}</span>
              </div>
              {order.note && (
                <div className="flex items-center col-span-1 sm:col-span-2">
                  <FileText
                    className="mr-2 mt-1 sm:mt-0 text-gray-500"
                    size={20}
                  />
                  <span className="text-sm break-words">{order.note}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mb-6 border-b pb-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Sản Phẩm Đặt Hàng
            </h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-md shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center"
                >
                  <div className="flex items-start sm:items-center mb-2 sm:mb-0">
                    <ShoppingCart
                      className="mr-2 text-purple-500 mt-1 sm:mt-0"
                      size={20}
                    />
                    <span className="font-medium text-sm">
                      {item.product_name}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-700">
                    <span className="sm:mr-4">Số lượng: {item.quantity}</span>
                    <span>
                      {(item.product_price * item.quantity).toLocaleString()}đ
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center">
              <span className="text-xl font-bold text-red-600">
                Tổng Thanh Toán: {order.total_price.toLocaleString()}đ
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/", { replace: true })}
          className="flex items-center justify-center w-80 px-6 py-3 my-8 bg-blue-500 text-white rounded-lg transition duration-300 ease-in-out hover:bg-blue-600 hover:scale-105 hover:shadow-lg"
        >
          <Home className="mr-2" size={20} />
          Trở về trang chủ
        </button>
      </div>
    </>
  );
};

export default Checkout;
