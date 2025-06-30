import React, { useState, useEffect } from 'react';

const Preloader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-20 h-20 rounded-full bg-white shadow-lg mx-auto relative animate-pulse border-4 border-blue-500" />
            <div className="mt-4 text-xl font-semibold text-indigo-700 tracking-wide">
              SilentVote is getting ready...
            </div>
          </div>
          <div className="flex justify-center items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-100" />
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-200" />
          </div>
        </div>
      </div>
    );
  }
};

export default Preloader;
