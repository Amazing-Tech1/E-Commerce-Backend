const User = require('../models/users')
const bcrypt = require('bcrypt')
const validator = require('validator')


async function handleNewUser(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
        return res.status(400).json({ 'message': 'All input fields required' })

    const validatedEmail = validator.isEmail(email)
    if (!validatedEmail)
        return res.status(400).json({ 'message': 'Pls enter a valid email address' })

    const duplicate = await User.findOne({ email }).exec()
    if (duplicate) return res.status(409).json({ 'message': 'Email already exists' })
    try {
        const hashedPwd = await bcrypt.hash(password, 10)
        await User.create({
            'username': username,
            'email': email,
            'password': hashedPwd
        })
        res.status(201).json({ success: true})
    } catch (err) {
        res.status(500).json({ 'message': err.message })
    }

}

module.exports = { handleNewUser }