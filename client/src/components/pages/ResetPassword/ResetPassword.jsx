import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import "../../../assets/customCSS/LoadingEffect.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      navigate("/login", { replace: true });
    }
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  useEffect(() => {
    const handlePopState = () => {
      navigate("/login", { replace: true });
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  const sendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/send-reset-otp`, { email });
      setStep(2);
      setMessage(
        "Mã OTP đã được gửi đến email của bạn. Hãy kiểm tra hộp thư và tiếp tục."
      );
    } catch (err) {
      setError(err.response?.data?.message || "Gửi OTP thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        email,
        otp,
        newPassword,
      });
      setMessage("Đổi mật khẩu thành công! Đang chuyển về đăng nhập...");
      setCountdown(5);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể đổi mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

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
        className="relative bg-white rounded-lg shadow-lg p-8 w-full max-w-md"
      >
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center rounded-lg z-10">
            <div className="loader"></div>
          </div>
        )}

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Đặt lại mật khẩu
        </h2>

        {step === 1 && (
          <form onSubmit={sendOtp}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Email của bạn"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                required
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors duration-200"
            >
              Gửi mã OTP
            </motion.button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={resetPassword}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="otp">
                Mã OTP
              </label>
              <input
                type="text"
                id="otp"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Nhập mã OTP"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setError("");
                }}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="newPassword">
                Mật khẩu mới
              </label>
              <input
                type="password"
                id="newPassword"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError("");
                }}
                required
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors duration-200"
            >
              Đổi mật khẩu
            </motion.button>
          </form>
        )}

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 bg-green-50 border border-green-300 rounded-lg p-4 text-center"
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-3xl mb-2 shadow-lg">
                  ✓
                </div>
                <p className="text-green-700 font-medium">
                  {message}
                  {countdown !== null && (
                    <span className="block text-sm mt-1 text-gray-600">
                      Chuyển về đăng nhập sau {countdown} giây...
                    </span>
                  )}
                </p>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 bg-red-50 border border-red-300 rounded-lg p-4 text-center"
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center text-3xl mb-2 shadow-lg">
                  !
                </div>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-gray-600 mt-6">
          Quay lại{" "}
          <Link to="/login" className="text-purple-600 hover:underline">
            đăng nhập
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
