const multer = require('multer');
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      error: 'File upload error',
      message: err.message,
    });
  }

  res.status(err.status || 500).json({
    error: 'Server error',
    message: err.message || 'An unexpected error occurred',
  });
};

module.exports = errorHandler;