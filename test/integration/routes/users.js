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
	beforeEach(done => {
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

		it('returns 200 code when a authenticated user sends a put request', (done)=> {
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

		it('returns the edited user when user edits himself', (done)=> {
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
					done();
				})
		});

		describe('Password update', () => {

			const newPassword = 'newpass123';
			let passwordOnDb;
			let user;

			beforeEach( done => {

				request
					.put('/users/'+defaultUserId)
					.set('Authorization', `JWT ${token}`)
					.send({password: newPassword})
					.end((req, res) => {
						Users.findById(defaultUserId).select('+password')
							.then(result => {
								user = result;
								passwordOnDb = result.password
								done();
							});
					});

			});

			it('expects that retrivied password is not empty', (done)=> {
					expect(passwordOnDb).to.exist;
					done();
			});

			it('confirms that new password is not stored as sent', ()=> {
				expect(passwordOnDb).to.not.eql(newPassword);
			});

			xit('expects that the new password pass a bcrypt compare', (done)=> {

				console.log(passwordOnDb, newPassword);
				user.checkPassword(newPassword, function (err, isMatch) {
					//console.log(typeof isMatch, isMatch)
					expect(isMatch).to.be.true;
					done();
				});


			});

		});

	});
});
