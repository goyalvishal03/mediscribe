// services/deepgramService.js
const { createClient } = require("@deepgram/sdk");
const config = require('../config/config');

const deepgram = createClient(config.deepgramApiKey);

const transcribeAudio = async (audioBuffer) => {
  try {
    if (!audioBuffer || audioBuffer.length === 0) {
      throw new Error('Audio buffer is empty');
    }

    console.log('Audio buffer size:', audioBuffer.length);

    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      audioBuffer,
      {
        model: "nova-2-medical",
        smart_format: true,
        language: "en-US"
      }
    );

    if (error) {
      throw new Error(`Deepgram transcription error: ${error.message}`);
    }

    // Extract the transcript from the result
    const transcript = result.results.channels[0].alternatives[0].transcript;
    return transcript;

  } catch (error) {
    console.error('Deepgram transcription error:', error);
    throw new Error(`Failed to transcribe audio: ${error.message}`);
  }
};

module.exports = {
  transcribeAudio
};