import PollsController from '../controllers/polls';
const pollscontroller = new PollsController();

export default app => {
	const { authenticate } = app.auth;

	app.route('/polls')
		.get((req, res) => {
			pollscontroller.getAll()
				.then(response => {
					res.status(response.statusCode);
					res.json(response.data);
				})
		})
		.post(authenticate(), (req, res) => {
			pollscontroller.create(req.body, req.user)
				.then(response => {
					res.status(response.statusCode)
					res.json(response.data)
				})
		})

	app.route('/polls/byuser/:userId')
		.get((req, res) => {
			pollscontroller.getByUserId(req.params.userId)
				.then(response => {
					res.status(response.statusCode);
					res.json(response.data)
				})
		})

	app.route('/polls/:id')
		.get((req, res) => {
			pollscontroller.getById(req.params.id)
				.then(response => {
					res.status(response.statusCode);
					res.json(response.data)
				})
		})
		.put((req, res) => {
			pollscontroller.vote(req.params.id, req.body)
				.then(response => {
					res.status(response.statusCode);
					res.json(response.data)
				})
		})
		.delete(authenticate(), (req, res) => {
			pollscontroller.delete(req.params.id)
				.then(response => {
					res.status(response.statusCode);
					res.json(response.data);
				})
		})
};
