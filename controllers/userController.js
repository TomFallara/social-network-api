
const {User, Thought} = require('../models');

module.exports = {
    //get all users
    getUsers(req, res) {
        User.find()
        .then(async (users) => {
            const userObj = { users };
            return res.json(userObj);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },

    //get one user
    getSingleUser(req, res) {
        User.findOne({_id: req.params.userId})
        .select('-__v')
        .then((user) => {
            !user
            ? res.status(404).json({ message: 'No user with that Id'})
            : res.json(user)
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },

    // create a new user
    createUser(req, res) {
        User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => res.status((500).json(err)));
    },

    //update user
    updateUser(req, res) {
        User.findOneAndUpdate(
            { __id: req.params.userId},
            { $set: req.body },
            { runValidators: true, new: true},
        )
        .then((user) =>
        !user
            ? res.status(400).json({message: 'No user with this ID. Try a different ID.'})
            : res.json(user)
        )
        .catch((err) => {
            console.log(err);
            res.stauts(500).json(err);
        });
    },

    //delete user + remove thoughts
    deleteUser(req, res) {
        User.findOneAndRemove({ _id: req.params.userId})
        .then((user) =>
        !user
        ? res.status(404).json({message: "No such user exists. Try again."})
        : Thought.deleteMany({ _id: { $in: user.thoughts} })
        )
        .then (() => res.json({ message: 'User and thoughts succesfully deleted'}))
        .cath((err) => {
            console.log(err);
            res.status(500).json(err)
        });
    },

    //add friend
    addFriend(req, res){
        console.log('You are adding a friend');
        console.log(req.body);
        User.findOneAndUpdate(
            { __id: req.params.userId},
            { $addToSet: { friends: req.params.userId } },
            { runValidators: true, new: true},
            )
        .then((user) => 
        User.findOneAndUpdate(
            { __id: req.params.userId},
            { $addToSet: { friends: req.params.userId } },
            { runValidators: true, new: true},
            )
        )
        .then((user) =>
            !user
            ? res.status(404).json({message:'No one has this ID. Try again'})
            : res.json(user)
        )
        .catch((err) => res.status(500).json(err)); 
    },

        //Remove friend from a user
        removeFriend(req, res){
            User.findOneAndUpdate(
                { __id: req.params.userId},
                { $pull: { friends: req.params.userId } },
                { runValidators: true, new: true},
            )
            .then(() =>
            User.findOneAndUpdate(
                { __id: req.params.userId},
                { $pull: { friends: req.params.userId } },
                { runValidators: true, new: true},
                )
            )
            .then((user) =>
                !user
                ? res.status(404).json({message:'No one has this ID. Try again'})
                : res.json(user)
            )
            .catch((err) => res.status(500).json(err)); 
        }
}