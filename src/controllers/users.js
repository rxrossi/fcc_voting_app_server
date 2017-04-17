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
			.catch(err => errorResponse(err.message))
	}
}

export default UsersController;
