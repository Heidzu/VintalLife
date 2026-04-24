const { body, param, query } = require('express-validator');

const { sanitizeText } = require('../../utils/sanitizeInput');
const { CONTENT_TYPES, CONTENT_SECTIONS, CONTENT_KINDS } = require('../../models/Content');

const urlPattern = /^(https?:)?\/\//i;
const assetPathPattern = /^\/uploads\/photos\/[a-z0-9-]+(?:\.[a-z0-9]+)?$/i;
const sitePathPattern = /^\/[a-z0-9-._~!$&'()*+,;=:@/%]*$/i;
const anchorPattern = /^#[a-z0-9-]+$/i;
const specialLinkPattern = /^(mailto:|tel:)/i;

const normalizeMetadata = (value) => {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }

    if (typeof value === 'string') {
        return JSON.parse(value);
    }

    return value;
};

const isValidImageReference = (value) => (
    urlPattern.test(value) ||
    assetPathPattern.test(value)
);

const isValidButtonLink = (value) => (
    urlPattern.test(value) ||
    sitePathPattern.test(value) ||
    anchorPattern.test(value) ||
    specialLinkPattern.test(value)
);

const contentKeyRules = [
    param('key')
        .isString()
        .withMessage('Content key must be a string.')
        .bail()
        .customSanitizer((value) => value.toLowerCase().trim())
        .matches(/^[a-z0-9-]+$/)
        .withMessage('Content key may only contain lowercase letters, numbers, and hyphens.')
        .bail()
        .isLength({ min: 1, max: 100 })
        .withMessage('Content key must be between 1 and 100 characters.')
];

const contentRules = [
    body('key')
        .optional({ nullable: true })
        .isString()
        .withMessage('Key must be a string.')
        .bail()
        .customSanitizer((value) => sanitizeText(value, 100).toLowerCase())
        .matches(/^[a-z0-9-]+$/)
        .withMessage('Key may only contain lowercase letters, numbers, and hyphens.')
        .bail()
        .isLength({ min: 1, max: 100 })
        .withMessage('Key must be between 1 and 100 characters.'),

    body('section')
        .optional({ nullable: true })
        .isString()
        .withMessage('Section must be a string.')
        .bail()
        .customSanitizer((value) => sanitizeText(value, 100).toLowerCase())
        .isIn(Object.values(CONTENT_SECTIONS))
        .withMessage(`Section must be one of: ${Object.values(CONTENT_SECTIONS).join(', ')}`),

    body('type')
        .optional({ nullable: true })
        .isString()
        .withMessage('Type must be a string.')
        .bail()
        .isIn(Object.values(CONTENT_TYPES))
        .withMessage(`Type must be one of: ${Object.values(CONTENT_TYPES).join(', ')}`),

    body('kind')
        .optional({ nullable: true })
        .isString()
        .withMessage('Kind must be a string.')
        .bail()
        .isIn(Object.values(CONTENT_KINDS))
        .withMessage(`Kind must be one of: ${Object.values(CONTENT_KINDS).join(', ')}`),

    body('title')
        .optional({ nullable: true })
        .isString()
        .withMessage('Title must be a string.')
        .bail()
        .customSanitizer((value) => sanitizeText(value, 200))
        .isLength({ max: 200 })
        .withMessage('Title must not exceed 200 characters.'),

    body('content')
        .optional({ nullable: true })
        .isString()
        .withMessage('Content must be a string.')
        .bail()
        .customSanitizer((value) => String(value).trim().slice(0, 5000)),

    body('subtitle')
        .optional({ nullable: true })
        .isString()
        .withMessage('Subtitle must be a string.')
        .bail()
        .customSanitizer((value) => sanitizeText(value, 500))
        .isLength({ max: 500 })
        .withMessage('Subtitle must not exceed 500 characters.'),

    body('buttonText')
        .optional({ nullable: true })
        .isString()
        .withMessage('Button text must be a string.')
        .bail()
        .customSanitizer((value) => sanitizeText(value, 100))
        .isLength({ max: 100 })
        .withMessage('Button text must not exceed 100 characters.'),

    body('buttonLink')
        .optional({ nullable: true })
        .isString()
        .withMessage('Button link must be a string.')
        .bail()
        .customSanitizer((value) => sanitizeText(value, 500))
        .custom((value) => {
            if (!value || isValidButtonLink(value)) {
                return true;
            }

            throw new Error('Button link must be an absolute URL, internal path, anchor, tel, or mailto link.');
        }),

    body('imageUrl')
        .optional({ nullable: true })
        .isString()
        .withMessage('Image URL must be a string.')
        .bail()
        .customSanitizer((value) => sanitizeText(value, 500))
        .custom((value) => {
            if (!value || isValidImageReference(value)) {
                return true;
            }

            throw new Error('Image URL must be an absolute URL or a local /uploads/photos/... path.');
        }),

    body('imageAlt')
        .optional({ nullable: true })
        .isString()
        .withMessage('Image alt text must be a string.')
        .bail()
        .customSanitizer((value) => sanitizeText(value, 200))
        .isLength({ max: 200 })
        .withMessage('Image alt text must not exceed 200 characters.'),

    body('metadata')
        .optional({ nullable: true })
        .customSanitizer(normalizeMetadata)
        .custom((value) => {
            if (value === undefined) {
                return true;
            }

            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                return true;
            }

            throw new Error('Metadata must be a valid object or JSON object string.');
        }),

    body('isActive')
        .optional({ nullable: true })
        .isBoolean()
        .withMessage('isActive must be a boolean.')
        .toBoolean(),

    body('position')
        .optional({ nullable: true })
        .isInt({ min: 0 })
        .withMessage('Position must be a non-negative integer.')
        .toInt(),

    body('language')
        .optional({ nullable: true })
        .isString()
        .withMessage('Language must be a string.')
        .bail()
        .customSanitizer((value) => sanitizeText(value, 10).toLowerCase())
        .isLength({ min: 2, max: 10 })
        .withMessage('Language code must be between 2 and 10 characters.')
];

