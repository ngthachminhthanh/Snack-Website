import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2 } from "lucide-react";
import Header from "../../Header";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
    calculateTotal(cart);
  }, []);

  const calculateTotal = (items) => {
    const total = items.reduce(
      (sum, item) => sum + item.product_price * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  const updateQuantity = (productId, newQuantity) => {
    const parsedQuantity = parseInt(newQuantity);
    const updatedQuantity =
      isNaN(parsedQuantity) || parsedQuantity < 1 ? 1 : parsedQuantity;
    const updatedCart = cartItems.map((item) =>
      item.product_id === productId
        ? { ...item, quantity: updatedQuantity }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(
      (item) => item.product_id !== productId
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const handleCheckout = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      localStorage.setItem("redirectAfterLogin", "/cart");
      navigate("/login");
    } else {
      navigate("/order", { replace: true });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header input={false} />

      <h1 className="py-2 text-3xl font-bold text-gray-800 mt-20 mb-6 text-center bg-gradient-to-r from-pink-400 via-orange-500 to-red-500 text-transparent bg-clip-text">
        Giỏ hàng
      </h1>

      <main className="flex items-center justify-center px-4">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
          {cartItems.length > 0 ? (
            <>
              <div
                className="overflow-y-auto"
                style={{ maxHeight: "calc(100vh - 500px)" }}
              >
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <li
                      key={item.product_id}
                      className="py-4 flex items-center"
                    >
                      <img
                        src={item.product_image_link}
                        alt={item.product_name}
                        className="h-20 w-20 rounded-md object-cover"
                      />
                      <div className="ml-4 flex-grow">
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.product_name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(item.product_price)}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.product_id, e.target.value)
                          }
                          onBlur={(e) => {
                            if (
                              e.target.value === "" ||
                              parseInt(e.target.value) < 1
                            ) {
                              updateQuantity(item.product_id, 1);
                            }
                          }}
                          className="w-16 text-center rounded-md border-gray-300 shadow-sm focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
                        />
                        <p className="px-2">{item.product_unit}</p>
                        <button
                          onClick={() => removeItem(item.product_id)}
                          className="ml-4 mr-4 text-red-500 hover:text-red-700 transition duration-300"
                        >
                          <Trash2 size={24} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 border-t pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">
                    Tổng cộng
                  </span>
                  <span className="text-2xl font-bold text-pink-600">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(totalPrice)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Phí vận chuyển sẽ được tính khi thanh toán.
                </p>
                <button
                  onClick={handleCheckout}
                  className="mt-6 w-full bg-pink-600 text-white py-3 px-4 rounded-md hover:bg-pink-700 transition duration-300 relative overflow-hidden group"
                >
                  <span className="relative z-10 inline-flex">
                    Tiến hành thanh toán &nbsp;
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                  <span className="absolute left-0 inset-y-0 flex items-center justify-start w-0 bg-pink-700 group-hover:w-full transition-all duration-300"></span>
                </button>
                <Link
                  to="/"
                  className="mt-4 block w-full text-center bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300 relative overflow-hidden group"
                >
                  <span className="relative z-10 inline-flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16l-4-4m0 0l4-4m-4 4h18"
                      />
                    </svg>
                    &nbsp;Tiếp tục mua sắm
                  </span>
                  <span className="absolute right-0 inset-y-0 flex items-center justify-end w-0 bg-gray-300 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="mx-auto h-24 w-24 text-gray-400" />
              <h3 className="mt-2 text-xl font-medium text-gray-900">
                Giỏ hàng trống
              </h3>
              <p className="mt-1 text-lg text-gray-500">
                Hãy thêm một vài sản phẩm vào giỏ hàng của bạn.
              </p>
              <div className="mt-6">
                <Link
                  to="/"
                  className="bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition duration-300 relative overflow-hidden group inline-flex items-center"
                >
                  <span className="relative z-10 inline-flex text-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16l-4-4m0 0l4-4m-4 4h18"
                      />
                    </svg>
                    &nbsp; Tiếp tục mua sắm
                  </span>
                  <span className="absolute right-0 inset-y-0 flex items-center justify-end w-0 bg-pink-700 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Cart;
