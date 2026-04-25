

require('dotenv').config();

const mongoose = require('mongoose');

const createApp = require('./app');
const connectDB = require('./config/db');

const PORT = Number(process.env.PORT) || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vintallife';

const startServer = async () => {
    try {
        await connectDB(MONGODB_URI);
        const app = await createApp();

        const server = app.listen(PORT, () => {
            console.log(`VintalLife API listening on port ${PORT}`);
            console.log(`Admin panel available at http://localhost:${PORT}/admin`);
        });

        const shutdown = async (signal) => {
            console.log(`${signal} received. Closing the server...`);

            server.close(async () => {
                await mongoose.connection.close(false);
                process.exit(0);
            });
        };

        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));
    } catch (error) {
        console.error('Failed to start the server:', error.message);
        process.exit(1);
    }
};

process.on('unhandledRejection', (error) => {
    console.error('Unhandled rejection:', error);
    process.exit(1);
});

startServer();