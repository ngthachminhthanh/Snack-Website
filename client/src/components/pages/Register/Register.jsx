import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { motion } from "framer-motion";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [success, setSuccess] = useState(false); // State để quản lý trạng thái khi đăng ký thành công
  const [error, setError] = useState(""); // State để quản lý thông báo lỗi
  const navigate = useNavigate();
  const { login } = useAuth();

  const { username, email, phone, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(""); // reset lỗi khi user đang sửa
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Xóa lỗi cũ trước khi gửi
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register`, formData);
      localStorage.setItem("token", res.data.token);
      setSuccess(true); // Đăng ký thành công, hiển thị thông báo
    } catch (err) {
      setError(err.response?.data?.msg || "Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  const handleGoHomeOrGoToCart = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_BASE_URL}/auth/loginWithEmailandPassword`,
        formData
      );
      login(res.data.user, res.data.token);

      // Lấy trang redirect từ localStorage
      const redirectPath = localStorage.getItem("redirectAfterLogin");

      // Kiểm tra nếu là admin thì điều hướng đến trang Admin
      if (res.data.user.isAdmin) {
        navigate("/admin/dashboard");
      } else if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectPath);
      } else {
        navigate("/");
      }
    } catch (err) {
      console.log(
        err.response?.data?.msg || "Đã xảy ra lỗi. Vui lòng thử lại."
      );
    }
  };

  if (success) {
    return (
      <div
        className="flex justify-center items-center min-h-screen bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://png.pngtree.com/background/20210709/original/pngtree-chip-bread-food-snack-background-picture-image_536116.jpg')",
          backgroundColor: "#1a1a1a",
        }}
      >
        {/* Overlay tối mờ */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

        {/* Card nội dung */}
        <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center animate-fade-in">
          <svg
            className="mx-auto mb-4 text-green-500"
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20.292 5.708a1 1 0 0 0-1.414-1.416L9 14.172l-3.878-3.88a1 1 0 1 0-1.414 1.415l4.586 4.586a1 1 0 0 0 1.414 0l10.584-10.585z" />
          </svg>
          <h2 className="text-2xl font-bold mb-2 text-green-600">
            Đăng ký thành công!
          </h2>
          <p className="mb-6 text-gray-700">
            Bạn đã tạo tài khoản thành công. Hãy tiếp tục khám phá nhé!
          </p>
          <button
            onClick={handleGoHomeOrGoToCart}
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-all shadow-md"
          >
            {localStorage.getItem("redirectAfterLogin") === "/cart"
              ? "Đến giỏ hàng ngay"
              : "Đến trang chủ ngay"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center bg-gray-100"
      style={{
        backgroundImage:
          "url('https://png.pngtree.com/background/20210709/original/pngtree-chip-bread-food-snack-background-picture-image_536116.jpg')",
        backgroundColor: "#1a1a1a",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Đăng ký
        </h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="username">
              Họ tên
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Họ tên"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="phone">
              Số điện thoại
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={phone}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Số điện thoại"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Mật khẩu"
              required
            />
          </div>
          {/* Hiển thị lỗi nếu có */}
          {error && (
            <div className="mb-4 text-red-500 text-center bg-red-100 border border-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Đăng ký
          </button>
          <p className="text-center text-gray-600 mt-4">
            Đã là thành viên?{" "}
            <Link to="/login" className="text-purple-600 hover:underline">
              Đăng nhập
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