const contentListRules = [
    query('section')
        .optional()
        .isString()
        .withMessage('Section filter must be a string.')
        .bail()
        .isIn(Object.values(CONTENT_SECTIONS))
        .withMessage(`Invalid section. Valid sections: ${Object.values(CONTENT_SECTIONS).join(', ')}`),

    query('type')
        .optional()
        .isString()
        .withMessage('Type filter must be a string.')
        .bail()
        .isIn(Object.values(CONTENT_TYPES))
        .withMessage(`Invalid type. Valid types: ${Object.values(CONTENT_TYPES).join(', ')}`),

    query('kind')
        .optional()
        .isString()
        .withMessage('Kind filter must be a string.')
        .bail()
        .isIn(Object.values(CONTENT_KINDS))
        .withMessage(`Invalid kind. Valid kinds: ${Object.values(CONTENT_KINDS).join(', ')}`),

    query('language')
        .optional()
        .isString()
        .withMessage('Language must be a string.')
        .bail()
        .isLength({ max: 10 })
        .withMessage('Language code must not exceed 10 characters.'),

    query('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean.'),

    query('includeInactive')
        .optional()
        .isBoolean()
        .withMessage('includeInactive must be a boolean.'),

    query('allLanguages')
        .optional()
        .isBoolean()
        .withMessage('allLanguages must be a boolean.'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be an integer between 1 and 100.')
        .toInt(),

    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer.')
        .toInt()
];

const contentKeysRules = [
    query('keys')
        .isString()
        .withMessage('Query parameter "keys" is required.')
        .bail()
        .custom((value) => {
            const keys = value
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean);

            if (keys.length === 0) {
                throw new Error('Provide at least one content key.');
            }

            if (keys.some((item) => !/^[a-z0-9-]+$/i.test(item))) {
                throw new Error('Keys may only contain letters, numbers, and hyphens.');
            }

            return true;
        })
];

module.exports = {
    contentKeyRules,
    contentRules,
    contentListRules,
    contentKeysRules
};
