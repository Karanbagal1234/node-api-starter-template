
import logger from "../utils/logger.js"; // Import the logger

// Centralized Error Handling Middleware
const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Handle Joi Validation Errors
    if (err.details) {
        statusCode = 400;
        message = err.details.map((detail) => detail.message).join(', ');
    }

    // Handle Mongoose Validation Errors
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map((val) => val.message).join(', ');
    }

    // Handle Mongoose CastError (Invalid ID format)
    if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // Handle Duplicate Key Error (MongoDB)
    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue);
        message = `Duplicate field value: ${field.join(", ")} already exists`;
    }

    // Handle Unauthorized Access (JWT Error)
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token. Please log in again!";
    }

    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Your token has expired! Please log in again.";
    }

    // Log the error (only log stack in development mode)
    const errorLog = {
        method: req.method,
        url: req.originalUrl,
        statusCode,
        message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    };

    if (statusCode >= 500) {
        logger.error(JSON.stringify(errorLog)); // Log critical errors
    } else {
        logger.warn(JSON.stringify(errorLog)); // Log warnings for 4xx errors
    }

    // Default Error Response
    res.status(statusCode).json({
        success: false,
        error: message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};

export default errorHandler;
