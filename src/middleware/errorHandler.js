const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.response?.status || err.statusCode || 500;
    const message = err.response?.data?.message || err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        error: message,
        timestamp: new Date().toISOString(),
    });
};

module.exports = errorHandler;
