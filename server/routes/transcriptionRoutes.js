const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { processTranscription, processSummary } = require('../controllers/transcriptionController');

router.post('/transcribe', upload.single('audio'), processTranscription);
router.post('/summary', express.json(), processSummary);

module.exports = router;