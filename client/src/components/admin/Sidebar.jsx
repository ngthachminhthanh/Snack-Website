import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, Package, Users } from "lucide-react";

const menuItems = [
  { name: "Trang chủ", icon: Home, route: "/admin/dashboard" },
  { name: "Đơn hàng", icon: ShoppingBag, route: "/admin/orders" },
  { name: "Danh sách món ăn", icon: Package, route: "/admin/products" },
  { name: "Khách hàng", icon: Users, route: "/admin/customers" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-indigo-700 text-white min-h-screen">
      <div className="flex items-center justify-center h-16 bg-indigo-700">
        <Link
          to="/admin/dashboard"
          className="text-2xl font-extrabold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-md transition-all duration-300"
        >
          ANVATCUNGTOI
        </Link>
      </div>
      <nav className="mt-8">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.route}
            className={`flex items-center px-6 py-3 text-indigo-100 hover:bg-indigo-600 transition-colors duration-200 ${
              location.pathname === item.route ? "bg-indigo-800" : ""
            }`}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
