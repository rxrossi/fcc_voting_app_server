import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true
	},
	password: {
		type: String,
		required: true,
		select: false
	}
});

userSchema.pre('save', function(next) {
	const user = this;
	const saltrounds = 10;

	bcrypt.hash(user.password, saltrounds, function(err, hashedPw) {
		user.set('password', hashedPw)
		next();
	});
})

userSchema.pre('update', function(next) {
	const saltrounds = 10;

	bcrypt.hash(user.password, saltrounds, function(err, hashedPw) {
		this.update({}, {$set: {password: hashedPw}})
		next();
	});
})


userSchema.methods.checkPassword = function (plainPassword, callback) {
	bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
		if (err) { return callback(err);}
		callback(null, isMatch);
	})
};

export default mongoose.model('User', userSchema);
