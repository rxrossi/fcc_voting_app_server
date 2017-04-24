import Polls from '../models/Polls';

const defaultResponse = (data, statusCode = 200) => ({
	data,
	statusCode
});

const errorResponse = (message, statusCode = 400) =>
	defaultResponse({ error: message }, statusCode);

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

	vote(pollId, votedOptArg) {
		if(votedOptArg.name && Object.keys(votedOptArg).length === 1) {
			return this.Polls.findById(pollId)
				.then(poll => {
					let votedOpt = poll.opts.find(opt => opt.name === votedOptArg.name);
					if (votedOpt) {
						const votedOptIndex = poll.opts.indexOf(votedOpt);

						votedOpt.value += 1;
						poll.opts.fill(votedOpt, votedOptIndex, votedOptIndex+1);

						return poll.save();
					} else {
						poll.opts.push(votedOptArg);
						return poll.save();
					}
				})
				.then(savedPoll => {
					return defaultResponse(savedPoll.opts)
				})
				.catch(err => errorResponse(err))

		} else {
			return Promise.resolve(
				errorResponse("invalid format, expected an obj with a key name { name: 'name'}", 422)
			);

		}
	}

	delete(pollId) {
		return this.Polls.deleteOne({_id: pollId})
			.then(() => defaultResponse('', 204))
			.catch((err) => errorResponse(err))
	}
}

export default PollsController;
