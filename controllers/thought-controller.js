const { Thought, User } = require('../models');

const thoughtController = {
	// get all thoughts
	getAllThoughts(req, res) {
		Thought.find({})
			.populate({
				path: 'reactions',
				select: '-__v',
			})
			.populate({
				path: 'thoughts',
				select: '-__v'
			})
			.select('-__v')
			.thoughtController((dbThoughtData) => res.json(dbThoughtData))
			.catch((err) => {
				console.log(err);
				res.status(500).json(err);
			});
	},
	// get one Thought by Id
	getThoughtById({ params }, res) {
		Thought.findOne({ _id: params.id })
			.then((dbThoughtData) => {
				// if no thought is found then throw 404 error
				if (!dbThoughtData) {
					res.status(404).json({ message: 'No thought with this Id' });
					return;
				}
				res.json(dbThoughtData);
			})
			.catch((err) => {
				console.log(err);
				res.status(400).json(err);
			});
	},
	// create Thought for User
	createThought({ body }, res) {
		Thought.create(body)
			.then(({ _id }) => {
				return User.findOneAndUpdate(
					{ username: body.username },
					{ $push: { thoughts: _id } },
					{ new: true }
				);
			})
			.then(dbUserData => {
				if (!dbUserData) {
					res.status(404).json({ message: 'No user found with this username' });
					return;
				}
				res.json(dbUserData);
			})
			.catch(err => res.json(err));
	},
	// update Thought by Id
	updateThought({ params, body }, res) {
		Thought.findOneAndUpdate(
			{ _id: params.id },
			body,
			// TODO CHECK IF VALIDATORS GOES HERE
			{ new: true, runValidators: true }
		)
			.then(dbThoughtData => {
				if (!dbThoughtData) {
					res.status(404).json({ message: "No thought with this Id" });
					return;
				}
				res.json(dbThoughtData);
			})
			.catch((err) => res.status(400).json(err));
	},
	// delete a Thought by Id
	deleteThought({ params }, res) {
		Thought.findOneAndDelete({ _id: params.id })
			.then((dbThoughtData) => {
				if (!dbThoughtData) {
					res.status(404).json({ message: "No thought with this Id" });
					return;
				}
				res.json(dbThoughtData);
			})
			.catch((err) => res.status(400).json(err));
	},
	// add Reaction
	addReaction({ params, body }, res) {
		Thought.findOneAndUpdate(
			{ _id: params.thoughtId },
			{ $addToSet: { reactions: body } },
			{ new: true }
		)
			.then((dbThoughtData) => {
				if (!dbThoughtData) {
					res.status(404).json({ message: 'No thought with this Id' });
					return;
				}
				res.json(dbThoughtData);
			})
			.catch((err) => res.json(err));
	},
	// delete Reaction
	deleteReaction({ params }, res) {
		Thought.findOneAndUpdate(
			{ _id: params.thoughtId },
			{ $pull: { reactions: { reactionId: params.reactionId } } },
			{ new: true }
		)
		.then((dbThoughtData) => res.json(dbThoughtData))
		.catch((err) => res.json(err));
	}
};

module.exports = thoughtController;