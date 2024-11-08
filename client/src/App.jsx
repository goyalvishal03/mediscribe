import React, { useState } from 'react';
import RecordingButton from './components/RecordingButton';
import LoadingSpinner from './components/LoadingSpinner';
import { useAudioRecorder } from './hooks/useAudioRecorder';
import { transcriptionService, summaryService } from './services/api';

const App = () => {
  const [loading, setLoading] = useState(false);
  const [transcription, setTranscription] = useState(null);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const { startRecording, stopRecording, isRecording } = useAudioRecorder();

  const handleStartRecording = async () => {
    try {
      setError(null);
      setTranscription(null);
      await startRecording();
    } catch (error) {
      setError('Failed to start recording. Please check your microphone permissions.');
      console.error('Failed to start recording:', error);
    }
  };

  const handleStopRecording = async () => {
    try {
      const audioBlob = await stopRecording();

      if (!audioBlob) {
        setError('Recording was too short or empty. Please try again.');
        return;
      }

      if (audioBlob.size < 1000) {
        setError('Recording was too short. Please record a longer message.');
        return;
      }

      console.log('Audio Blob Size:', audioBlob.size);
      setLoading(true);
      setError(null);

      const result = await transcriptionService.processAudio(audioBlob);

      if (!result.transcription) {
        throw new Error('No transcription received');
      }

      setTranscription(result.transcription);
    } catch (error) {
      setError('Failed to process recording. Please try again.');
      console.error('Failed to process recording:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await summaryService.generateSummary(transcription);
      const summaryData = JSON.parse(response);
      setSummary(summaryData);
    } catch (error) {
      setError('Failed to generate summary. Please try again.');
      console.error('Failed to generate summary:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Medical Visit Recorder
        </h1>

        <div className="text-center">
          <RecordingButton
            isRecording={isRecording}
            onStart={handleStartRecording}
            onStop={handleStopRecording}
          />
          {transcription && (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded mt-4"
              onClick={handleGenerateSummary}
            >
              Summarize Transcription
            </button>
          )}
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </div>

        {loading && <LoadingSpinner />}
        {transcription && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
            <h2 className="text-2xl font-semibold mb-4">Transcription</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{transcription}</p>
          </div>
        )}
        {summary && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
            <h2 className="text-2xl font-semibold mb-4">Summary</h2>
            <div>
              {summary['Vital signs'] && (
                <div>
                  <h3 className="text-lg font-semibold">Vital signs</h3>
                  <p>Temperature: {summary['Vital signs'].Temperature}</p>
                </div>
              )}
              <h3 className="text-lg font-semibold">Chief complaints</h3>
              {/* Ensure 'Chief complaints' exists */}
              <p>{summary['Chief complaints'] || 'No chief complaints available.'}</p>
              {summary['Past medical history'] && (
                <div>
                  <h3 className="text-lg font-semibold">Past medical history</h3>
                  <p>{summary['Past medical history']}</p>
                </div>
              )}
              <h3 className="text-lg font-semibold">General examination</h3>
              <p>{summary['General examination'] || 'No general examination available.'}</p>
              <h3 className="text-lg font-semibold">Diagnosis</h3>
              <p>{summary['Diagnosis'] || 'No diagnosis available.'}</p>
              <h3 className="text-lg font-semibold">Prescription</h3>
              {Array.isArray(summary['RX']) && summary['RX'].length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 p-2">Medicine name</th>
                      <th className="border border-gray-300 p-2">Dosage</th>
                      <th className="border border-gray-300 p-2">Timing and duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary['RX'].map((item, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-2">{item['Medicine name']}</td>
                        <td className="border border-gray-300 p-2">{item['Dosage']}</td>
                        <td className="border border-gray-300 p-2">{item['Timing and duration']}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No prescription data available.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
