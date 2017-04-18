import Users from '../../../src/models/Users';
describe('Users routes', () => {
	const defaultUser = {
		name: 'John',
		email: 'john@mail.com',
		password: '12345'
	};

	let request;
	before(() => {
		setupApp()
			.then(app => request = supertest(app))
	});

	let defaultUserId;
	beforeEach(done => {
		Users
			.deleteMany({})
			.then(() => Users.create(defaultUser))
			.then(user => {
				defaultUserId = user._id;
				done();
			})
	});

	describe('Route GET /users', () => {
		it('returns a 200 code', (done)=> {
			request
				.get('/users')
				.end((err, res) => {
					expect(res.status).to.be.eql(200);
					done();
				})
		});

		it('shows a list of users hiding the password', (done) => {
			request
				.get('/users')
				.end((err, res) => {
					expect(res.body[0].name).to.be.eql(defaultUser.name);
					expect(res.body[0].password).to.not.exist;
					done();
				})
		})
	});

	describe('Route GET /users/:id', () => {
		it('shows a single user', (done)=> {
			request
				.get(`/users/${defaultUserId}`)
				.end((err, res) => {
					expect(res.body.name).to.be.eql(defaultUser.name);
					expect(res.body.email).to.be.eql(defaultUser.email);
					done();
				})
		});
	});

	describe('Route POST /users', () => {
		it('returns a user on succesfull user creation', (done)=> {
			const newUser = {
				name: 'Bro',
				email: 'bro@mail.com',
				password: '56789'
			};

			request
				.post('/users')
				.send(newUser)
				.end((err, res) => {
					expect(res.status).to.be.eql(201);
					expect(res.body.name).to.be.eql(newUser.name);
					expect(res.body.email).to.be.eql(newUser.email);
					done(err);
				})
		});
	});
});
