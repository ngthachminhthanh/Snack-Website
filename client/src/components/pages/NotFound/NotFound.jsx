import { Link } from "react-router-dom";
import SnackIcon from "../../../assets/img/iconOnTaskbar.png";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-6">
      <img
        src={SnackIcon}
        alt="404 Snack"
        className="w-60 sm:w-80 md:w-96 mb-6 animate-bounce"
      />

      <h1 className="text-4xl sm:text-5xl font-bold text-orange-600 mb-4 text-center">
        Oops! Không tìm thấy trang
      </h1>
      <p className="text-gray-700 text-center max-w-md mb-6">
        Có vẻ như bạn đang thèm món gì đó, nhưng trang bạn đang tìm không tồn
        tại. Hãy quay lại trang chủ của chúng tôi và đặt món nhé 🍟.
      </p>

      <Link
        to="/"
        className="inline-block bg-orange-500 text-white px-6 py-3 rounded-full text-sm sm:text-base font-semibold hover:bg-orange-600 transition duration-300 shadow-md"
      >
        Quay về trang chủ
      </Link>
    </div>
  );
}
