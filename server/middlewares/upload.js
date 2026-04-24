const fs = require('fs');
const path = require('path');
const multer = require('multer');

const ApiError = require('../utils/ApiError');

const photosDirectory = path.join(__dirname, '..', 'uploads', 'photos');
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
const maxFileSizeMb = Number(process.env.MAX_FILE_SIZE_MB) || 5;

fs.mkdirSync(photosDirectory, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, callback) => {
        callback(null, photosDirectory);
    },
    filename: (_req, file, callback) => {
        const fileExtension = path.extname(file.originalname).toLowerCase();
        const baseName = path
            .basename(file.originalname, fileExtension)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
            .slice(0, 50) || 'photo';

        callback(null, `${baseName}-${Date.now()}${fileExtension}`);
    }
});

const fileFilter = (_req, file, callback) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
        return callback(new ApiError(400, 'Only JPG, PNG and WEBP images are allowed.'));
    }

    return callback(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: maxFileSizeMb * 1024 * 1024
    }
});

module.exports = {
    upload,
    photosDirectory
};