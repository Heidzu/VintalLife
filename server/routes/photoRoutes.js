const express = require('express');

const {
    deletePhoto,
    downloadPhoto,
    getPhotos,
    getPhotosByStyle,
    uploadPhoto,
    createPhotoFromUrl
} = require('../controllers/photoController');
const allowFields = require('../middlewares/allowFields');
const { upload } = require('../middlewares/upload');
const validateRequest = require('../middlewares/validateRequest');
const { createPhotoRules, photoIdRules } = require('../middlewares/validators/photoValidators');

const router = express.Router();

router
    .route('/')
    .get(getPhotos)
    .post(
        allowFields(['title', 'description', 'category', 'style', 'fileUrl']),
        createPhotoRules,
        validateRequest,
        createPhotoFromUrl
    );

router.post('/upload',
    upload.single('image'),
    allowFields(['title', 'description', 'category', 'style']),
    createPhotoRules,
    validateRequest,
    uploadPhoto
);

router.get('/style/:style', getPhotosByStyle);

router.delete('/:id', photoIdRules, validateRequest, deletePhoto);
router.get('/:id/download', photoIdRules, validateRequest, downloadPhoto);

module.exports = router;