import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

const Header = ({ title }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow">
      <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
      <div className="relative">
        <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none"
        >
          <User className="h-6 w-6 text-gray-400 mr-2" />
          Admin
          <ChevronDown className="w-4 h-4 ml-1" />
        </button>
        {isUserMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            <button
              onClick={handleLogout}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <LogOut className="inline w-4 h-4 mr-2" />
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
