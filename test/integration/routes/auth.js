import Users from '../../../src/models/Users';
import jwt from 'jwt-simple';
import config from '../../../config';

describe('Auth routes', () => {
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

	describe('POST /auth', () => {
		it('returns a jwt that when decode returns defaultUserId', (done)=> {
			request
				.post('/auth')
				.send({email: defaultUser.email, password: defaultUser.password})
				.end((err, res) => {
					const receivedToken = res.body.token;
					expect(res.status).to.be.eql(200);
					expect(jwt.decode(receivedToken, config.jwtSecret).sub).to.be.eql(defaultUserId+'');
					done();
				})
		});

		it('sends a 401 error on with wrong password', (done)=> {
				request
					.post('/auth')
					.send({email: defaultUser.email, password: 'incorrect'})
					.end((err, res) => {
						const receivedToken = res.body.token;
						expect(res.status).to.be.eql(401);
						done();
					})
			});
		});

});

