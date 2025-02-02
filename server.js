require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const credentials = require('./middleware/credentials')
const { corsOptions } = require('./config/corsConfig')
const connectDB = require('./config/connectDB')
const cookieParser = require('cookie-parser')
const path = require('path')
const { connectCloudinary } = require('./config/cloudinary')
const PORT = process.env.PORT || 5000

connectDB()
connectCloudinary()

app.use(credentials)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions))
app.use(cookieParser())






app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'))
app.use('/login', require('./routes/login'))
app.use('/refresh', require('./routes/refresh'))
app.use('/admin', require('./routes/admin'))
app.use('/logout', require('./routes/logOut'))
app.use('/products', require('./routes/product'))
app.use('/users', require('./routes/users'))
app.use('/cart', require('./routes/cart'))
app.use('/order', require('./routes/orders'))



app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'public', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ error: "404 not Found" })
    } else {
        res.type('txt').send("404 not Found")
    }

})

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})