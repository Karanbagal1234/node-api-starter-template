class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Distinguish known errors from unknown errors
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
