import PollsController from '../controllers/polls';
const pollscontroller = new PollsController();

export default app => {
	app.route('/polls')
		.get((req, res) => {
			pollscontroller.getAll()
				.then(response => {
					res.status(response.statusCode);
					res.json(response.data);
				})
		})
};
