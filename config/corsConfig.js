const allowedOrigins = [
    'https://shopping-app-drab.vercel.app',
    'https://e-commerce-panel-r1v7.vercel.app'
]

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
        optionsSuccessStatus = 200
        
    }
}

module.exports = { corsOptions, allowedOrigins };