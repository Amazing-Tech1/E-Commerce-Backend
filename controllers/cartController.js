const User = require('../models/users')

async function addToCart(req, res) {
    const { userId, itemId, size } = req.body
    if (!userId || !itemId || !size) {
        return res.status(400).json({ 'Message': 'All credentials are required' })
    }
    try {
        const userData = await User.findById(userId)
        let cartData = await userData.cartData

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1
            } else {
                cartData[itemId][size] = 1
            }
        } else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }
        await User.findByIdAndUpdate(userId, { cartData })
        res.status(201).json({ success: true })
    } catch (err) {
        console.log(err.message)
        res.json({ 'message': err.message })
    }
}
async function updateCart(req, res) {
    const { userId, itemId, size, quantity } = req.body
    try {
        const userData = await User.findById(userId)
        let cartData = await userData.cartData

        cartData[itemId][size] = quantity
        await User.findByIdAndUpdate(userId, { cartData })
        res.status(201).json({ success: true })
    } catch (err) {
        console.log(err.message)
        res.json({ 'message': err.message })
    }


}
async function getUserCart(req, res) {
    const { userId } = req.body
    if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
    }
    try {
        const userData = await User.findById(userId)
        let cartData = await userData.cartData

        res.status(200).json({ success: true, cartData })
    } catch (err) {
        console.log(err.message)
        res.json({ 'message': err.message })
    }
}
module.exports = { addToCart, updateCart, getUserCart }