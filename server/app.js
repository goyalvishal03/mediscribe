const express = require('express');
// const cors = require('cors');
const config = require('./config/config');
const transcriptionRoutes = require('./routes/transcriptionRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// app.use(cors({
//   origin: config.allowedOrigins,
//   methods: ['GET', 'POST'],
//   allowedHeaders: ['Content-Type'],
// }));

app.use(express.json());
app.use('/api', transcriptionRoutes);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});