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
		return this.Polls.find().populate('_creator')
			.then(result => defaultResponse(result))
			.catch(err => errorResponse(err))
	}

	getById(id) {
		return this.Polls.findById(id)
			.then(result => defaultResponse(result))
			.catch(err => errorResponse(err))
	}

	getByUserId(id) {
		return this.Polls.find({_creator: id})
			.then(result => {
				return defaultResponse(result)
			})
			.catch(err => errorResponse(err))
	}

	create(data, user) {
		data._creator= user._id;
		return this.Polls.create(data)
			.then(result => {
				if (result) {
					return defaultResponse(result, 201)
				} else {
					return errorResponse('', 422)
				}
			})
			.catch(err => errorResponse(err))
	}

	vote(pollId, voteObj) {
		if(voteObj.name) {
			this.Polls.find({_id: pollId})
				.then(poll => {
					
				})
				.catch(err => errorResponse(err))

		} else {
			return Promise.resolve(errorResponse("invalid format, expected { name: 'name'}", 422));
		}
	}

}

export default PollsController;
