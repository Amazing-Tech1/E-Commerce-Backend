const jwt = require('jsonwebtoken');

function handleRefreshToken(req, res) {
    return new Promise((resolve, reject) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            console.log('No refresh Token');
            return reject(res.status(401).json({ message: 'No Refresh Token' }));
        } else {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
                if (err) {
                    console.log('refreshToken invalid');
                    return res.status(403).json({ message: 'RefreshToken is invalid' });
                }

                if (decoded.email !== process.env.ADMIN_EMAIL) {
                    console.log('Not Admin');
                    return res.status(401).json({ message: 'Unauthorized: Admin credentials mismatch' });
                }


                const newAccessToken = jwt.sign({ email: decoded.email }, process.env.ACCESS_TOKEN, { expiresIn: '30m' });

                res.cookie('accessToken', newAccessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'None',
                    maxAge: 30 * 60 * 1000
                });
                resolve(true);
                console.log('New AccessToken')
            })
        }
    })

}

module.exports = { handleRefreshToken };
