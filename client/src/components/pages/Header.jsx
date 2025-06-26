import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  ShoppingCart,
  UserCircle,
  Package,
  Pizza,
  CupSoda,
} from "lucide-react";
import { IoIosLogOut } from "react-icons/io";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";
import TypingPlaceholderInput from "./TypingPlaceholderInput";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Header = ({ input, setProducts }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const productsQuantityInCart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart")).length
    : 0;

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/products?search=${keyword}`
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("cart");
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 bg-white shadow-md">
      <div className="flex items-center">
        <motion.a
          href="/"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1, ease: "easeOut" }}
          whileHover={{ scale: 1.1, rotate: 1 }}
          whileTap={{ scale: 0.95 }}
          className="flex justify-center items-center gap-2 mx-2 text-2xl font-extrabold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-md transition-all duration-300"
        >
          <Pizza size={28} className="text-yellow-500 drop-shadow" />
          <span>ANVATCUNGTOI</span>
          <CupSoda size={28} className="text-orange-400 drop-shadow-sm" />
        </motion.a>
      </div>

      {input && (
        <div className="flex-grow mx-4">
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-72 max-w-md"
          >
            <TypingPlaceholderInput keyword={keyword} setKeyword={setKeyword} />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition duration-200"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-gray-600 ml-2 flex">
              <UserCircle className="mr-2" />
              {user.username}
            </span>
            <button className="px-4 py-2 text-gray-600 hover:text-blue-700 flex items-center">
              <Package className="mr-2 text-gray-600" />
              <Link to="/myorders">ĐƠN HÀNG CỦA TÔI</Link>
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-blue-700 flex items-center">
              <div className="relative">
                <ShoppingCart className="text-gray-600" />
                {productsQuantityInCart > 0 && (
                  <span className="absolute top-[-8px] right-[-8px] bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 w-4 h-4 flex items-center justify-center">
                    {productsQuantityInCart}
                  </span>
                )}
              </div>
              <Link to="/cart" className="ml-2">
                GIỎ HÀNG
              </Link>
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-600 hover:text-blue-700 flex items-center"
            >
              <IoIosLogOut className="text-xl mr-2 text-gray-600" />
              ĐĂNG XUẤT
            </button>
          </>
        ) : (
          <>
            <button className="px-4 py-2 text-gray-600 hover:text-blue-700 flex items-center">
              <div className="relative">
                <ShoppingCart className="ml-2 text-gray-600" />
                {productsQuantityInCart > 0 && (
                  <span className="absolute top-[-8px] right-[-8px] bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 w-4 h-4 flex items-center justify-center">
                    {productsQuantityInCart}
                  </span>
                )}
              </div>
              <Link to="/cart" className="ml-2">
                GIỎ HÀNG
              </Link>
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-blue-700">
              <Link to="/login">ĐĂNG NHẬP</Link>
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
