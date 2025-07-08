import { useState, useEffect } from "react";
import {
  Package2,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { getStatusName } from "../../../utils/utilities";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Header from "../Header";
import SkeletonLoader from "../SkeletonLoader";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) return;
      setLoading(true);
      setError(null);

      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/api/myorders/${user.email}`
        );
        setOrders(data);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Không thể tải dữ liệu đơn hàng";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.email]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "waiting for confirmation":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "shipping":
        return <Truck className="w-5 h-5 text-blue-500" />;
      case "delivered":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package2 className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <>
      <Header input={false} />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="mt-20 text-2xl font-bold mb-6 bg-gradient-to-r from-pink-400 via-orange-500 to-red-500 text-transparent bg-clip-text text-center">
          Đơn Hàng Của Bạn
        </h1>

        {loading ? (
          <SkeletonLoader count={3} />
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
            <ShoppingBag className="w-16 h-16 text-gray-300" />
            <h2 className="text-lg font-semibold text-gray-700">
              Bạn chưa có đơn hàng nào
            </h2>
            <p className="text-sm text-gray-500 max-w-sm">
              Khi bạn đặt hàng, đơn hàng sẽ hiển thị tại đây để bạn dễ dàng theo
              dõi trạng thái và chi tiết đơn hàng.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="border rounded-lg shadow-sm bg-white"
              >
                <div
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => toggleOrderExpand(order.orderId)}
                >
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(order.status)}
                    <div>
                      <p className="font-medium">
                        Đơn hàng #{order.orderId.slice(-6)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.date_order).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-medium text-sm sm:text-base">
                      {order.total_price.toLocaleString("vi-VN")}đ
                    </span>
                    {expandedOrders[order.orderId] ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {expandedOrders[order.orderId] && (
                    <motion.div
                      key={order.orderId}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t p-4 overflow-hidden bg-gray-50"
                    >
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">Trạng thái:</span>
                          <span className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            {getStatusName(order.status)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Địa chỉ:</span>
                          <span className="text-right max-w-xs">
                            {order.address}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Thanh toán:</span>
                          <span>
                            {order.payment.method === "Cash on Delivery"
                              ? "Thanh toán khi nhận hàng"
                              : order.payment.method}
                          </span>
                        </div>
                        {order.note && (
                          <div className="flex justify-between">
                            <span className="font-medium">Ghi chú:</span>
                            <span className="text-right">{order.note}</span>
                          </div>
                        )}

                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Sản phẩm:</h4>
                          <div className="space-y-2">
                            {order.products.map((product, index) => (
                              <div key={index} className="flex justify-between">
                                <span>
                                  {product.name} x{product.quantity}
                                </span>
                                <span>
                                  {(
                                    product.price * product.quantity
                                  ).toLocaleString("vi-VN")}
                                  đ
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyOrders;
