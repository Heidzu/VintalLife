const { body, param } = require('express-validator');

const { containsDangerousContent, sanitizeText } = require('../../utils/sanitizeInput');

const sourceValues = ['modal', 'lead-magnet', 'installment', 'contact', 'admin', 'other'];

const createContactRequestRules = [
    body('name')
        .exists({ checkFalsy: true })
        .withMessage('Name is required.')
        .bail()
        .isString()
        .withMessage('Name must be a string.')
        .bail()
        .customSanitizer((value) => sanitizeText(value, 80))
        .isLength({ min: 2, max: 80 })
        .withMessage('Name must contain between 2 and 80 characters.')
        .bail()
        .matches(/^[\p{L}'`\-\s]+$/u)
        .withMessage('Name contains unsupported characters.')
        .bail()
        .custom((value) => {
            if (containsDangerousContent(value)) {
                throw new Error('Name contains dangerous patterns.');
            }

            return true;
        }),

    body('phone')
        .exists({ checkFalsy: true })
        .withMessage('Phone is required.')
        .bail()
        .customSanitizer((value) => sanitizeText(String(value), 20))
        .matches(/^\+?[0-9]{10,15}$/)
        .withMessage('Phone must contain 10 to 15 digits and may start with +.'),

    body('source')
        .optional({ checkFalsy: true })
        .customSanitizer((value) => sanitizeText(value, 40))
        .isIn(sourceValues)
        .withMessage(`Source must be one of: ${sourceValues.join(', ')}.`),

    body('message')
        .optional({ checkFalsy: true })
        .isString()
        .withMessage('Message must be a string.')
        .bail()
        .customSanitizer((value) => sanitizeText(value, 500))
        .isLength({ max: 500 })
        .withMessage('Message must not exceed 500 characters.')
        .bail()
        .custom((value) => {
            if (containsDangerousContent(value)) {
                throw new Error('Message contains dangerous patterns.');
            }

            return true;
        })
];

const contactRequestIdRules = [
    param('id').isMongoId().withMessage('Invalid request id.')
];

module.exports = {
    createContactRequestRules,
    contactRequestIdRules
};