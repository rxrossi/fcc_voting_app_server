import express from 'express';
import router from './routes';
import bodyParser from 'body-parser';
import database from './database';

function configureApp() {
	const app = express();
	app.use(bodyParser.json())
	router(app);
	return app;
}

export default () => database.connect().then(configureApp);
