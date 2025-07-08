import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  ShoppingCart,
  UserCircle,
  Package,
  Pizza,
  CupSoda,
  ChevronDown,
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef(null);

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
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // useEffect để xử lý click ngoài header
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <motion.header
      ref={headerRef}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-white to-gray-50 shadow-lg px-4 py-3"
    >
      <div className="container mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Logo Section */}
        <div className="flex items-center justify-between">
          <motion.a
            href="/"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-2xl font-extrabold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent"
          >
            <Pizza size={24} className="text-yellow-500" />
            <span>ANVATCUNGTOI</span>
            <CupSoda size={24} className="text-orange-400" />
          </motion.a>
          {/* Dropdown toggle with cart item count */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMenu}
            className="sm:hidden relative text-gray-600 hover:text-blue-600 transition duration-200"
          >
            <ChevronDown
              className={`w-6 h-6 ${isMenuOpen ? "rotate-180" : ""}`}
            />
            {productsQuantityInCart > 0 && (
              <span className="absolute -top-3 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                {productsQuantityInCart}
              </span>
            )}
          </motion.button>
        </div>

        {/* Search Bar */}
        {input && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex-grow w-full sm:w-auto max-w-md"
          >
            <form onSubmit={handleSearchSubmit} className="relative">
              <TypingPlaceholderInput
                keyword={keyword}
                setKeyword={setKeyword}
              />
              <motion.button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition duration-200"
              >
                <Search className="w-5 h-5" />
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* User Actions */}
        <div className="flex items-center justify-end gap-3">
          {/* Dropdown menu for mobile */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: isMenuOpen ? 1 : 0,
              height: isMenuOpen ? "auto" : 0,
            }}
            transition={{ duration: 0.3 }}
            className="sm:hidden absolute top-12 right-4 bg-white shadow-lg rounded-lg overflow-hidden z-40 border border-gray-200"
          >
            <div className="flex flex-col px-4 py-2 gap-2">
              {user ? (
                <>
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center text-gray-700 font-medium px-2 py-1 cursor-pointer"
                  >
                    <img
                      referrerPolicy="no-referrer"
                      src={
                        user?.photoURL ||
                        "https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png"
                      }
                      alt="avatar"
                      className="w-6 h-6 rounded-full ml-1 mr-2 object-cover"
                    />
                    {user.displayName || user.username}
                  </motion.span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center px-3 py-1 text-gray-600 hover:text-blue-600 transition duration-200"
                  >
                    <Package className="mr-1 w-5 h-5 text-gray-600" />
                    <Link to="/myorders">ĐƠN HÀNG</Link>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center px-3 py-1 text-gray-600 hover:text-blue-600 transition duration-200"
                  >
                    <div className="relative mr-1">
                      <ShoppingCart className="w-5 h-5 text-gray-600" />
                      {productsQuantityInCart > 0 && (
                        <span className="absolute -top-3 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                          {productsQuantityInCart}
                        </span>
                      )}
                    </div>
                    <Link to="/cart" className="ml-1">
                      GIỎ HÀNG
                    </Link>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="flex items-center px-3 py-1 text-gray-600 hover:text-blue-600 transition duration-200"
                  >
                    <IoIosLogOut className="mr-1 text-lg text-gray-600" />
                    ĐĂNG XUẤT
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center px-3 py-1 text-gray-600 hover:text-blue-600 transition duration-200"
                  >
                    <div className="relative mr-1">
                      <ShoppingCart className="w-5 h-5 text-gray-600" />
                      {productsQuantityInCart > 0 && (
                        <span className="absolute -top-3 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                          {productsQuantityInCart}
                        </span>
                      )}
                    </div>
                    <Link to="/cart" className="ml-1">
                      GIỎ HÀNG
                    </Link>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1 text-gray-600 hover:text-blue-600 transition duration-200 text-left"
                  >
                    <Link to="/login">ĐĂNG NHẬP</Link>
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>

          {/* User actions for desktop */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="hidden sm:flex flex-wrap items-center justify-end gap-3 text-sm sm:text-base"
          >
            {user ? (
              <>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center text-gray-700 font-medium px-2 py-1"
                >
                  <img
                    src={
                      user?.photoURL ||
                      "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740"
                    }
                    alt="avatar"
                    className="w-6 h-6 rounded-full ml-1 mr-2 object-cover"
                  />
                  {user.displayName}
                </motion.span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-3 py-1 text-gray-600 hover:text-blue-600 transition duration-200"
                >
                  <Package className="mr-1 w-5 h-5 text-gray-600" />
                  <Link to="/myorders">ĐƠN HÀNG</Link>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-3 py-1 text-gray-600 hover:text-blue-600 transition duration-200"
                >
                  <div className="relative mr-1">
                    <ShoppingCart className="w-5 h-5 text-gray-600" />
                    {productsQuantityInCart > 0 && (
                      <span className="absolute -top-3 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                        {productsQuantityInCart}
                      </span>
                    )}
                  </div>
                  <Link to="/cart" className="ml-1">
                    GIỎ HÀNG
                  </Link>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center px-3 py-1 text-gray-600 hover:text-blue-600 transition duration-200"
                >
                  <IoIosLogOut className="mr-1 text-lg text-gray-600" />
                  ĐĂNG XUẤT
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-3 py-1 text-gray-600 hover:text-blue-600 transition duration-200"
                >
                  <div className="relative mr-1">
                    <ShoppingCart className="w-5 h-5 text-gray-600" />
                    {productsQuantityInCart > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                        {productsQuantityInCart}
                      </span>
                    )}
                  </div>
                  <Link to="/cart" className="ml-1">
                    GIỎ HÀNG
                  </Link>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1 text-gray-600 hover:text-blue-600 transition duration-200"
                >
                  <Link to="/login">ĐĂNG NHẬP</Link>
                </motion.button>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
