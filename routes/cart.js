const express = require('express')
const router = express.Router()
const { addToCart, updateCart, getUserCart } = require('../controllers/cartController')
const userAuth = require('../middleware/userAuth')

router.route('/')
    .get(userAuth, getUserCart)
    .post(userAuth, addToCart)
    .patch(userAuth, updateCart)

module.exports = router
