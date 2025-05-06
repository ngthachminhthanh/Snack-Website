import { useState, useEffect, useRef, useCallback } from "react";
import { FaCartPlus } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import ChatBot from "../../chatbot/ChatBot";
import CartNotification from "./CartNotification";
import ProductImageModal from "./ProductImageModal";
import axios from "axios";
import Header from "../Header";
import "../../../assets/customCSS/LoadingEffect.css";

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const selectRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [category, setCategory] = useState("");
  const [cartNotification, setCartNotification] = useState({
    isVisible: false,
    message: "",
  });
  const [selectedProductImage, setSelectedProductImage] = useState(null);
  const [selectedProductName, setSelectedProductName] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = category
        ? `http://localhost:5000/api/products/${category}`
        : "http://localhost:5000/api/products";
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

  const openImageModal = (imageUrl, productName) => {
    setSelectedProductImage(imageUrl);
    setSelectedProductName(productName);
  };

  const closeImageModal = () => {
    setSelectedProductImage(null);
    setSelectedProductName(null);
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
    <div className="flex flex-col min-h-screen">
      <Header input={true} setProducts={setProducts} />

      <ProductImageModal
        isOpen={!!selectedProductImage}
        onClose={closeImageModal}
        imageUrl={selectedProductImage}
        productName={selectedProductName}
      />

      <CartNotification
        message={cartNotification.message}
        isVisible={cartNotification.isVisible}
        onClose={() =>
          setCartNotification({ ...cartNotification, isVisible: false })
        }
      />

      <ChatBot />

      <div className="flex flex-grow mt-14">
        <div className="w-1/6 fixed h-full bg-gray-100 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 p-6 gradient-text">
            Danh mục
          </h2>
          <div>
            {[
              "Đồ ăn vặt mặn",
              "Đồ ăn vặt ngọt",
              "Đồ ăn vặt healthy",
              "Đồ ăn vặt nước ngoài",
              "Đồ uống & thạch rau câu",
            ].map((cat) => (
              <p
                key={cat}
                className="transition duration-200 text-md p-4 rounded-md cursor-pointer bg-white text-gray-700 hover:bg-gradient-to-r hover:from-pink-500 hover:via-red-500 hover:to-yellow-500 hover:text-yellow-100 hover:drop-shadow-md"
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </p>
            ))}
          </div>
        </div>

        <div className="w-5/6 ml-auto bg-gray-100 p-6">
          <div className="flex items-center mb-6">
            <label className="text-lg font-bold mr-2">Sắp xếp theo giá</label>
            <select
              ref={selectRef}
              className="bg-white border border-gray-300 rounded-md p-2"
              value={sortOrder}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="default">Mặc định</option>
              <option value="highlow">Từ cao đến thấp</option>
              <option value="lowhigh">Từ thấp đến cao</option>
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="loader"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="relative bg-white rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl"
                >
                  <div
                    className="h-48 bg-gray-200 overflow-hidden cursor-pointer"
                    onClick={() => openImageModal(product.image, product.name)}
                  >
                    <img
                      className="w-full h-full object-cover transition duration-300 ease-in-out transform hover:scale-110"
                      src={product.image}
                      alt={product.name}
                    />
                  </div>
                  <div className="p-4 cursor-default">
                    <h3 className="text-lg font-semibold mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-pink-700 font-bold">
                        {product.price.toLocaleString("vi-vn")}₫/{product.unit}
                      </span>
                      <div className="absolute bottom-4 right-4 group w-12 h-12">
                        <button
                          onClick={() => addToCart(product)}
                          className="absolute inset-0 bg-gray-200 p-2 rounded-full hover:bg-transparent transition duration-300 ease-in-out w-12 h-12 flex justify-center items-center z-10 overflow-hidden"
                        >
                          <FaCartPlus className="text-2xl text-gray-700 group-hover:text-white transition duration-300" />
                        </button>

                        <div className="absolute inset-0 rounded-full scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 z-0" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg">Oops! Không tìm thấy sản phẩm nào!</p>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-black text-white px-72 py-8 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/2 lg:w-1/4 mb-8 md:mb-0">
              <h4 className="text-lg font-semibold mb-4 pb-2 border-b-2 border-gray-500 inline-block">
                Liên hệ
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-pink-700 transition duration-300"
                  >
                    SDT: 0123 456 789
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-pink-700 transition duration-300"
                  >
                    Thủ Đức TPHCM
                  </a>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/2 lg:w-1/4 mb-8 md:mb-0">
              <h4 className="text-lg font-semibold mb-4 pb-2 border-b-2 border-gray-500 inline-block">
                Theo dõi chúng tôi
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-pink-700 transition duration-300"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-pink-700 transition duration-300"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/2 lg:w-1/4">
              <h4 className="text-lg font-semibold mb-4 pb-2 border-b-2 border-gray-500 inline-block">
                Chính sách
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-pink-700 transition duration-300"
                  >
                    Chính sách bảo mật
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-pink-700 transition duration-300"
                  >
                    Quy định &amp; Điều khoản
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
