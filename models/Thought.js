const { Schema, model, Types } = require('mongoose');
const dateFormat = require("../utils/dateFormat");

const ReactionSchema = new Schema({

	reactionId: {
		type: Schema.Types.ObjectId,
		default: () => new Types.ObjectId()
	},
	reactionBody: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		maxlength: 280
	},
	username: {
		type: String,
		require: true
	},
	createdAt: {
		type: Date,
		default: Date.now,
		get: (createdAtValue) => dateFormat(createdAtValue)
	},
},
	{
		toJSON: {
			getters: true
		}
	}
);

const ThoughtSchema = new Schema({

	thoughtText: {
		type: String,
		required: true,
		minlength: [1, 'You must type a character!'],
		maxlength: [280, 'You can not have more than 280 characters!']
	},
	createdAt: {
		type: Date,
		default: Date.now,
		get: (createdAtValue) => dateFormat(createdAtValue)
	},
	username: {
		type: String,
		required: true,
		ref: 'User'
	},
	reactions: [ReactionSchema],
},
	{
		toJSON: {
			virtuals: true,
			getters: true
		},
		id: false
	}
);

// Thought virtual
ThoughtSchema.virtual('reactionCount').get(function() {
	return this.reactions.length;
});

// create the Thought Model using the thoughtSchema
const Thought = model('Thought', ThoughtSchema);


module.exports = Thought;
