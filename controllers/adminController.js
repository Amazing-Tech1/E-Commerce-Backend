const jwt = require('jsonwebtoken')

async function adminLogin(req, res) {
    const { email, password } = req.body

    if (!email || !password) return res.status(400).json({ "message": "All credentials Required" })
    if (email !== process.env.ADMIN_EMAIL && password !== process.env.ADMIN_PASSWORD) return res.status(401)
    try {
        const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '30m' });
        const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN, { expiresIn: '3d' })
        res.cookie('accessToken', accessToken,
            { httpOnly: true, sameSite: 'None', secure: true, maxAge: 30 * 60 * 1000 })
        res.cookie('refreshToken', refreshToken,
            { httpOnly: true, sameSite: 'None', secure: true, maxAge: 3 * 24 * 60 * 60 * 1000 })
        res.status(201).json({ success: true })
    } catch (err) {
        res.status(500).json({ 'message': err.message })
    }
}
module.exports = { adminLogin }