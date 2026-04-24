const Content = require('../models/Content');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { toPublicUrl } = require('../utils/fileManager');

const DEFAULT_LANGUAGE = String(process.env.DEFAULT_CONTENT_LANGUAGE || 'uk').trim().toLowerCase();

const toPlainMetadata = (metadata) => {
    if (!metadata) {
        return {};
    }

    if (metadata instanceof Map) {
        return Object.fromEntries(metadata.entries());
    }

    if (typeof metadata.toJSON === 'function') {
        return metadata.toJSON();
    }

    return { ...metadata };
};

const resolvePrimaryValue = (content, resolvedImageUrl, metadata) => {
    switch (content.kind) {
    case 'image':
        return resolvedImageUrl || content.content || '';
    case 'link':
        return content.buttonLink || content.content || '';
    case 'json':
        return metadata;
    default:
        return content.content || content.title || content.subtitle || resolvedImageUrl || '';
    }
};

const mapContentResponse = (content, req) => {
    const metadata = toPlainMetadata(content.metadata);
    const resolvedImageUrl = toPublicUrl(req, content.imageUrl);

    return {
        _id: content._id,
        key: content.key,
        section: content.section,
        type: content.type,
        kind: content.kind,
        title: content.title || '',
        content: content.content || '',
        subtitle: content.subtitle || '',
        buttonText: content.buttonText || '',
        buttonLink: content.buttonLink || '',
        imageUrl: resolvedImageUrl,
        rawImageUrl: content.imageUrl || '',
        imageAlt: content.imageAlt || '',
        metadata,
        value: resolvePrimaryValue(content, resolvedImageUrl, metadata),
        isActive: Boolean(content.isActive),
        position: Number(content.position || 0),
        language: content.language || DEFAULT_LANGUAGE,
        createdAt: content.createdAt,
        updatedAt: content.updatedAt
    };
};

const buildContentMap = (items, req) => {
    const result = {};

    items.forEach((item) => {
        result[item.key] = mapContentResponse(item, req);
    });

    return result;
};

const buildSectionMap = (mappedItems) => mappedItems.reduce((accumulator, item) => {
    if (!accumulator[item.section]) {
        accumulator[item.section] = {};
    }

    accumulator[item.section][item.key] = item;
    return accumulator;
}, {});

const normalizeKey = (value) => String(value || '').trim().toLowerCase();

const normalizeContentPayload = (payload = {}) => {
    const normalizedPayload = { ...payload };

    if (normalizedPayload.key) {
        normalizedPayload.key = normalizeKey(normalizedPayload.key);
    }

    if (normalizedPayload.section) {
        normalizedPayload.section = String(normalizedPayload.section).trim().toLowerCase();
    }

    if (normalizedPayload.type) {
        normalizedPayload.type = String(normalizedPayload.type).trim().toLowerCase();
    }

    if (normalizedPayload.kind) {
        normalizedPayload.kind = String(normalizedPayload.kind).trim().toLowerCase();
    }

    if (normalizedPayload.language) {
        normalizedPayload.language = String(normalizedPayload.language).trim().toLowerCase();
    }

    if (typeof normalizedPayload.metadata === 'string' && normalizedPayload.metadata.trim()) {
        normalizedPayload.metadata = JSON.parse(normalizedPayload.metadata);
    }

    return normalizedPayload;
};

const buildPublicFilter = (req) => {
    const {
        type,
        section,
        kind,
        language,
        isActive,
        includeInactive,
        allLanguages
    } = req.query;

    const filter = {};

    if (type) {
        filter.type = String(type).trim().toLowerCase();
    }

    if (section) {
        filter.section = String(section).trim().toLowerCase();
    }

    if (kind) {
        filter.kind = String(kind).trim().toLowerCase();
    }

    if (isActive !== undefined) {
        filter.isActive = isActive === 'true';
    } else if (includeInactive !== 'true') {
        filter.isActive = true;
    }

    if (allLanguages !== 'true') {
        filter.language = String(language || DEFAULT_LANGUAGE).trim().toLowerCase();
    }

    return filter;
};

const findContentWithLanguageFallback = async (key, language, includeInactive = false) => {
    const normalizedKey = normalizeKey(key);
    const normalizedLanguage = String(language || DEFAULT_LANGUAGE).trim().toLowerCase();
    const baseFilter = {
        key: normalizedKey,
        ...(includeInactive ? {} : { isActive: true })
    };

    let content = await Content.findOne({
        ...baseFilter,
        language: normalizedLanguage
    }).lean();

    if (!content && normalizedLanguage !== DEFAULT_LANGUAGE) {
        content = await Content.findOne({
            ...baseFilter,
            language: DEFAULT_LANGUAGE
        }).lean();
    }

    return content;
};

