const router = require('express').Router();

const {
    getUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    removeFriend,
} = require('../../controler/userController');

//api/users
router.route('/').get(getUsers).post(createUser);

//api/users/:userId
router.route('/:userID').get(getSingleUser).delete(deleteUser).put(updateUser)

//api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend)

module.exports = router;