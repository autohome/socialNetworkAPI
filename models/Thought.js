const { Schema, model } = require('mongoose');
const Reaction = require('./Reaction');

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
        username: {
            type: String,
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
const Thought = model('thought', thoughtSchema);

module.exports = Thought;
