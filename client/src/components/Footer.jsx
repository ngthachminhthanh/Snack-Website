import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <motion.footer
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 15 }}
      className="bg-gradient-to-r from-gray-900 to-black text-white py-6 px-4 md:ml-64"
    >
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div>
          <h4 className="text-lg font-semibold mb-4 pb-2 border-b-2 border-gray-500 inline-block">
            Liên hệ
          </h4>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-pink-600 transition duration-300"
              >
                SDT: 0123 456 789
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-pink-600 transition duration-300"
              >
                Bình Thạnh, TPHCM
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4 pb-2 border-b-2 border-gray-500 inline-block">
            Theo dõi chúng tôi
          </h4>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-pink-600 transition duration-300"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-pink-600 transition duration-300"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4 pb-2 border-b-2 border-gray-500 inline-block">
            Chính sách
          </h4>
          <ul className="space-y-2">
            <li>
              <Link
                to="/privacy-policy"
                className="text-gray-400 hover:text-pink-600 transition duration-300"
              >
                Chính sách bảo mật
              </Link>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-pink-600 transition duration-300"
              >
                Quy định & Điều khoản
              </a>
            </li>
          </ul>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
