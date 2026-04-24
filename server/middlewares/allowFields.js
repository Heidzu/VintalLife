const ApiError = require('../utils/ApiError');

const allowFields = (allowedFields) => (req, _res, next) => {
    const requestKeys = Object.keys(req.body || {});
    const unexpectedFields = requestKeys.filter((key) => !allowedFields.includes(key));

    if (unexpectedFields.length > 0) {
        return next(
            new ApiError(
                400,
                `Unexpected fields received: ${unexpectedFields.join(', ')}`
            )
        );
    }

    return next();
};

module.exports = allowFields;