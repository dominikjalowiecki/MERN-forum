const express = require('express');
const router = express.Router();

const Post = require('../../models/Post');
const ObjectId = require('mongoose').Types.ObjectId;

const checkAuthentication = require('../../middleware/checkAuthentication');
const validateBody = require('../../middleware/validateBody');

const logger = require('../../utils/logger');

/**
 * @route	POST api/posts
 * @desc	Create new post
 * @access	Private
 */
router.post(
	'/',
	checkAuthentication,
	validateBody({
		type: 'object',
		properties: {
			title: {
				type: 'string',
				maxLength: 30,
			},
			content: {
				type: 'string',
				maxLength: 300,
			},
		},
		required: ['title', 'content'],
		additionalProperties: false,
	}),
	(req, res) => {
		const newPost = new Post({
			title: req.body.title,
			content: req.body.content,
			postedBy: req.user.id,
		});
		
		newPost
			.save()
			.then((item) => res.status(201).json(item))
			.catch((err) => {
				logger.error(err.message);
				
				return res
					.status(500)
					.json({ message: 'An error has occured. Try again later...'});
			});
	}
);

/**
 * @route	GET api/posts
 * @desc	Get all posts
 * @access	Public
 */
router.get('/', (req, res) => {
	Post.find({})
		.populate('postedBy', ['_id', 'username'])
		.select('-comments')
		.sort({ postedAt: -1 })
		.then((items) => res.json(items))
		.catch((err) => {
			logger.error(err.message);

			return res
				.status(500)
				.json({ message: 'An error has occured. Try again later...'});
		});
});

/**
 * @route	GET api/posts/:id
 * @desc	Get post
 * @access	Public
 */
router.get('/:id', async (req, res) => {
	if(!ObjectId.isValid(req.params.id)) return res.status(400).json( { errors: 'Invalid id'} );

	Post.findById(req.params.id)
		.populate('postedBy', ['_id', 'username'])
		.populate('comments.postedBy', ['_id', 'username'])
		.sort({ 'comments.postedAt': -1 })
		.then((post) => {
			if(post === null) return res.status(404).json( { errors: 'Not found' });
			res.json(post);
		})
		.catch((err) => {
			logger.error(err.message);

			return res
				.status(500)
				.json({ message: 'An error has occured. Try again later...'});
		});
});

/**
 * @route	POST api/posts/:id/comments
 * @desc	Create comment
 * @access	Private
 */
router.post(
	'/:id/comments',
	checkAuthentication,
	validateBody({
		type: 'object',
		properties: {
			content: {
				type: 'string',
				maxLength: 150,
			},
		},
		required: ['content'],
		additionalProperties: false,
	}),
	async (req, res) => {
		if(!ObjectId.isValid(req.params.id)) return res.status(400).json( { errors: 'Invalid id'} );

		const comment = {
			content: req.body.content,
			postedBy: req.user.id,
		};

		try {
			const post = await Post.findByIdAndUpdate(
				req.params.id,
				{ $push: { comments: comment } },
				{ new: true }
			);

			if(post === null) return res.status(404).json( { errors: 'Not found' });

			const comments = await Post.findById(post._id)
				.populate('comments.postedBy', ['_id', 'username'])
				.select('comments -_id')
				.sort({ 'comments.postedAt': 1 });
			
			res.json(comments);
		} catch (err) {
			logger.error(err.message);

			return res
				.status(500)
				.json({ message: 'An error has occured. Try again later...'});
		}
	}
);

module.exports = router;
