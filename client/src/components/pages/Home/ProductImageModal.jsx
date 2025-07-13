import { X } from "lucide-react";

const ProductImageModal = ({
  isOpen,
  onClose,
  imageUrl,
  productName,
  productDescription,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-60 bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition duration-300"
        >
          <X className="text-gray-700" size={24} />
        </button>

        {/* Image */}
        <div className="flex items-center justify-center w-full p-4">
          <img
            src={imageUrl}
            alt={productName}
            className="max-w-full max-h-[60vh] object-contain rounded-lg"
          />
        </div>

        {/* Description */}
        <div className="px-6 pb-6 text-center">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            {productName}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed break-words">
            {productDescription}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductImageModal;
