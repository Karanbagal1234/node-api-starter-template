import express from "express";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import xssClean from "xss-clean";
import errorHandler from "./middlewares/errorHandler.js";
import expressListEndpoints from "express-list-endpoints";
import AppError from "./utils/AppError.js";
import logger from "./utils/logger.js";
import connect from "./middlewares/connetDB.js";

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(mongoSanitize());
app.use(xssClean());
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
connect()

app.get('/', (req, res) => {
    res.send("dsflkgjh");
})




app.use((req, res, next) => {
    const availableRoutes = expressListEndpoints(app);
    const requestedPath = req.path;
    const existingRoute = availableRoutes.find(route => route.path === requestedPath);

    if (existingRoute) {
        const errorMessage = `Method Not Allowed. This route exists with method(s): ${existingRoute.methods.join(", ")}`;
        logger.warn(`405 - ${errorMessage} - ${req.method} ${req.originalUrl}`);
        return next(new AppError(errorMessage, 405));
    } else {
        const errorMessage = `Route not found: ${requestedPath}`;
        logger.error(`404 - ${errorMessage} - ${req.method} ${req.originalUrl}`);
        return next(new AppError(errorMessage, 404));
    }
});

  

// Global Error Handler
app.use(errorHandler);



export default app;
