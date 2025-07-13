import { useState, useEffect, useRef, useCallback } from "react";
import { FaCartPlus } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { motion } from "framer-motion";
import ChatBot from "../../chatbot/ChatBot";
import CartNotification from "./CartNotification";
import ProductImageModal from "./ProductImageModal";
import axios from "axios";
import Header from "../../Header";
import ProductSkeleton from "../../ProductSkeleton";
import "../../../assets/customCSS/LoadingEffect.css";
import Footer from "../../Footer";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const selectRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("");
  const [category, setCategory] = useState("");
  const [cartNotification, setCartNotification] = useState({
    isVisible: false,
    message: "",
  });
  const [selectedProductImage, setSelectedProductImage] = useState(null);
  const [selectedProductName, setSelectedProductName] = useState(null);
  const [selectedProductDescription, setSelectedProductDescription] =
    useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = category
        ? `${API_BASE_URL}/api/products/${category}`
        : `${API_BASE_URL}/api/products`;
      const response = await axios.get(endpoint);

      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  }, [category]);

  const handleSortChange = (value) => {
    setSortOrder(value);
    let sortedProducts = [...products];
    if (value === "highlow") {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else if (value === "lowhigh") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (value === "default") {
      fetchProducts();
    }
    setProducts(sortedProducts);

    // Bỏ focus sau khi chọn
    if (selectRef.current) {
      selectRef.current.blur();
    }
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
  };

  const openImageModal = (imageUrl, productName, productDescription) => {
    setSelectedProductImage(imageUrl);
    setSelectedProductName(productName);
    setSelectedProductDescription(productDescription);
  };

  const closeImageModal = () => {
    setSelectedProductImage(null);
    setSelectedProductName(null);
    setSelectedProductDescription(null);
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item.product_id === product._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        product_id: product._id,
        product_name: product.name,
        product_price: product.price,
        product_image_link: product.image,
        product_unit: product.unit,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setCartNotification({
      isVisible: true,
      message: `${product.name} đã được thêm vào giỏ hàng!`,
    });
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Xử lý phân quyền user/admin trên nhiều tab
  useEffect(() => {
    if (!location.pathname.includes("admin") && user?.isAdmin) {
      localStorage.removeItem("user");
      logout();
      navigate("/");
    }
  }, [location, logout, navigate, user?.isAdmin]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header input={true} setProducts={setProducts} />

      <ProductImageModal
        isOpen={!!selectedProductImage}
        onClose={closeImageModal}
        imageUrl={selectedProductImage}
        productName={selectedProductName}
        productDescription={selectedProductDescription}
      />

      <CartNotification
        message={cartNotification.message}
        isVisible={cartNotification.isVisible}
        onClose={() =>
          setCartNotification({ ...cartNotification, isVisible: false })
        }
      />

      <ChatBot />

      <div className="flex flex-col md:flex-row flex-grow mt-20 md:mt-24 lg:mt-16">
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="w-full md:w-64 bg-white shadow-lg p-6 md:fixed md:h-[calc(100vh-80px)] overflow-y-auto z-20"
        >
          <h2 className="mt-8 text-xl sm:text-2xl sm:mt-0 font-bold text-gray-800 mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Danh mục món ăn
          </h2>
          <div className="space-y-2">
            {[
              "Đồ ăn vặt mặn",
              "Đồ ăn vặt ngọt",
              "Đồ ăn vặt healthy",
              "Đồ ăn vặt nước ngoài",
              "Đồ uống & thạch rau câu",
            ].map((cat) => (
              <motion.p
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-md sm:text-lg p-3 rounded-lg cursor-pointer bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-pink-500 hover:via-red-500 hover:to-yellow-500 hover:text-white transition-all duration-300"
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </motion.p>
            ))}
          </div>
        </motion.aside>

        <main className="flex-grow md:ml-64 p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center mb-6"
          >
            <label className="text-lg font-bold mr-3 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Sắp xếp theo giá
            </label>
            <select
              ref={selectRef}
              className="bg-white border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-pink-500"
              value={sortOrder}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="default">Mặc định</option>
              <option value="highlow">Từ cao đến thấp</option>
              <option value="lowhigh">Từ thấp đến cao</option>
            </select>
          </motion.div>

          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </motion.div>
          ) : products.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {products.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                >
                  <div
                    className="h-48 overflow-hidden cursor-pointer"
                    onClick={() =>
                      openImageModal(
                        product.image,
                        product.name,
                        product.description
                      )
                    }
                  >
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      className="w-full h-full object-cover"
                      src={product.image}
                      alt={product.name}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-pink-600 font-bold">
                        {product.price.toLocaleString("vi-vn")}₫/{product.unit}
                      </span>
                      <motion.button
                        whileHover={{
                          scale: 1.1,
                          transition: {
                            type: "tween",
                            ease: "easeInOut",
                            duration: 0.25,
                          },
                        }}
                        whileTap={{
                          scale: 0.95,
                          transition: {
                            type: "tween",
                            ease: "easeOut",
                            duration: 0.15,
                          },
                        }}
                        onClick={() => addToCart(product)}
                        className="relative bg-gradient-to-r from-yellow-400 to-pink-500 p-3 rounded-full text-white shadow-md hover:shadow-lg transition duration-300"
                      >
                        <FaCartPlus className="text-xl" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center h-64"
            >
              <p className="text-lg text-gray-600">
                Oops! Không tìm thấy sản phẩm nào!
              </p>
            </motion.div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
