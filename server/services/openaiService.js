const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const config = require('../config/config');

const genAI = new GoogleGenerativeAI(config.GOOGLE_GEMINI_PRIVATE_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "Please act as a medical documentation assistant. Use simple English since the patients are non-native English speakers. Based on the following note recorded by a doctor, generate a formal medical prescription with the following sections (don't create a bulleted list) in the following order:\n\nVital signs (if mentioned, otherwise don't show the title)\nChief complaints: List the main symptoms as reported\nPast medical history: Notable habits and conditions (if available)\nGeneral examination:\nDiagnosis:\n\nAfter writing the above, write the following:\n\nRX Prescription details in a table format (create table with borders) with columns for:\nMedicine name\nDosage (This does not refer to mg of the medicine, it refers to how often in a day the medicine is to be taken, usually represented by 1-1-1 notation if to be taken in morning-noon-evening, 1-0-1 if to be taken in morning and evening. Doctor will read it out as e.g. 101)\nTiming and duration\n\nNo need to write patient name and date or \"Medical prescription\""
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

const controllers = {
  async generateSummary(transcription) {
    try {
      const chatSession = model.startChat({
        generationConfig,
        history: [
          {
            role: "user",
            parts: [
              { text: transcription }
            ],
          },
        ],
      });

      const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
      console.log(result.response.text());
      return result.response.text();
    } catch (error) {
      console.error('Error in generateSummary:', error);
      throw error;
    }
  },
};

module.exports = controllers;