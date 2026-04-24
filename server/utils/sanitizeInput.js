const xss = require('xss');

const dangerousPattern = /(<script|<\/?iframe|javascript:|onerror\s*=|onload\s*=|\$where|\$gt|\$gte|\$lt|\$lte|\$ne|\$regex|\$or|\$and|union\s+select|drop\s+table|insert\s+into|delete\s+from|update\s+\w+\s+set)/i;

const sanitizeText = (value, maxLength = 500) => {
    if (typeof value !== 'string') {
        return value;
    }

    const cleaned = xss(value, {
        whiteList: {},
        stripIgnoreTag: true,
        stripIgnoreTagBody: ['script']
    })
        .replace(/\s+/g, ' ')
        .trim();

    return cleaned.slice(0, maxLength);
};

const containsDangerousContent = (value) => {
    if (typeof value !== 'string') {
        return false;
    }

    return dangerousPattern.test(value);
};

module.exports = {
    sanitizeText,
    containsDangerousContent
};