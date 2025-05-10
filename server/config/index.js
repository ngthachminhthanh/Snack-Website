const dotenv = require('dotenv');

dotenv.config();

const config = {
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_URI_LOCAL: process.env.MONGODB_URI_LOCAL,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID,
    GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    dialogFlowSessionID: process.env.dialogFlowSessionID,
    dialogFlowSessionLanguageCode: process.env.dialogFlowSessionLanguageCode,
    googleClientEmail: process.env.googleClientEmail,
    googlePrivateKey: process.env.googlePrivateKey,
    PORT: process.env.PORT || 5000,
};

module.exports = config;