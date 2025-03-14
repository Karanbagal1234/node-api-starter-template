import winston from "winston";
import path from "path";
import fs from "fs";

// Ensure logs directory exists
const logDir = "logs";
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Define log file paths
const combinedLogPath = path.join(logDir, "combined.log");
const errorLogPath = path.join(logDir, "error.log");

// Add separator indicating app restart
const restartMessage = "\n---- APP RESTARTED ----\n";
fs.appendFileSync(combinedLogPath, restartMessage, "utf8");
fs.appendFileSync(errorLogPath, restartMessage, "utf8");

// Create Winston logger instance
const logger = winston.createLogger({
    level: "info",  // Default logging level
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        // Log errors to error.log
        new winston.transports.File({
            filename: errorLogPath,
            level: "error",
        }),
        // Log everything to combined.log
        new winston.transports.File({
            filename: combinedLogPath,
        }),
    ],
});

// If in development, log to console as well
if (process.env.NODE_ENV === "development") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        })
    );
}

export default logger;
