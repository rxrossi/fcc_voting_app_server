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
	]
});

export default mongoose.model('Polls', pollsSchema);
