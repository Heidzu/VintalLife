const { validationResult } = require('express-validator');

const ApiError = require('../utils/ApiError');
const { removeFileIfExists } = require('../utils/fileManager');

const validateRequest = async (req, _res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    if (req.file?.path) {
        await removeFileIfExists(req.file.path);
    }

    return next(new ApiError(400, 'Validation failed.', errors.array()));
};

module.exports = validateRequest;