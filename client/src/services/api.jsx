// services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mediscribe-backend.vercel.app/api';

export const transcriptionService = {
  async processAudio(audioBlob) {
    if (!audioBlob || audioBlob.size === 0) {
      throw new Error('Invalid audio data');
    }

    const formData = new FormData();
    formData.append('audio', audioBlob);

    try {
      const response = await axios.post(`${API_BASE_URL}/transcribe`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout
      });

      if (!response.data || !response.data.transcription) {
        throw new Error('Invalid response from server');
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(`Server error: ${error.response.data.error || 'Unknown error'}`);
      }
      throw error;
    }
  },
};

export const summaryService = {
  async generateSummary(transcription) {
    if (!transcription) {
      throw new Error('No transcription provided');
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/summary`, { transcription }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });
      console.log(response);
      if (!response.data || !response.data.summary) {
        throw new Error('Invalid response from server');
      }

      return response.data.summary;
    } catch (error) {
      if (error.response) {
        throw new Error(`Server error: ${error.response.data.error || 'Unknown error'}`);
      }
      throw error;
    }
  },
};