import UsersController from '../controllers/users';
const usersController = new UsersController();

export default app => {
	app.route('/users')
		.get((req, res) => {
			usersController.getAll()
				.then(response => {
					res.status(response.statusCode);
					res.json(response.data);
				})
				.catch(err => res.send(err.data));
		})
		.post((req, res) => {
			usersController.create(req.body)
				.then(response => {
					res.status(response.statusCode);
					res.json(response.data);
				})
				.catch(err => res.sendStatus(422))
		})

	app.route('/users/:id')
		.get((req, res) => {
			usersController.getById(req.params.id)
				.then(response => {
					res.status(response.statusCode);
					res.json(response.data);
				})
				.catch(err => res.send(err.data));
		})
};
