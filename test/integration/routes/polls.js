import jwt from 'jwt-simple';
import config from '../../../config';
import Users from '../../../src/models/Users';
import Polls from '../../../src/models/Polls';

describe('Polls Route', () => {
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
	let defaultPollId;
	const defaultPoll = {
		name: 'Best hero',
		opts: [
			{name: 'Batman'},
			{name: 'Superman'}
		],
		_creator: null //will be defined on the before block bellow
	};

	before(done => {
		Users
			.deleteMany({})
			.then(() => Users.create(defaultUser))
			.then(user => {
				defaultUserId = user._id;
				const timestamp = new Date().getTime();
				token = jwt.encode({sub: user._id, iat: timestamp}, config.jwtSecret)
				//done();
				return user;
			})
			.then(user => {
				defaultPoll._creator= user._id;
				Polls
					.deleteMany({})
					.then(()=> Polls.create(defaultPoll))
					.then(poll => {
						defaultPollId = poll._id;
						done();
					})
			})
	});

	describe('GET /polls', () => {
		it('returns a list of polls', (done) => {
			request
				.get('/polls')
				.end((req, res) => {
					const firstPoll = res.body[0];
					expect(firstPoll.name).to.be.eql(defaultPoll.name);
					expect(firstPoll.opts.length).to.be.eql(2);
					expect(firstPoll.opts[0].name).to.be.eql(defaultPoll.opts[0].name);
					expect(firstPoll._creator.name).to.be.eql(defaultUser.name);
					done();
				})
		})
	});

	describe('GET /polls/byuser/:userId', () => {
		describe('returns all the polls created by a user', () => {
			it('returns the defaultPoll when when called with the defaultUserId', (done)=> {
			request
				.get('/polls/byuser/'+defaultUserId)
				.end((req, res) => {
					expect(res.status).to.be.eql(200);
					const firstPoll = res.body[0];
					expect(firstPoll.name).to.be.eql(defaultPoll.name);
					done();
				});
			});
		});
	});


	describe('GET /polls/:id', () => {
		it(`returns the '${defaultPoll.name}' poll record`, (done)=> {
			request
				.get('/polls/'+defaultPollId)
				.end((req, res) => {
					const receivedPoll = res.body;
					expect(receivedPoll.name).to.be.eql(defaultPoll.name);
					done();
				})
		});
	});

	describe('POST /polls', () => {
		it('returns 401 on authenticated user post', (done)=> {
			request
				.post('/polls')
				.end((req, res) => {
					expect(res.status).to.be.eql(401);
					done();
				})
		});

		it('receive the created poll', (done)=> {
			const newPoll = {
				name: 'Best movie',
				opts: [
					{name: 'Green mile'},
					{name: 'Fast & Furious'},
					{name: 'Star Trek 2009'}
				],
				_creator: defaultUserId
			};
			request
				.post('/polls')
				.set('Authorization', `JWT ${token}`)
				.send(newPoll)
				.end((req, res) => {
					expect(res.status).to.be.eql(201);
					const receivedPoll = res.body;
					expect(receivedPoll.name).to.be.eql(newPoll.name);
					expect(receivedPoll.opts.length).to.be.eql(newPoll.opts.length);
					expect(receivedPoll.opts[2].name).to.be.eql(newPoll.opts[2].name);
					expect(receivedPoll._creator).to.be.eql(defaultUserId+'');
					done();
				})
		});
	});

	describe.only('PUT /polls/:id', () => {
		describe('Sending anything different than {name: "name"} return an 422 error', () => {
			it('sending more than one options returns a 422', (done)=> {
				request
					.put('/polls/'+defaultPollId)
					.send({name: 'Batman', name: 'Superman'})
					.end((req, res) => {
						expect(res.status).to.be.eql(422);
					})
				done();
			});
		});

		describe('Sending and existing option return all the options with the value of the sent one update to +1', () => {
			const votedOpt = { name: defaultPoll.opts[defaultPoll.opts.length -1].name };
			const expectedAnswer = defaultPoll.opts.slice(0, defaultPoll.opts.length-1)
																						 .concat({name: votedOpt.name, votes: 1});
			//console.log({expectedAnswer})
			before(done => {
				request
					.put('/polls/'+defaultPollId)
					.send(votedOpt)
					.end((req, res) => {

					})
			});
		});

		xdescribe('puts a new option for defaultPoll, receives the opts with the new one having zero votes', ()=> {

			const newOpt = {name: 'SpongeBob'};
			const expectedAnswer = defaultPoll.opts.concat({ name: newOpt.name, votes: 0});
			let receivedOpts;

			before((done) => {
				request
					.put('/polls/'+defaultPollId)
					.send(newOpt)
					.end((req, res) => {
						receivedOpts = res.body[0].opts;
						done();
					});
			})

			it('expect length of expectedAnswer and recevedAnswer to be equal', ()=> {
				expect(receivedOpts.length).to.be.eql(expectedAnswer.length)
			});

			it('expect that every opt in expectedAnswer is found on receivedAnswer', ()=> {
				expectedAnswer.forEach((opt, key) => {
					expect(opt.name).to.be.eql(receivedOpts[key].name);
					console.log(receivedOpts[key].name)
				})
			});

		});
	});

	xdescribe('DELETE /pools/:id', () => {
		describe('an authenticated user can delete his own pools', () => {
			it('returns 204 when deleting one of his polls', ()=> {

			});
			it('returns 401 when deleting a different poll', ()=> {

			});
		});
	});
});
