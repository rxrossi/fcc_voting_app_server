import jwt from 'jwt-simple';
import config from '../../../config';
import Users from '../../../src/models/Users';
import Polls from '../../../src/models/Polls';

describe.only('Polls Route', () => {
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

	let defaultPollId;
	beforeEach(done=> {
		Polls
			.deleteMany({})
			.then(()=> Polls.create(defaultPoll))
			.then(poll => {
				defaultPollId = poll._id;
				done();
			})
	});

	const defaultPoll = {
		name: 'Best hero',
		opts: [
			{name: 'Batman'},
			{name: 'Superman'}
		]
	};
	describe('GET /polls', () => {
		it('returns a list of polls', (done) => {
			request
				.get('/polls')
				.end((req, res) => {
					const firstPoll = res.body[0];
					expect(firstPoll.name).to.be.eql(defaultPoll.name);
					expect(firstPoll.opts.length).to.be.eql(2);
					done();
				})
		})
	});
});
