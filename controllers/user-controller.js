const { User } = require('../models');

const userController = {
	// get all users
	getAllUsers(req, res) {
		User.find({})
			.populate({
				path: 'thoughts',
				select: '-__v'
			})
			.select('-__v')
			.sort({ _id: -1 })
			.then(dbUserData => res.json(dbUserData))
			.catch(err => {
				console.log(err);
				res.status(500).json(err);
			});
	},
	// get one User by Id
	getUserById({ params }, res) {
		User.findOne({ _id: params.id })
			.populate({
				path: 'thoughts',
				select: '-__v'
			})
			.select('-__v')
			.then(dbUserData => {
				// If no user found, send 404
				if (!dbUserData) {
					res.status(404).json({ message: 'No user found with this Id' });
					return;
				}
				res.json(dbUserData)
			})
			.catch(err => {
				console.log(err);
				res.status(500).json(err);
			})
	},
	// create User
	createUser({ body }, res) {
		console.log(body);
		User.create(body)
			.then(dbUserData => res.json(dbUserData))
			.catch(err => res.status(400).json(err));
	},
	// update User by Id
	updateUser({ params, body }, res) {
		User.findOneAndUpdate({ _id: params.id }, body, { new: true })
			.then(dbUserData => {
				if (!dbUserData) {
					res.status(404).json({ message: "No user found with this Id" });
					return;
				}
				res.json(dbUserData);
			})
			.catch(err => res.status(400).json(err));
	},
	// delete User
	deleteUser({ params }, res) {
		User.findOneAndDelete({ _id: params.id })
			.then(dbUserData => {
				if (!dbUserData) {
					res.status(404).json({ message: 'No user found with this Id' })
					return;
				}
				res.json(dbUserData);
			})
			.catch(err => res.status(400).json(err));
	},
	// add Friend
	addFriend({ params }, res) {
		console.log(params, params.friendId)
		User.findOneAndUpdate(
			{ _id: params.userId },
			{ $addToSet: { friends: params.friendId } },
			{ new: true }
		)
			.then((dbUserData) => res.json(dbUserData))
			.catch((err) => res.status(400).json(err))
	},
	// remove Friend
	removeFriend({ params}, res) {
		User.findByIdAndUpdate(
			{ _id: params.id },
			{ $pull: { friends: params.friendId } },
			{ new: true }
		)
		.then((dbUserData) => {
			if (!dbUserData) {
				res.status(404).json({ message: 'No user found with this Id' });
				return;
			}
			res.json(dbUserData);
		})
		.catch((err) => res.status(400).json(err)); 
	}
};

module.exports = userController;