const { Schema, model } = require('mongoose');
// TODO: NEED TO ADD TIME LIBRARY

const userSchema = new Schema({
	username: {
		type: String,
		unique: true, // username must be unique
		required: true,
		trim: true
	},
	email: {
		type: String,
		unique: true,
		required: true,
		match: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
	},
	thoughts: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Thought'
		}
	],
	friends: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	]
},
	{
		toJSON: {
			virtuals: true,
			getters: true
		},
		id: false
	}
);

// get total count of friends on retrievel
userSchema.virtual('friendCount').get(function() {
	return this.friends.length;
});

// create the User Model using the UserSchema
const User = model('User', userSchema);

// export User model
module.exports = User;