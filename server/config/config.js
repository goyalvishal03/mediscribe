require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  deepgramApiKey: process.env.DEEPGRAM_API_KEY,
  nodeEnv: process.env.NODE_ENV || 'development',
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['https://mediscribe-navy.vercel.app/'],
  GOOGLE_GEMINI_PRIVATE_KEY: process.env.GOOGLE_GEMINI_PRIVATE_KEY,
};

module.exports = config;