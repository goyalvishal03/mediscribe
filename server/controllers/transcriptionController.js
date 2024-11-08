// controllers/transcriptionController.js
const deepgramService = require('../services/deepgramService');
const { generateSummary } = require('../services/openaiService');

const processTranscription = async (req, res, next) => {
  try {
    if (!req.file || !req.file.buffer) {
      console.error('No audio file provided or file buffer is empty');
      return res.status(400).json({ error: 'No audio file provided or file buffer is empty' });
    }

    if (req.file.size < 1000) {
      console.error('Audio file too small');
      return res.status(400).json({ error: 'Audio file too small. Please record a longer message.' });
    }

    console.log('Processing file:', {
      size: req.file.size,
      mimetype: req.file.mimetype,
      originalname: req.file.originalname
    });

    const transcription = await deepgramService.transcribeAudio(req.file.buffer);
    
    if (!transcription || transcription.trim().length === 0) {
      console.error('Empty transcription received');
      return res.status(422).json({ error: 'Could not transcribe audio. Please try again with clearer audio.' });
    }

    console.log('Transcription received:', transcription);
    res.json({ transcription });
  } catch (error) {
    console.error('Error in processTranscription:', error);
    next(error);
  }
};

const processSummary = async (req, res, next) => {
  try {
    const { transcription } = req.body;
    if (!transcription) {
      return res.status(400).json({ error: 'No transcription provided' });
    }

    const summary = await generateSummary(transcription);
    res.json({ summary });
  } catch (error) {
    console.error('Error in processSummary:', error);
    next(error);
  }
};

module.exports = {
  processTranscription,
  processSummary,
};