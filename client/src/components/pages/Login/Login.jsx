import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import axios from "axios";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
facebookProvider.setCustomParameters({
  auth_type: "reauthenticate", // Bắt buộc Facebook hiện form chọn tài khoản
});

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_BASE_URL}/auth/loginWithEmailandPassword`,
        formData
      );
      login(res.data.user, res.data.token);

      const redirectPath = localStorage.getItem("redirectAfterLogin");
      if (res.data.user.isAdmin) {
        navigate("/admin/dashboard");
      } else if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectPath);
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Gửi token đến backend để xác thực
      const res = await axios.post(`${API_BASE_URL}/auth/login/google`, {
        idToken,
      });
      login(user, idToken);

      const redirectPath = localStorage.getItem("redirectAfterLogin");
      if (res.data.user.isAdmin) {
        navigate("/admin/dashboard");
        return;
      }
      if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectPath);
        return;
      }
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.msg || "Lỗi đăng nhập với Google. Vui lòng thử lại."
      );
    }
  };

  // Handle Facebook Login
  const handleFacebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Gửi token đến backend để xác thực
      const res = await axios.post(`${API_BASE_URL}/auth/login/facebook`, {
        idToken,
      });
      login(user, idToken);

      const redirectPath = localStorage.getItem("redirectAfterLogin");
      if (res.data.user.isAdmin) {
        navigate("/admin/dashboard");
        return;
      }
      if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectPath);
        return;
      }
      navigate("/");
    } catch (err) {
      console.error("Lỗi đăng nhập Facebook:", err);

      if (err.code === "auth/account-exists-with-different-credential") {
        const email = err.customData?.email;

        if (email) {
          try {
            const methods = await fetchSignInMethodsForEmail(auth, email);

            if (methods.length > 0) {
              let providerName = "phương thức khác";

              if (methods.includes("google.com")) providerName = "Google";
              else if (methods.includes("password"))
                providerName = "Email & Mật khẩu";
              else if (methods.includes("facebook.com"))
                providerName = "Facebook";

              setError(
                `Tài khoản này đã được đăng ký bằng ${providerName}. Vui lòng đăng nhập bằng ${providerName}.`
              );
            } else {
              setError(
                `Tài khoản này đã tồn tại nhưng không rõ phương thức đăng nhập. Vui lòng thử cách đăng nhập khác.`
              );
            }
          } catch (fetchErr) {
            console.error("Lỗi khi kiểm tra provider:", fetchErr);
            setError(
              "Không thể xác minh phương thức đăng nhập cho tài khoản này. Vui lòng thử lại sau."
            );
          }
        } else {
          setError("Không thể xác định email liên kết với tài khoản này.");
        }
      }
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
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Đăng nhập
        </h2>
        <form onSubmit={onSubmit}>
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
          {error && (
            <div className="mb-4 text-red-500 text-center bg-red-100 border border-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors duration-200"
          >
            Đăng nhập
          </motion.button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500 text-sm">
            Hoặc đăng nhập bằng
          </span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google and Facebook Login Buttons */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
          >
            <FcGoogle size={20} />
            Đăng nhập với Google
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleFacebookLogin}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            <FaFacebook size={20} />
            Đăng nhập với Facebook
          </motion.button>
        </div>

        <p className="text-center text-gray-600 mt-6">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-purple-600 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
