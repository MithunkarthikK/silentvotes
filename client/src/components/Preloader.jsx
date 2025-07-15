export default function Preloader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white transition-all duration-500">
      <div className="animate-bounce mb-4">
        <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M9 12h6m-6 4h6m-9 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-semibold animate-pulse tracking-wider">SilentVote</h1>
      <p className="text-sm text-gray-100 mt-2 animate-pulse">Launching your experience...</p>
    </div>
  );
}
