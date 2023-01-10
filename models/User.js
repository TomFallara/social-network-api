
const {Schema, mongoose, model} = require('mongoose');
const validator = require('validator');

// Construct a new instance of the schema class for user
const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    unique: true, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    validate:{
      validator: validator.isEmail,
      message: "the email needs to be an email"
    }
  },
  thoughts: [{
    type: Schema.Types.ObjectId,
    ref: 'Thought',
  },],
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },]
},
  {
    toJSON: {
      getters: true,
      virtuals: true,
    },
    id: false,
  }
);

//Create the virtual property for friendcount
userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

const User = model('user', userSchema)

module.exports = User;
