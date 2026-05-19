import winston from "winston";
import dotenv from "dotenv";

dotenv.config();

// Define log levels and colors
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Log everything in development, but only info and above in production
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'info';
};

// Choose formatting: Clean text for local dev, raw JSON for production cloud logging
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.json()
);

// Link winston to the console
const transports = [
  new winston.transports.Console()
];

const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

export default logger;