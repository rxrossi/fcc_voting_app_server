import jwt from 'jwt-simple';
import Users from '../../src/models/Users';
import config from '../../config';

export default app => {
	app.route('/auth')
		.post((req, res) => {
			const { email, password } = req.body;
			Users.findOne({email}).select('+password')
				.then(user => {
					user.checkPassword(password, function (err, isMatch) {
						if (err) { res.sendStatus(500) }

						if (isMatch) {
							const timestamp = new Date().getTime();
							const token = jwt.encode({sub: user._id, iat: timestamp}, config.jwtSecret)
							res.json({ token });
						} else {
							res.sendStatus(401)
						}

					})
				})
				.catch(err => res.sendStatus(401))
		})
}

