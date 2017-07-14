import express from 'express';
import bodyParser from 'body-parser';
import router from './routes';
import database from './database';
import auth from './services/auth';


function configureApp() {
	const app = express();
	app.use(bodyParser.json())
	//app.use(auth.initialize())
	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});
	app.auth = auth;
	router(app);
	return app;
}

export default () => database.connect().then(configureApp);
