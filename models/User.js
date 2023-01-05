const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

UserSchema.methods.generateHash = async (password) => {
	const hash = await new Promise((resolve, reject) => {
		bcrypt.genSalt(10, function (err, salt) {
			bcrypt.hash(password, salt, function (err, hash) {
				if (err) reject(err);
				resolve(hash);
			});
		});
	});
	return hash;
};

UserSchema.methods.validPassword = async (password, hash) => {
	const res = await new Promise((resolve, reject) => {
		bcrypt.compare(password, hash, function (err, res) {
			if (err) reject(err);
			resolve(res);
		});
	});
	return res;
};

module.exports = User = mongoose.model('user', UserSchema);
