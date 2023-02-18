/**
 * Based on Traversy Media's tutorial
 */
if(process.env.NODE_ENV !== 'production')
	require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morganMiddleware = require('./middleware/morgan.middleware');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

const logger = require('./utils/logger');

const app = express();

app.set('trust proxy', true);

app.use(cors({
	origin: process.env.FRONTEND_BASE_URL,
	credentials: true
}));

// Bodyparser middleware
app.use(express.json());

// Use message flash
app.use(flash());

// Add http request logger middleware
app.use(morganMiddleware);

// Database connection
mongoose
	.connect(process.env.DB_URI, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useCreateIndex: true,
	})
	.then(() => logger.info('MongoDB connected...'))
	.catch((err) => logger.error(err));

const db = mongoose.connection;
db.on('error', (err) => logger.error(err));
db.on('disconnect', (msg) => logger.error(msg));

// Configure session
app.use(
	session({
		secret: process.env.COOKIE_SECRET,
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({ mongooseConnection: db }),
	})
);

const User = require('./models/User');

// Configure authentication middleware
passport.use(
	new LocalStrategy(
		{ usernameField: 'email' },
		function (username, password, done) {
			const query = User.findOne({ email: username });
			query.exec((err, user) => {
				if (err) return done(err);

				if (!user)
					return done(null, false, { message: 'Incorrect email!' });

				user.validPassword(password, user.password).then((res) => {
					if (!res)
						return done(null, false, {
							message: 'Incorrect password!',
						});
					
					query.select('-password').exec((err, user) => {
						if (err) return done(err);
						return done(null, user);
					});
				});
			});
		}
	)
);

passport.use(
	'local-signup',
	new LocalStrategy(
		{ usernameField: 'email', passReqToCallback: true },
		function (req, username, password, done) {
			User.findOne({ email: username }, function (err, user) {
				if (err) return done(err);
				
				if (user) {
					return done(null, false, {
						message: 'This email is already taken...',
					});
				} else {
					const newUser = new User();
					const { username, email, password } = req.body;

					newUser.username = username;
					newUser.email = email;
					newUser.generateHash(password).then((hash) => {
						newUser.password = hash;
						newUser.save((err, user) => {
							if (err) throw err;
							User.findOne(user)
								.select('-password')
								.then((user) => {
									return done(null, user);
								});
						});
					});
				}
			});
		}
	)
);

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

app.use(passport.initialize());
app.use(passport.session());

// Use routers
app.use('/api/users', require('./routers/api/users'));
app.use('/api/posts', require('./routers/api/posts'));

const port = process.env.PORT || 5000;
app.listen(port, () => logger.info(`Server started on port ${port}`));

module.exports = { passport: passport };
