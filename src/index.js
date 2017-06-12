import express from 'express';
import bodyParser from 'body-parser';
import router from './routes';
import database from './database';
import auth from './services/auth';


function configureApp() {
	const app = express();
	app.use(bodyParser.json())
	//app.use(auth.initialize())
	app.auth = auth;
	router(app);
	return app;
}

export default () => database.connect().then(configureApp);
