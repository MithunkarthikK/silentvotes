const CreatePollSkeleton = () => (
  <div className="animate-pulse bg-white rounded-xl shadow-md p-6 max-w-xl mx-auto">
    <div className="h-6 bg-gray-300 rounded w-2/3 mb-4"></div>
    {[...Array(3)].map((_, i) => (
      <div key={i} className="h-4 bg-gray-200 rounded w-full mb-3"></div>
    ))}
    <div className="h-10 bg-green-300 rounded w-full mt-6"></div>
  </div>
);

export default CreatePollSkeleton;
