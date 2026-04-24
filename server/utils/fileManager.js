const fs = require('fs/promises');
const path = require('path');

const uploadsRoot = path.resolve(path.join(__dirname, '..', 'uploads'));
const absoluteUrlPattern = /^(?:[a-z][a-z\d+\-.]*:)?\/\//i;

const isAbsoluteUrl = (value) => {
    const normalizedValue = String(value || '').trim();

    return (
        absoluteUrlPattern.test(normalizedValue) ||
        normalizedValue.startsWith('data:') ||
        normalizedValue.startsWith('blob:')
    );
};

const removeFileIfExists = async (filePath) => {
    if (!filePath) {
        return;
    }

    try {
        await fs.unlink(filePath);
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
    }
};

const resolveFileUrlToPath = (fileUrl) => {
    const normalizedUrl = String(fileUrl || '').replace(/^\/+/, '');
    const absolutePath = path.resolve(path.join(__dirname, '..', normalizedUrl));

    if (!absolutePath.toLowerCase().startsWith(uploadsRoot.toLowerCase())) {
        throw new Error('Resolved file path is outside the uploads directory.');
    }

    return absolutePath;
};

const toPublicUrl = (req, value) => {
    const normalizedValue = String(value || '').trim();

    if (!normalizedValue) {
        return '';
    }

    if (
        isAbsoluteUrl(normalizedValue) ||
        normalizedValue.startsWith('#') ||
        normalizedValue.startsWith('mailto:') ||
        normalizedValue.startsWith('tel:')
    ) {
        return normalizedValue;
    }

    const normalizedPath = normalizedValue.startsWith('/')
        ? normalizedValue
        : `/${normalizedValue.replace(/^\/+/, '')}`;

    if (!req) {
        return normalizedPath;
    }

    const forwardedProtocol = String(req.headers['x-forwarded-proto'] || '')
        .split(',')[0]
        .trim();
    const forwardedHost = String(req.headers['x-forwarded-host'] || '')
        .split(',')[0]
        .trim();
    const protocol = forwardedProtocol || req.protocol || 'http';
    const host = forwardedHost || req.get('host');

    if (!host) {
        return normalizedPath;
    }

    return `${protocol}://${host}${normalizedPath}`;
};

module.exports = {
    uploadsRoot,
    isAbsoluteUrl,
    removeFileIfExists,
    resolveFileUrlToPath,
    toPublicUrl
};
