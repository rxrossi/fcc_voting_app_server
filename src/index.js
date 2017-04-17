import express from 'express';
import router from './routes';
import database from './database';

function configureApp() {
	const app = express();
	router(app);
	return app;
}

export default () => database.connect().then(configureApp);
