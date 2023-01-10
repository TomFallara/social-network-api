const mongoose = require('mongoose');

// Construct a new instance of the schema class for user
const thoughtSchema = new mongoose.Schema({
  thoughtText: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 280,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: value => value.toString()
  },
  username:{
    type: String,
    required: true,
  },
  reactions: [reactionsSchema],
}, 
    {
    toJSON: {
        getters: true,
    },
    id: false,
  }
);

//Reaction Count virtual property
thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length
})


//reaction schema
const reactionSchema = new mongoose.Schema({
    reactionId:{
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
    },
    reactionBody: {
        type: String,
        required: true,
        maxLength: 280,
    },
    username: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: value => value.toString()
      },
})

const Thought = model('thought', thoughtSchema);

module.exports = Thought;