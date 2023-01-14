const { Thought, User } = require('../models');
const { ObjectId } = require('mongoose').Types;

module.exports = {
    getThoughts(req, res) {
        Thought.find()
        .then((thoughts) => res.json(thoughts))
        .catch((err) => res.status(500).json(err));
    },
    getSingleThought(req, res) {
        Thought.findOne({_id: req.params.thoughtId})
        .then((thought) => 
        !thought
        ? res.status(404).json({ message: "No thought with that ID. Try again."})
        : res.json(thought)
        )
        .catch((err) => res.status(500).json(err))
    },
    createThought(req, res) {
        Thought.create(req.body)
        .then((thought) => {
            return User.findOneAndUpdate(
                { _id: req.params.userId},
                { $addToSet: {thoughts: thought._id} },
                { new: true },
            );
        })
        .then((user) => 
        !user
        ? res.status(404).json({
            message: 'thought created but the user id was wrong. Try another'})
        : res.json('Thought shared successfully, now everyone can read it')
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId},
            { $set: req.body },
            { runValidators: true, new: true},
        )
        .then((thought) =>
        !thought
            ? res.status(400).json({message: 'Wrong ID. No thought with this ID. Try a different one.'})
            : res.json(thought)
        )
        .catch((err) => {
            console.log(err);
            res.stauts(500).json(err);
        });
    },
    deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId})
        .then((thought) =>
        !thought
        ? res.status(404).json({message: "No such thought exists. Try again."})
        : User.findOneAndUpdate(
            { thought: req.params.thoughtId },
            { $pull: { thought: req.params.thoughtId } },
            { new: true }  
            )
        )
        .then((user) =>
        !user
        ? res.status(404).json({message: "No such user exists. Try again."})
        : res.json({ message: 'thought successfully deleted!' })
        )
        .catch((err) => res.status(500).json(err));
    },
    //add reaction to thought
    createReaction(req, res){
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId},
            { $addToSet: {responses: req.body} },
            { runValidators: true, new: true},
        )
        .then((thought) =>
        !thought
        ? res.status(404).json({message: "No such thought exists. Try again."})
        : res.json({message: 'reaction created'})
        )
        .catch((err) => res.status(500).json(err));
    },
    //Remove reaction
    removeReaction(req, res){
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId},
            { $pull: {reactions: {responseId: req.body}} },
            { runValidators: true, new: true},
        )
        .then((thought) =>
        !thought
        ? res.status(404).json({message: "No such thought exists. Try again."})
        : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    }
}