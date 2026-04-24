const { body, param } = require('express-validator');

const { containsDangerousContent, sanitizeText } = require('../../utils/sanitizeInput');
const { KITCHEN_STYLES } = require('../../models/Photo');

const validStyles = Object.values(KITCHEN_STYLES);
const publicImagePattern = /^(https?:)?\/\//i;
const localImagePattern = /^\/uploads\/photos\/[a-z0-9-]+(?:\.[a-z0-9]+)?$/i;

const createPhotoRules = [
    body('title')
        .optional({ checkFalsy: true })
        .isString()
        .withMessage('Title must be a string.')
        .bail()
        .customSanitizer((value) => sanitizeText(value, 120))
        .isLength({ min: 2, max: 120 })
        .withMessage('Title must contain between 2 and 120 characters.')
        .bail()
        .custom((value) => {
            if (containsDangerousContent(value)) {
                throw new Error('Title contains dangerous patterns.');
            }

            return true;
        }),

    body('description')
        .optional({ checkFalsy: true })
        .isString()
        .withMessage('Description must be a string.')
        .bail()
        .customSanitizer((value) => sanitizeText(value, 500))
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters.')
        .bail()
        .custom((value) => {
            if (containsDangerousContent(value)) {
                throw new Error('Description contains dangerous patterns.');
            }

            return true;
        }),

    body('category')
        .optional({ checkFalsy: true })
        .isString()
        .withMessage('Category must be a string.')
        .bail()
        .customSanitizer((value) => sanitizeText(value, 80))
        .isLength({ max: 80 })
        .withMessage('Category must not exceed 80 characters.')
        .bail()
        .custom((value) => {
            if (containsDangerousContent(value)) {
                throw new Error('Category contains dangerous patterns.');
            }

            return true;
        }),

    body('style')
        .optional({ checkFalsy: true })
        .isString()
        .withMessage('Style must be a string.')
        .bail()
        .isIn(validStyles)
        .withMessage(`Style must be one of: ${validStyles.join(', ')}`),

    body('fileUrl')
        .optional({ nullable: true })
        .isString()
        .withMessage('fileUrl must be a string.')
        .bail()
        .custom((value) => {
            if (!value || publicImagePattern.test(value) || localImagePattern.test(value)) {
                return true;
            }

            throw new Error('fileUrl must be an absolute URL or a local /uploads/photos/... path.');
        })
];

const photoIdRules = [
    param('id').isMongoId().withMessage('Invalid photo id.')
];

module.exports = {
    createPhotoRules,
    photoIdRules
};
