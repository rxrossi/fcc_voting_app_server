import UsersController from '../controllers/users';
const usersController = new UsersController();

export default app => {
	app.get('/users', (req, res) => {
		usersController.getAll()
			.then(response => {
				res.status(response.statusCode)
				res.json(response.data)
			})
			.catch(err => res.send(err.data))
	})
};
