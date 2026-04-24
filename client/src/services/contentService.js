const API_ROOT = (process.env.REACT_APP_API_URL || '/api').replace(/\/+$/, '');
const API_BASE = `${API_ROOT}/content`;

const buildQueryString = (filters = {}) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
        }
    });

    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
};

const requestJson = async (path, options = {}) => {
    const response = await fetch(`${API_BASE}${path}`, options);
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(payload.message || `Failed to fetch content (${response.status}).`);
    }

    return payload;
};

export const fetchAllContent = async (filters = {}) => requestJson(buildQueryString(filters));

export const fetchContentByKey = async (key, options = {}) => {
    const query = buildQueryString(options);
    const response = await fetch(`${API_BASE}/${encodeURIComponent(key)}${query}`);

    if (response.status === 404) {
        return null;
    }

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(payload.message || `Failed to fetch content "${key}".`);
    }

    return payload.data || null;
};

export const fetchContentsByKeys = async (keys = [], options = {}) => {
    const query = buildQueryString({
        ...options,
        keys: keys.join(',')
    });

    return requestJson(`/keys${query}`);
};

export const fetchContentByType = async (type, options = {}) => (
    fetchAllContent({ ...options, type })
);
