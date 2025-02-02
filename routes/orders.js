const { placeOrder, placeOrderPayStack, placeOrderPayPal, verifyPaystack, allOrders, userOrder, updateStatus } = require('../controllers/orderController')
const express = require('express')
const { adminAuth } = require('../middleware/adminAuth')
const userAuth = require('../middleware/userAuth')
const router = express.Router()

//Admin
router.get('/list', adminAuth, allOrders)
router.post('/status', adminAuth, updateStatus)

//Users
router.post('/placeorder', userAuth, placeOrder)
router.post('/payment/paystack', userAuth, placeOrderPayStack)
router.post('/payment/paypal', userAuth, placeOrderPayPal)


router.get('/userorders', userAuth, userOrder)

router.post('/verifyPaystack', userAuth, verifyPaystack)

module.exports = router