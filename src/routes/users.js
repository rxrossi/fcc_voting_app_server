import UsersController from '../controllers/users';
const usersController = new UsersController();

export default app => {
	const { authenticate } = app.auth;

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
		.put(authenticate(), (req, res) => {

			const idToEdit = req.params.id+'';
			const currUserId = req.user._id+'';

			if (idToEdit !== currUserId) { return res.sendStatus(403); }

			usersController.update(idToEdit, req.body)
				.then(response => {
					res.status(response.statusCode)
					res.json(response.data)
				})
				.catch(err => res.send(err))
		})
};
