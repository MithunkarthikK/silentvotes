const PollResultSkeleton = () => (
  <div className="animate-pulse bg-white rounded-2xl shadow-lg p-6">
    <div className="h-5 bg-gray-300 rounded w-3/4 mb-4"></div>
    <div className="h-56 bg-gray-200 rounded mb-4"></div>
    <div className="space-y-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
      ))}
    </div>
  </div>
);

export default PollResultSkeleton;
