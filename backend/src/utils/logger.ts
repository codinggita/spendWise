import { createLogger, format, transports, Logger } from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.resolve(__dirname, '..', 'logs');
const consoleFormat = format.combine(
  format.colorize(),
  format.printf(({ level, message, timestamp }) => `${timestamp ?? ''} [${level}] ${message}`)
);

const logger: Logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  // Production uses JSON in file transports; development uses readable console
  format: format.json(),
  transports: [
    // Error and combined logs
    new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new transports.File({ filename: path.join(logDir, 'combined.log') }),
    // Console output for development
    new transports.Console({ format: consoleFormat })
  ],
  exceptionHandlers: [
    new transports.File({ filename: path.join(logDir, 'exceptions.log') })
  ],
  exitOnError: false
});

export default logger;
