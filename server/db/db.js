const dotenv = require('dotenv');
const MongoDatabaseManager = require('./mongodb');
const { PostgresDatabaseManager } = require('./postgresql')
dotenv.config();

const db = new DatabaseManager();

module.exports = db 