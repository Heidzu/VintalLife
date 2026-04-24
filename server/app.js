const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');

const { buildAdminPanel } = require('./config/adminjs');
const contactRoutes = require('./routes/contactRoutes');
const photoRoutes = require('./routes/photoRoutes');
const contentRoutes = require('./routes/contentRoutes');
const errorHandler = require('./middlewares/errorHandler');
const mongoSanitize = require('./middlewares/mongoSanitize');
const ApiError = require('./utils/ApiError');

const createApp = async () => {
    const app = express();
    const uploadsDirectory = path.join(__dirname, 'uploads');
    const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);

    const isProduction = process.env.NODE_ENV === 'production';

    const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 200,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            success: false,
            message: 'Too many requests. Please try again later.'
        }
    });

    const { adminJs, adminRouter } = await buildAdminPanel();

    app.set('trust proxy', 1);

    app.use(
        helmet({
            crossOriginResourcePolicy: { policy: 'cross-origin' },
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "blob:", "https://maps.googleapis.com"],
                    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://maps.googleapis.com"],
                    imgSrc: ["'self'", "data:", "blob:", "http://localhost:*", "https://*", "http://*"],
                    fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
                    connectSrc: ["'self'", "http://localhost:*", "https://*"],
                    frameSrc: ["'self'", "https://www.google.com", "https://maps.google.com"],
                }
            }
        })
    );

    const corsOptions = {
        origin: (origin, callback) => {
            // Allow all origins in development
            if (!isProduction) {
                return callback(null, true);
            }
            
            // In production:
            // 1. Allow if no origin (non-CORS requests, same-site navigation)
            // 2. Allow if it's in the allowedOrigins list
            // 3. Allow if it's a request from the same host (optional but safer)
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            
            // If you want to be more permissive in production for the admin panel:
            // return callback(null, true); 
            
            return callback(new ApiError(403, 'CORS policy does not allow this origin.'));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    };

    app.use(cors(corsOptions));
    app.use(morgan(isProduction ? 'combined' : 'dev'));
    app.use('/uploads', express.static(uploadsDirectory, {
        setHeaders: (res) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        }
    }));

    app.get('/favicon.ico', (req, res) => {
        res.sendFile(path.join(uploadsDirectory, 'favicon.ico'));
    });
    
    // AdminJS routes (MUST be first, before body-parser)
    app.get('/admin/add-photo', (_req, res) => {
        res.sendFile(path.join(__dirname, 'admin-add-photo.html'));
    });
    app.use(adminJs.options.rootPath, adminRouter);
    
    // Body parsers (MUST be after AdminJS)
    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: false, limit: '1mb' }));
    app.use(mongoSanitize);
    
    // API routes
    app.use('/api', apiLimiter);
    app.get('/api/health', (_req, res) => {
        res.status(200).json({ success: true, message: 'VintalLife API is running.' });
    });
    app.use('/api/requests', contactRoutes);
    app.use('/api/photos', photoRoutes);
    app.use('/api/content', contentRoutes);
    
    // React static files in production
    if (isProduction) {
        const clientBuildPath = path.join(__dirname, '../client/build');
        app.use(express.static(clientBuildPath));
        
        // SPA fallback
        app.get('*', (req, res) => {
            res.sendFile(path.join(clientBuildPath, 'index.html'));
        });
    }

    // Error handler
    app.use(errorHandler);

    return app;
};

module.exports = createApp;
