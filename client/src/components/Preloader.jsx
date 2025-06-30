import React, { useState, useEffect } from 'react';

const Preloader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-tr from-indigo-100 to-blue-200">
        <div className="flex flex-col items-center space-y-6">
          {/* Ring Spinner */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-indigo-300 rounded-full animate-spin border-t-transparent" />
            <div className="absolute inset-2 bg-white rounded-full" />
          </div>

          {/* Typewriter Text */}
          <div className="text-xl font-mono text-indigo-800 animate-typing overflow-hidden border-r-2 border-indigo-800 whitespace-nowrap">
            Launching SilentVote...
          </div>
        </div>
      </div>
    );
  }
};

export default Preloader;
