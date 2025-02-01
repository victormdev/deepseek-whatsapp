const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../../logs/bot.log');

const logger = {
    log: (message) => {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${message}\n`;
        console.log(logMessage);
        fs.appendFileSync(logFilePath, logMessage);
    },
    error: (message) => {
        const timestamp = new Date().toISOString();
        const errorMessage = `[${timestamp}] ERROR: ${message}\n`;
        console.error(errorMessage);
        fs.appendFileSync(logFilePath, errorMessage);
    }
};

module.exports = logger;