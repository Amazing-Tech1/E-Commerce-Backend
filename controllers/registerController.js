const User = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')


async function handleNewUser(req, res) {
    const { username, email, password } = req.body;
    function generateAccessToken(id) {
        return jwt.sign({ id }, process.env.ACCESS_TOKEN, { expiresIn: '15m' });
    }
    function generateRefreshToken(id) {
        return jwt.sign({ id }, process.env.REFRESH_TOKEN, { expiresIn: '7d' });  // 7 days expiry
    }
    if (!username || !email || !password)
        return res.status(400).json({ 'message': 'All input fields required' })

    const validatedEmail = validator.isEmail(email)
    if (!validatedEmail)
        return res.status(400).json({ 'message': 'Pls enter a valid email address' })

    const duplicate = await User.findOne({ email }).exec()
    if (duplicate) return res.status(409).json({ 'message': 'Email already exists' })
    try {
        const hashedPwd = await bcrypt.hash(password, 10)
        const result = await User.create({
            'username': username,
            'email': email,
            'password': hashedPwd
        })
        console.log(result)
        const accessToken = generateAccessToken(result._id);
        const refreshToken = generateRefreshToken(result._id);


        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(201).json({ success: true})
    } catch (err) {
        res.status(500).json({ 'message': err.message })
    }

}

module.exports = { handleNewUser }