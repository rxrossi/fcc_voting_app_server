import usersRouter from './users';
import authRouter from './auth';

export default app => {
	usersRouter(app);
	authRouter(app);
}
