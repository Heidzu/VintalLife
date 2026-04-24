const mongoose = require('mongoose');

const connectDB = async (connectionString) => {
    mongoose.set('strictQuery', true);

    await mongoose.connect(connectionString, {
        serverSelectionTimeoutMS: 5000
    });

    console.log('MongoDB connection established.');

    if (process.env.SYNC_INDEXES !== 'false') {
        await mongoose.connection.syncIndexes();
        console.log('MongoDB indexes synced.');
    }
};

module.exports = connectDB;
