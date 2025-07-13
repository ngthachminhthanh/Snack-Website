const ProductSkeleton = () => {
  return (
    <div className="animate-pulse bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 p-4 rounded-xl shadow">
      <div className="h-48 bg-gray-300 rounded-md mb-4" />
      <div className="h-4 bg-gray-400 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-300 rounded w-full mb-4" />
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-400 rounded w-1/3" />
        <div className="h-8 w-8 bg-gray-400 rounded-full" />
      </div>
    </div>
  );
};

export default ProductSkeleton;
