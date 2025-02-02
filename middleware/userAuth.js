const jwt = require('jsonwebtoken');
const { userRefresh } = require('../controllers/userRefreshController')

async function userAuth(req, res, next) {
    const accessToken = req.cookies.accessToken

    if (!accessToken) {
        console.log('No access token. Attempting refresh...');
        try {
            await userRefresh(req, res); 
            return next();  
        } catch (err) {
            return; 
        }
    } else {
        jwt.verify(accessToken, process.env.ACCESS_TOKEN, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Access token is invalid' });
            }

            req.body.userId = decoded.id;
            next();
        })
    }

} module.exports = userAuth