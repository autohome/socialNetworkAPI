// const { User, Application } = require('../models');

// module.exports = {
//   // Get all users
//   getUsers(req, res) {
//     User.find()
//       .then((users) => res.json(users))
//       .catch((err) => res.status(500).json(err));
//   },
//   // Get a single user
//   getSingleUser(req, res) {
//     User.findOne({ _id: req.params.userId })
//       .select('-__v')
//       .then((user) =>
//         !user
//           ? res.status(404).json({ message: 'No user with that ID' })
//           : res.json(user)
//       )
//       .catch((err) => res.status(500).json(err));
//   },
//   // create a new user
//   createUser(req, res) {
//     User.create(req.body)
//       .then((user) => res.json(user))
//       .catch((err) => res.status(500).json(err));
//   },
//   // Delete a user and associated THOUGHTS
//   deleteUser(req, res) {
//     User.findOneAndDelete({ _id: req.params.userId })
//       .then((user) =>
//         !user
//           ? res.status(404).json({ message: 'No user with that ID' })
//           // TODO UPDATE THIS TO THOUGHTS
//           : Application.deleteMany({ _id: { $in: user.applications } })
//       )
//       .then(() => res.json({ message: 'User and associated apps deleted!' }))
//       .catch((err) => res.status(500).json(err));
//   },
//   // TODO
//     // PUT to update a user by id

//     // TODO
// // /api/users/:userId/friends/:friendId
// // POST to add a new friend to a user's friend list
// // DELETE to remove a friend from a user's friend list



// };


const { User, Thought } = require('../models');

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  // Get a single user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .populate({
        path: 'thoughts',
        populate: { path: 'reactions', select: '-__v' },
        select: '-__v'
      })
      .populate({
        path: 'friends',
        select: '-__v'
      })
      .select('-__v')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // Delete a user and associated THOUGHTS
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          // TODO UPDATE THIS TO THOUGHTS
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: 'User and associated thoughts deleted!' }))
      .catch((err) => res.status(500).json(err));
  },
  // Update a user by id
  updateUser(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId }, req.body, { new: true })
      .then((updatedUser) =>
        !updatedUser
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(updatedUser)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Add a new friend to a user's friend list
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    )
      // .populate({
      //   path: 'friends',
      //   select: '-__v'
      // })
      .select('-__v')
      .then((updatedUser) =>
        !updatedUser
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(updatedUser)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Remove a friend from a user's friend list
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .populate({
        path: 'friends',
        select: '-__v'
      })
      .select('-__v')
      .then((updatedUser) =>
        !updatedUser
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(updatedUser)
      )
      .catch((err) => res.status(500).json(err));
  }
};


