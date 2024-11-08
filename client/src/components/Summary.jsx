import React from 'react';

const Summary = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-semibold mb-4">Visit Summary</h2>
      <div className="space-y-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key}>
            <h3 className="text-lg font-medium capitalize">{key.replace('_', ' ')}</h3>
            <p className="text-gray-700 mt-1">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Summary;