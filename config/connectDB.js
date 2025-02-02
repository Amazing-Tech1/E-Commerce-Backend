const mongoose = require('mongoose')

const connectDB = async () => {
    const clientOptions = {
        serverApi: { version: '1', strict: true, deprecationErrors: true }
    };

    try {
        await mongoose.connect(process.env.URI, clientOptions)
        // console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection failed:', err);
        process.exit(1);
    }
}

module.exports = connectDB