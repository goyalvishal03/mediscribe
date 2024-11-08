import React from 'react';

const RecordingButton = ({ isRecording, onStart, onStop }) => {
  return (
    <button
      onClick={isRecording ? onStop : onStart}
      className={`px-6 py-3 rounded-lg text-white font-medium transition-colors ${
        isRecording 
          ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
          : 'bg-blue-500 hover:bg-blue-600'
      }`}
    >
      {isRecording ? 'Stop Recording' : 'Start Recording'}
    </button>
  );
};

export default RecordingButton;