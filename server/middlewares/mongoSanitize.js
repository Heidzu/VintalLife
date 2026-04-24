const isPlainObject = (value) =>
    Object.prototype.toString.call(value) === '[object Object]';

const sanitizeObject = (value) => {
    if (Array.isArray(value)) {
        value.forEach(sanitizeObject);
        return;
    }

    if (!isPlainObject(value)) {
        return;
    }

    Object.keys(value).forEach((key) => {
        const sanitizedKey = key.replace(/\$/g, '').replace(/\./g, '_');
        const currentValue = value[key];

        if (sanitizedKey !== key) {
            delete value[key];
            value[sanitizedKey] = currentValue;
        }

        sanitizeObject(value[sanitizedKey]);
    });
};

const mongoSanitize = (req, _res, next) => {
    sanitizeObject(req.body);
    sanitizeObject(req.params);
    sanitizeObject(req.query);
    next();
};

module.exports = mongoSanitize;
