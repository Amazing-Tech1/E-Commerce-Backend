const express = require('express')
const router = express.Router()
const { getAllUsers, getUser, deleteUser } = require('../controllers/usersController')
const { adminAuth } = require('../middleware/adminAuth');



router.route('/')
    .get(adminAuth, getAllUsers)
    .delete(adminAuth, deleteUser);

router.route('/:id')
    .get(adminAuth, getUser);

module.exports = router;