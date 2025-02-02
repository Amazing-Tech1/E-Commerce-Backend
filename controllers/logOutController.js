function handleLogout(req, res) {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'Strict',
            secure: process.env.NODE_ENV === 'production',
        });
    }
    if (accessToken) {
        res.clearCookie('accessToken', {
            httpOnly: true,
            sameSite: 'Strict',
            secure: process.env.NODE_ENV === 'production',
        });
    }
    if (!accessToken && !refreshToken) {
        return res.status(200).json({ message: 'No active session found' });
    }

    return res.status(201).json({ logout: true });
}


module.exports = { handleLogout }
