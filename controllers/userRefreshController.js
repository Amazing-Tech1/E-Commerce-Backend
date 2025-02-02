const jwt = require('jsonwebtoken');

function userRefresh(req, res) {
    return new Promise((resolve, reject) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            console.log('No refresh Token');
            return reject(res.status(401).json({ message: 'No Refresh Token' }));
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
            if (err) {
                console.log('refreshToken invalid');
                return reject(res.status(403).json({ message: 'RefreshToken is invalid' }));
            }

            const newAccessToken = jwt.sign({ id: decoded.id }, process.env.ACCESS_TOKEN, { expiresIn: '15m' });

            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                maxAge: 60 * 1000
            });

            resolve(true);
        });
    });
}

module.exports = { userRefresh };
