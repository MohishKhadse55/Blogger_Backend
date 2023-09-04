require('dotenv').config();

const app = require('./app');
const config = require('./src/config/config');
const logger = require('./src/config/logger');
const connectDB = require('./src/db/connect');

const startServer = async () => {
	try {
		await connectDB(config.mongoUrl);
		app.listen(config.port);
        logger.info(`Database connected and app listening on port ${config.port}`)
	} catch (error) {
		logger.error(error);
	}
};

startServer();
