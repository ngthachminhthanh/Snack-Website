const SkeletonLoader = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse border rounded-lg shadow-sm bg-white p-4 space-y-3"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-gray-300 rounded-full h-6 w-6" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-1/4 mt-4" />
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
