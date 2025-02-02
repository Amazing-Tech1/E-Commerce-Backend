const jwt = require('jsonwebtoken');
const { handleRefreshToken } = require('../controllers/refreshController');

async function adminAuth(req, res, next) {
    const accessToken = req.cookies.accessToken

    if (!accessToken) {
        console.log('No access token. Attempting refresh...');
        try {
            await handleRefreshToken(req, res); 
            return next();  
        } catch (err) {
            return; 
        }
    } else {
        jwt.verify(accessToken, process.env.ACCESS_TOKEN, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Token is invalid' });
            }

            req.user = decoded;

            if (req.user.email !== process.env.ADMIN_EMAIL) {
                return res.status(401).json({ message: 'Unauthorized: Admin credentials mismatch' });
            }

            next();
        })
    }

}
module.exports = { adminAuth }