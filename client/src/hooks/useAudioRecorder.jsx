// hooks/useAudioRecorder.js
import { useState } from 'react';

export const useAudioRecorder = () => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          sampleSize: 16
        } 
      });
      
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
        audioBitsPerSecond: 128000
      });
      
      setAudioChunks([]);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((chunks) => [...chunks, event.data]);
        }
      };

      recorder.start(1000); // Collect data every second
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  };

  const stopRecording = () => {
    return new Promise((resolve) => {
      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        resolve(null);
        return;
      }

      mediaRecorder.onstop = async () => {
        try {
          if (audioChunks.length === 0) {
            throw new Error('No audio data recorded');
          }

          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          
          // Only resolve if the blob has sufficient data
          if (audioBlob.size < 1000) { // Minimum size threshold
            throw new Error('Recording too short or empty');
          }

          setAudioChunks([]);
          mediaRecorder.stream.getTracks().forEach(track => track.stop());
          setIsRecording(false);
          resolve(audioBlob);
        } catch (error) {
          console.error('Error processing recording:', error);
          resolve(null);
        }
      };

      mediaRecorder.stop();
    });
  };

  return {
    startRecording,
    stopRecording,
    isRecording
  };
};