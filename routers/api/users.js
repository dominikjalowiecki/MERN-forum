const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../../models/User');

const checkAuthentication = require('../../middleware/checkAuthentication');
const checkIfLoggedIn = require('../../middleware/checkIfLoggedIn');
const validateBody = require('../../middleware/validateBody');

const logger = require('../../utils/logger');

/**
 * @route	POST api/users/login
 * @desc	User login
 * @access	Public
 */
router.post(
	'/login',
	checkIfLoggedIn,
	validateBody({
		type: 'object',
		properties: {
			email: {
				type: 'string',
				format: 'email',
			},
			password: {
				type: 'string',
				minLength: 6,
			},
		},
		required: ['email', 'password'],
		additionalProperties: false,
	}),
	(req, res, next) => {
		passport.authenticate('local', (err, user, info) => {
			if (err)
				return res.status(400).json({ errors: err });
			
			if(!user)
				return res.status(400).json({ message: info.message });

			req.login(user, function (err) {
				if (err)
					return res.status(400).json({ errors: err });

				return res
					.status(200)
					.json({ message: `Logged in ${user.id}`, user: req.user });
			});
		})(req, res, next);
	}
);

/**
 * @route	Post api/users/logout
 * @desc	User logout
 * @access	Public
 */
router.post('/logout', (req, res) => {
	req.logout();
	return res.status(200).json({ message: 'You have been logged out...' });
});

/**
 * @router	POST api/users/register
 * @desc	User register
 * @access	Public
 */
router.post(
	'/register',
	validateBody({
		type: 'object',
		properties: {
			username: {
				type: 'string',
				minLength: 3,
			},
			email: {
				type: 'string',
				format: 'email',
			},
			password: {
				type: 'string',
				minLength: 8,
			},
			confirmPassword: {
				type: 'string',
				const: {
					$data: '1/password',
				},
			},
		},
		required: ['username', 'email', 'password', 'confirmPassword'],
		additionalProperties: false,
	}),
	(req, res, next) => {
		passport.authenticate('local-signup', (err, user, info) => {
			if (err)
				return res.status(400).json({ errors: err });

			if (!user)
				return res.status(400).json({ message: info.message });

			req.login(user, function (err) {
				if (err)
					return res.status(400).json({ errors: err });
				
				return res
					.status(200)
					.json({ message: `Logged in ${user.id}`, user: req.user });
			});
		})(req, res, next);
	}
);

/**
 * @router	GET api/users/me
 * @desc	Get details of logged in user
 * @access	Private
 */
router.get('/me', checkAuthentication, (req, res) => {
	const userId = req.user.id;

	User.findById(userId)
		.select('-password')
		.then((user) => {
			res.json(user);
		})
		.catch((err) => {
			logger.error(err);
			
			return res
				.status(500)
				.json({ message: 'An error has occured. Try again later...'});
		});
});

module.exports = router;
