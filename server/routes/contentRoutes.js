const express = require('express');

const {
    getAllContent,
    getContentByKey,
    getContentsByKeys,
    createContent,
    updateContent,
    deleteContent,
    upsertContents
} = require('../controllers/contentController');
const validateRequest = require('../middlewares/validateRequest');
const {
    contentRules,
    contentKeyRules,
    contentListRules,
    contentKeysRules
} = require('../middlewares/validators/contentValidators');

const router = express.Router();

// Get all content (with optional filters)
router.get('/', contentListRules, validateRequest, getAllContent);

// Get multiple contents by comma-separated keys
router.get('/keys', [...contentKeysRules, ...contentListRules], validateRequest, getContentsByKeys);

// Get single content by key
router.get('/:key', [...contentKeyRules, ...contentListRules], validateRequest, getContentByKey);

// Create content
router.post('/', contentRules, validateRequest, createContent);

// Update content by key
router.put('/:key', contentKeyRules, contentRules, validateRequest, updateContent);

// Delete content by key
router.delete('/:key', contentKeyRules, validateRequest, deleteContent);

// Bulk upsert contents (useful for seeding data)
router.post('/upsert', validateRequest, upsertContents);

module.exports = router;
