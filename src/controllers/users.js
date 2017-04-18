import Users from '../models/Users';

const defaultResponse = (data, statusCode = 200) => ({
	data,
	statusCode
});

const errorResponse = (message, statusCode = 400) =>
	defaultResponse({error: message}, statusCode);

class UsersController {
	constructor(Model = Users) {
		this.Users = Model;
	}

	getAll() {
		return this.Users.find()
			.then(result => defaultResponse(result))
			.catch(err => errorResponse(err))
	}

	getById(id) {
		return this.Users.findById(id)
			.then(result => defaultResponse(result))
			.catch(err => errorResponse(err))
	}

	create(data) {
		return this.Users.create(data)
			.then(result => {
				if (result) {
					return defaultResponse(result, 201)
				} else {
					return errorResponse('', 422);
				}
			})
			.catch(err => errorResponse(err.message, 422))
	}
}

export default UsersController;
