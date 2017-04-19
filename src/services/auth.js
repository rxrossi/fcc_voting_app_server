import passport from 'passport';
import { Strategy, ExtractJwt }from 'passport-jwt';
import Users from '../../src/models/Users';
import config from '../../config';

const jwtOpts = {
	jwtFromRequest: ExtractJwt.fromAuthHeader(),
	secretOrKey: config.jwtSecret
};

const jwtLogin = new Strategy (jwtOpts, function(payload, done) {
	Users.findById(payload.sub)
	.then(user => {
		if (user) {
			done(null, user);
		} else {
			done(null, false);
		}
	})
	.catch(err => done(err, false))
});

passport.use(jwtLogin);

export default {
	initialize: () => passport.initialize(),
	authenticate: () => passport.authenticate('jwt', {session: false})
};
