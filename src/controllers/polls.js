import Polls from '../models/Polls';

const defaultResponse = (data, statusCode = 200) => ({
	data,
	statusCode
});

const errorResponse = (message, statusCode = 400) =>
	defaultResponse({error: message}, statusCode);

class PollsController {
	constructor(Model = Polls) {
		this.Polls = Model;
	}

	getAll() {
		//return Promise.resolve(defaultResponse([{name: 'Best hero'}]))
		return this.Polls.find()
			.then(result => defaultResponse(result))
			.catch(err => errorResponse(err))
	}

}

export default PollsController;
