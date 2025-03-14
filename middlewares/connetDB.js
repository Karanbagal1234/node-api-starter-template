import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connect = async () => {
    try {
        const conn = await mongoose.connect("mongodb://127.0.0.1:27017/yourDatabaseName", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        logger.info(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        logger.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connect;
