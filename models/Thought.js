const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const Reaction = require('./Reaction');
const User = require('./User');


// Schema to create Post model
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref:'User',
            required: true,
        },
        reactions: [Reaction],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

// Create a virtual property `getReactions` that gets the amount of tags associated with an thought
thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

// Initialize our Thought model
const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
