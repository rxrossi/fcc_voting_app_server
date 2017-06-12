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
			value: {type: Number, required: true,  default: 0}
		},
	],
	_creator: { type: String, required: true, ref: 'User'}
});

export default mongoose.model('Poll', pollsSchema);
