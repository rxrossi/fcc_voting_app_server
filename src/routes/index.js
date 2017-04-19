import usersRouter from './users';
import authRouter from './auth';
import pollsRouter from './polls';

export default app => {
	usersRouter(app);
	authRouter(app);
	pollsRouter(app);
}