const getAllContent = asyncHandler(async (req, res) => {
    const {
        limit = 100,
        page = 1
    } = req.query;

    const filter = buildPublicFilter(req);
    const skip = (Number(page) - 1) * Number(limit);

    const content = await Content.find(filter)
        .sort({ section: 1, position: 1, updatedAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean();

    const total = await Content.countDocuments(filter);
    const mappedItems = content.map((item) => mapContentResponse(item, req));

    res.status(200).json({
        success: true,
        count: mappedItems.length,
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        data: mappedItems,
        byKey: Object.fromEntries(mappedItems.map((item) => [item.key, item])),
        bySection: buildSectionMap(mappedItems)
    });
});

const getContentByKey = asyncHandler(async (req, res) => {
    const { key } = req.params;
    const { language, includeInactive } = req.query;

    const content = await findContentWithLanguageFallback(key, language, includeInactive === 'true');

    if (!content) {
        throw new ApiError(404, `Content with key "${key}" not found.`);
    }

    res.status(200).json({
        success: true,
        data: mapContentResponse(content, req)
    });
});

const getContentsByKeys = asyncHandler(async (req, res) => {
    const { keys, language, includeInactive } = req.query;

    if (!keys) {
        throw new ApiError(400, 'Query parameter "keys" is required. Provide comma-separated keys.');
    }

    const keyArray = keys
        .split(',')
        .map(normalizeKey)
        .filter(Boolean);

    const requestedLanguage = String(language || DEFAULT_LANGUAGE).trim().toLowerCase();
    const activeFilter = includeInactive === 'true' ? {} : { isActive: true };

    const contents = await Content.find({
        key: { $in: keyArray },
        language: { $in: requestedLanguage === DEFAULT_LANGUAGE ? [DEFAULT_LANGUAGE] : [requestedLanguage, DEFAULT_LANGUAGE] },
        ...activeFilter
    })
        .sort({ position: 1, updatedAt: -1 })
        .lean();

    const groupedByKey = new Map();

    contents.forEach((content) => {
        if (!groupedByKey.has(content.key)) {
            groupedByKey.set(content.key, []);
        }

        groupedByKey.get(content.key).push(content);
    });

    const result = {};
    const missingKeys = [];

    keyArray.forEach((key) => {
        const matchingContent = groupedByKey.get(key) || [];
        const exactLanguageItem = matchingContent.find((item) => item.language === requestedLanguage);
        const fallbackLanguageItem = matchingContent.find((item) => item.language === DEFAULT_LANGUAGE);
        const contentItem = exactLanguageItem || fallbackLanguageItem;

        if (!contentItem) {
            missingKeys.push(key);
            return;
        }

        result[key] = mapContentResponse(contentItem, req);
    });

    res.status(200).json({
        success: true,
        data: result,
        missingKeys
    });
});

const createContent = asyncHandler(async (req, res) => {
    const payload = normalizeContentPayload(req.body);

    if (!payload.key) {
        throw new ApiError(400, 'Field "key" is required.');
    }

    const language = payload.language || DEFAULT_LANGUAGE;
    const existing = await Content.findOne({ key: payload.key, language }).lean();

    if (existing) {
        throw new ApiError(400, `Content with key "${payload.key}" already exists for language "${language}".`);
    }

    const newContent = await Content.create({
        ...payload,
        language
    });

    res.status(201).json({
        success: true,
        message: 'Content created successfully.',
        data: mapContentResponse(newContent.toObject(), req)
    });
});

const updateContent = asyncHandler(async (req, res) => {
    const key = normalizeKey(req.params.key);
    const payload = normalizeContentPayload(req.body);
    const language = String(req.query.language || payload.language || DEFAULT_LANGUAGE).trim().toLowerCase();

    if (payload.key && payload.key !== key) {
        throw new ApiError(400, 'Cannot change content key after creation.');
    }

    delete payload.key;

    const content = await Content.findOneAndUpdate(
        { key, language },
        { $set: payload },
        { new: true, runValidators: true }
    ).lean();

    if (!content) {
        throw new ApiError(404, `Content with key "${key}" and language "${language}" not found.`);
    }

    res.status(200).json({
        success: true,
        message: 'Content updated successfully.',
        data: mapContentResponse(content, req)
    });
});

const deleteContent = asyncHandler(async (req, res) => {
    const key = normalizeKey(req.params.key);
    const language = String(req.query.language || DEFAULT_LANGUAGE).trim().toLowerCase();

    const content = await Content.findOneAndDelete({ key, language });

    if (!content) {
        throw new ApiError(404, `Content with key "${key}" and language "${language}" not found.`);
    }

    res.status(200).json({
        success: true,
        message: 'Content deleted successfully.'
    });
});

const upsertContents = asyncHandler(async (req, res) => {
    const { contents } = req.body;

    if (!Array.isArray(contents) || contents.length === 0) {
        throw new ApiError(400, 'Request body must contain a non-empty "contents" array.');
    }

    const results = [];

    for (const item of contents) {
        const payload = normalizeContentPayload(item);

        if (!payload.key) {
            throw new ApiError(400, 'Each content item must include a "key".');
        }

        const language = payload.language || DEFAULT_LANGUAGE;
        const { key, ...updates } = payload;

        const result = await Content.findOneAndUpdate(
            { key, language },
            { $set: updates },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        ).lean();

        results.push(mapContentResponse(result, req));
    }

    res.status(200).json({
        success: true,
        message: `${results.length} content blocks processed.`,
        data: results,
        byKey: Object.fromEntries(results.map((item) => [item.key, item]))
    });
});

module.exports = {
    getAllContent,
    getContentByKey,
    getContentsByKeys,
    createContent,
    updateContent,
    deleteContent,
    upsertContents
};
