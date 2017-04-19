import jwt from 'jwt-simple';
import config from '../../../config';
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
	let token;
	before(done => {
		Users
			.deleteMany({})
			.then(() => Users.create(defaultUser))
			.then(user => {
				defaultUserId = user._id;
				const timestamp = new Date().getTime();
				token = jwt.encode({sub: user._id, iat: timestamp}, config.jwtSecret)
				done();
			})
	});

	describe('GET /users', () => {
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

	describe('GET /users/:id', () => {
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

	describe('POST /users', () => {
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

	describe('PUT /users', () => {
		it('returns 401 on unathenticated requests', (done)=> {
			request
				.put('/users/'+defaultUserId)
				.end((err, res) => {
					expect(res.status).to.be.eql(401);
					done();
				})
		});

		it('returns 200 when authenticated user sends a put to his id', (done)=> {
			request
				.put('/users/'+defaultUserId)
				.set('Authorization', `JWT ${token}`)
				.end((err, res) => {
					expect(res.status).to.be.eql(200);
					done();
				})
		});

		it('returns 403 when editing a different user', (done) => {
			request
				.put('/users/aDifferentId')
				.set('Authorization', `JWT ${token}`)
				.end((err, res) => {
					expect(res.status).to.be.eql(403);
					done();
				})
		})

		it('returns the edited user data when user edits himself', (done)=> {
			const updatedUser = {
				email: 'newEmail@mail.com',
				name: 'new name'
			};

			request
				.put('/users/'+defaultUserId)
				.set('Authorization', `JWT ${token}`)
				.send(updatedUser)
				.end((req, res) => {
					expect(res.body.name).to.be.eql(updatedUser.name);
					expect(res.body.email).to.be.eql(updatedUser.email);
					expect(res.body.password).to.not.exist;
					done();
				})
		});

		describe('Password update', () => {

			const newPassword = 'newpass123';

			let oldPassOnDb;
			let passwordOnDb;
			//let user;

			before( done => {
				Users.findById(defaultUserId).select('+password')
					.then(user => {
						return oldPassOnDb = user.password;
					})
					.then(() => {
						 request
							.put('/users/'+defaultUserId)
							.set('Authorization', `JWT ${token}`)
							.send({password: newPassword, name: 'John NP'})
							.end((req, res) => {
								Users.findById(defaultUserId).select('+password')
									.then(user => {
										return passwordOnDb = user.password;
									})
								done();
							});
					})
			});

			it('expects that new password is not empty after put request', (done)=> {
					expect(passwordOnDb).to.exist;
					done();
			});

			it('confirms that new password is not stored as sent', ()=> {
				expect(passwordOnDb).to.not.eql(newPassword);
			});

			it('expects that the new password pass the bcrypt compare', (done)=> {
				Users.findById(defaultUserId).select('+password')
					.then(user => {
						user.checkPassword(newPassword, function (err, isMatch) {
						expect(isMatch).to.be.true;
						done();
					})
				});


			});

		});

	});
});
