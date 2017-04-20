import mongoose from 'mongoose';
const { Schema } = mongoose;

const pollsSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	opts: [
		{
			name: { type: String, required: true },
		}
	],
	_creator: { type: String, required: true, ref: 'User'}
});

export default mongoose.model('Poll', pollsSchema);
