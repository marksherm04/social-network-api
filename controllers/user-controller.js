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
		.then(dbUserData => res.json(dbPizzaData))
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
	
}