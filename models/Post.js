const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
	content: {
		type: String,
		required: true,
	},
	postedBy: {
		type: mongoose.Types.ObjectId,
		ref: 'user',
	},
	postedAt: {
		type: Date,
		default: Date.now,
	},
});

const PostSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	upvotes: {
		type: Number,
		default: 0,
	},
	comments: [CommentSchema],
	postedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
	},
	postedAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = Post = mongoose.model('post', PostSchema);
