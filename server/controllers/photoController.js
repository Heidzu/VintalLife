const Photo = require('../models/Photo');
const { KITCHEN_STYLES } = require('../models/Photo');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const {
    isAbsoluteUrl,
    removeFileIfExists,
    resolveFileUrlToPath,
    toPublicUrl
} = require('../utils/fileManager');

const mapPhotoResponse = (photo, req) => ({
    _id: photo._id,
    title: photo.title || '',
    description: photo.description || '',
    category: photo.category || 'general',
    style: photo.style,
    fileUrl: toPublicUrl(req, photo.fileUrl),
    rawFileUrl: photo.fileUrl || '',
    fileName: photo.fileName || '',
    originalName: photo.originalName || '',
    mimeType: photo.mimeType || '',
    size: photo.size || 0,
    createdAt: photo.createdAt,
    updatedAt: photo.updatedAt
});

const uploadPhoto = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, 'Image file is required. Use the field name "image".');
    }

    try {
        const relativeFileUrl = `/uploads/photos/${req.file.filename}`;
        const photo = await Photo.create({
            title: req.body.title || req.file.originalname,
            description: req.body.description || '',
            category: req.body.category || 'general',
            style: req.body.style || KITCHEN_STYLES.ART_DECO,
            fileUrl: relativeFileUrl,
            fileName: req.file.filename,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size
        });

        res.status(201).json({
            success: true,
            message: 'Photo uploaded successfully.',
            data: mapPhotoResponse(photo.toObject(), req)
        });
    } catch (error) {
        if (req.file) {
            await removeFileIfExists(req.file.path);
        }
        throw error;
    }
});

const createPhotoFromUrl = asyncHandler(async (req, res) => {
    const { title, description, style, fileUrl, category } = req.body;

    if (!fileUrl) {
        throw new ApiError(400, 'Image URL is required.');
    }

    const photo = await Photo.create({
        title: title || 'Untitled photo',
        description: description || '',
        category: category || 'gallery',
        style: style || KITCHEN_STYLES.ART_DECO,
        fileUrl,
        fileName: '',
        originalName: '',
        mimeType: 'image/jpeg',
        size: 0
    });

    res.status(201).json({
        success: true,
        message: 'Photo created successfully from URL.',
        data: mapPhotoResponse(photo.toObject(), req)
    });
});

const getPhotos = asyncHandler(async (req, res) => {
    const photos = await Photo.find().sort({ createdAt: -1 }).lean();

    res.status(200).json({
        success: true,
        count: photos.length,
        data: photos.map((photo) => mapPhotoResponse(photo, req))
    });
});

const getPhotosByStyle = asyncHandler(async (req, res) => {
    const { style } = req.params;

    const validStyles = Object.values(KITCHEN_STYLES);
    if (!validStyles.includes(style)) {
        throw new ApiError(400, `Invalid style. Valid styles: ${validStyles.join(', ')}`);
    }

    const photos = await Photo.find({ style }).sort({ createdAt: -1 }).lean();

    res.status(200).json({
        success: true,
        count: photos.length,
        style,
        data: photos.map((photo) => mapPhotoResponse(photo, req))
    });
});

const deletePhoto = asyncHandler(async (req, res) => {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
        throw new ApiError(404, 'Photo not found.');
    }

    if (photo.fileUrl && !isAbsoluteUrl(photo.fileUrl)) {
        const filePath = resolveFileUrlToPath(photo.fileUrl);
        await removeFileIfExists(filePath);
    }

    await photo.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Photo deleted successfully.'
    });
});

const downloadPhoto = asyncHandler(async (req, res) => {
    const photo = await Photo.findById(req.params.id).lean();

    if (!photo) {
        throw new ApiError(404, 'Photo not found.');
    }

    if (isAbsoluteUrl(photo.fileUrl)) {
        return res.redirect(photo.fileUrl);
    }

    const filePath = resolveFileUrlToPath(photo.fileUrl);
    return res.download(filePath, photo.originalName || photo.fileName || photo.title);
});

module.exports = {
    uploadPhoto,
    getPhotos,
    getPhotosByStyle,
    createPhotoFromUrl,
    deletePhoto,
    downloadPhoto
};
