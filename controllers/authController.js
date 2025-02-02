const User = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

async function handleLogin(req, res) {
    const { email, password } = req.body
    function generateaccessToken(id) {
        return jwt.sign({ id }, process.env.ACCESS_TOKEN, { expiresIn: '1h' });
    }
    function generateRefreshToken(id) {
        return jwt.sign({ id }, process.env.REFRESH_TOKEN, { expiresIn: '1d' });
    }
    if (!email || !password) return res.status(400).json({ "message": "All input fields required" })
    const foundUser = await User.findOne({ email }).exec()
    if (!foundUser) return res.sendStatus(401)
    const isMatch = await bcrypt.compare(password, foundUser.password)
    if (!isMatch) return res.status(400).json({ "message": "Email or Password not correct" })
    try {
        const accessToken = generateaccessToken(foundUser._id);
        const refreshToken = generateRefreshToken(foundUser._id);
        res.cookie('accessToken', accessToken,
            {
                httpOnly: true, sameSite: 'None', secure: true, maxAge: 60 * 60 * 1000
            })
        res.cookie('refreshToken', refreshToken,
            {
                httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000
            })

        res.status(201).json({ success: true })
    } catch (err) {
        res.status(500).json({ "message": "Something went wrong" })
    }
}

module.exports = { handleLogin }