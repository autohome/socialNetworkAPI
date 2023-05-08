// const { Thought, User } = require('../models');

// module.exports = {
//     // TODO
//     // /api/thoughts
//     // GET to get all thoughts
//     // GET to get a single thought by its _id
//     // POST to create a new thought (don't forget to push the created thought's _id to the associated user's thoughts array field)
//     // PUT to update a thought by its _id
//     // DELETE to remove a thought by its _id

//     // example data
//     // {
//     //   "thoughtText": "Here's a cool thought...",
//     //   "username": "lernantino",
//     //   "userId": "5edff358a0fcb779aa7b118b"
//     // }


//     // /api/thoughts/:thoughtId/reactions
//     // POST to create a reaction stored in a single thought's reactions array field
//     // DELETE to pull and remove a reaction by the reaction's reactionId value
// }

// SEE APPCONTROLLER IN SOLVED

const { Thought, User } = require('../models');

module.exports = {
    // Get all thoughts
    getThoughts(req, res) {
        Thought.find()
            .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .then((thoughts) => res.json(thoughts))
        .catch((err) => res.status(500).json(err));
    },
    // Get a single thought by its _id
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .then((thought) =>
                !thought
                ? res.status(404).json({ message: 'No thought with that ID' })
                : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    // // Create a new thought (don't forget to push the created thought's _id to the associated user's thoughts array field)
    // createThought(req, res) {
    // // Create the reactions array separately
    // const reactions = req.body.reactions || [];
    // delete req.body.reactions;

    // // Create the thought
    // Thought.create(req.body)
    //     .then((thought) => {
    //         // Add the thought to the user's thoughts array
    //         return User.findOneAndUpdate(
    //             { _id: thought.userId },
    //             { $push: { thoughts: thought._id } },
    //             { new: true }
    //         ).populate({
    //             path: 'thoughts',
    //             select: '-__v'
    //         });
    //     })
    //     .then((user) => {
    //     // Add the reactions to the thought
    //         return Thought.findOneAndUpdate(
    //             { _id: user.thoughts[user.thoughts.length - 1]._id },
    //             { $push: { reactions: reactions.map((reaction) => reaction._id) } },
    //             { new: true }
    //         ).populate({
    //             path: 'reactions',
    //             select: '-__v'
    //         });
    //     })
    //     .then((thought) => res.json(thought))
    //     .catch((err) => res.status(500).json(err));
    // },
    createThought: async(req, res) => {
    const reactions = req.body.reactions || [];
    delete req.body.reactions;

    try {
        // Create the thought 
        const thought = await Thought.create(req.body);

        // Add the thought to the user's thoughts array
        const user = await User.findOneAndUpdate(
            { _id: thought.userId },
            { $push: { thoughts: thought._id } },
            { new: true }
        ).populate({
            path: 'thoughts',
            select: '-__v'
        });

        // Add the reactions to the thought
        const updatedThought = await Thought.findOneAndUpdate(
            { _id: user.thoughts[user.thoughts.length - 1]._id },
            { $push: { reactions: reactions.map((reaction) => reaction._id) } },
            { new: true }
        ).populate({
            path: 'reactions',
            select: '-__v'
        });

        // Return the updated thought
        res.json(updatedThought);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
},


    // Update a thought by its _id
    updateThought(req, res) {
        Thought.findOneAndUpdate({ _id: req.params.thoughtId }, req.body, { new: true })
        .then((updatedThought) =>
            !updatedThought
            ? res.status(404).json({ message: 'No thought with that ID' })
            : res.json(updatedThought)
        )
        .catch((err) => res.status(500).json(err));
    },
    // Remove a thought by its _id
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
        .then((deletedThought) =>
            !deletedThought
            ? res.status(404).json({ message: 'No thought with that ID' })
            : User.findOneAndUpdate(
                { _id: deletedThought.userId },
                { $pull: { thoughts: req.params.thoughtId } },
                { new: true }
                )
        )
        .then(() => res.json({ message: 'Thought and associated reactions deleted!' }))
        .catch((err) => res.status(500).json(err));
    },
    // Create a reaction stored in a single thought's reactions array field
    addReaction(req, res) {
        Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $push: { reactions: req.body } },
        { new: true }
        )
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .then((updatedThought) =>
            !updatedThought
            ? res.status(404).json({ message: 'No thought with that ID' })
            : res.json(updatedThought)
        )
        .catch((err) => res.status(500).json(err));
    },
    // Pull and remove a reaction by the reaction's reactionId value
    removeReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true }
        )
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .then((updatedThought) =>
            !updatedThought
            ? res.status(404).json({ message: 'No thought with that ID' })
            : res.json(updatedThought)
        )
        .catch((err) => res.status(500).json(err));
    }
};



