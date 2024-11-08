import React from 'react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center my-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    <span className="ml-3">Processing audio...</span>
  </div>
);

export default LoadingSpinner;