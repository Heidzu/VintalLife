const multer = require('multer');

const errorHandler = (error, _req, res, _next) => {
    // Log error for debugging
    console.error('------- ERROR START -------');
    console.error(`Time: ${new Date().toISOString()}`);
    console.error(`Name: ${error.name}`);
    console.error(`Message: ${error.message}`);
    if (error.stack) console.error(`Stack: ${error.stack}`);
    if (error.errors) console.error('Details:', JSON.stringify(error.errors, null, 2));
    console.error('------- ERROR END -------');

    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal server error.';
    let details = error.errors || [];

    if (error.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid resource identifier.';
    }

    if (error.name === 'ValidationError') {
        statusCode = 400;
        details = Object.values(error.errors).map((item) => ({
            message: item.message,
            path: item.path
        }));
        message = 'Database validation failed.';
    }

    if (error.code === 11000) {
        statusCode = 409;
        message = 'Duplicate data is not allowed.';
    }

    if (error instanceof multer.MulterError) {
        statusCode = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
        message = error.code === 'LIMIT_FILE_SIZE'
            ? 'Uploaded file is too large.'
            : error.message;
    }

    res.status(statusCode).json({
        success: false,
        message,
        errors: details,
        ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {})
    });
};

module.exports = errorHandler;