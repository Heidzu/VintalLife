import { useCallback, useEffect, useMemo, useState } from 'react';
import * as contentService from '../services/contentService';

const contentCache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

const getCachedValue = (cacheKey) => {
    const cached = contentCache.get(cacheKey);

    if (!cached) {
        return null;
    }

    if (Date.now() - cached.timestamp >= CACHE_TTL) {
        contentCache.delete(cacheKey);
        return null;
    }

    return cached.data;
};

const setCachedValue = (cacheKey, data) => {
    contentCache.set(cacheKey, {
        data,
        timestamp: Date.now()
    });
};

const buildLanguageKey = (language) => language || 'default';

export const useContent = (key, options = {}) => {
    const { language, enabled = true } = options;
    const [state, setState] = useState({
        data: null,
        loading: Boolean(enabled && key),
        error: null
    });

    const cacheKey = useMemo(
        () => `content:${key || 'empty'}:${buildLanguageKey(language)}`,
        [key, language]
    );

    const fetchContent = useCallback(async (force = false) => {
        if (!key || enabled === false) {
            setState({ data: null, loading: false, error: null });
            return null;
        }

        if (!force) {
            const cachedValue = getCachedValue(cacheKey);

            if (cachedValue !== null) {
                setState({ data: cachedValue, loading: false, error: null });
                return cachedValue;
            }
        }

        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const data = await contentService.fetchContentByKey(key, { language });
            setCachedValue(cacheKey, data);
            setState({ data, loading: false, error: null });
            return data;
        } catch (error) {
            setState({ data: null, loading: false, error: error.message });
            return null;
        }
    }, [cacheKey, enabled, key, language]);

    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    return {
        ...state,
        refetch: () => fetchContent(true)
    };
};

export const useMultipleContents = (keys = [], options = {}) => {
    const { language, enabled = true } = options;
    const stableKeys = useMemo(() => [...keys].filter(Boolean).sort(), [keys]);
    const [state, setState] = useState({
        data: {},
        loading: Boolean(enabled && stableKeys.length > 0),
        error: null
    });

    const cacheKey = useMemo(
        () => `contents:${stableKeys.join('|')}:${buildLanguageKey(language)}`,
        [stableKeys, language]
    );

    const fetchContents = useCallback(async (force = false) => {
        if (!stableKeys.length || enabled === false) {
            setState({ data: {}, loading: false, error: null });
            return {};
        }

        if (!force) {
            const cachedValue = getCachedValue(cacheKey);

            if (cachedValue !== null) {
                setState({ data: cachedValue, loading: false, error: null });
                return cachedValue;
            }
        }

        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const response = await contentService.fetchContentsByKeys(stableKeys, { language });
            const data = response.data || {};
            setCachedValue(cacheKey, data);
            setState({ data, loading: false, error: null });
            return data;
        } catch (error) {
            setState({ data: {}, loading: false, error: error.message });
            return {};
        }
    }, [cacheKey, enabled, language, stableKeys]);

    useEffect(() => {
        fetchContents();
    }, [fetchContents]);

    return {
        ...state,
        refetch: () => fetchContents(true)
    };
};

export const useContentByType = (type, options = {}) => {
    const { language, limit, enabled = true } = options;
    const [state, setState] = useState({
        data: [],
        loading: Boolean(enabled && type),
        error: null
    });

    const cacheKey = useMemo(
        () => `content-type:${type || 'empty'}:${buildLanguageKey(language)}:${limit || 'all'}`,
        [type, language, limit]
    );

    const fetchByType = useCallback(async (force = false) => {
        if (!type || enabled === false) {
            setState({ data: [], loading: false, error: null });
            return [];
        }

        if (!force) {
            const cachedValue = getCachedValue(cacheKey);

            if (cachedValue !== null) {
                setState({ data: cachedValue, loading: false, error: null });
                return cachedValue;
            }
        }

        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const response = await contentService.fetchContentByType(type, {
                language,
                limit,
                isActive: true
            });
            const data = response.data || [];
            setCachedValue(cacheKey, data);
            setState({ data, loading: false, error: null });
            return data;
        } catch (error) {
            setState({ data: [], loading: false, error: error.message });
            return [];
        }
    }, [cacheKey, enabled, language, limit, type]);

    useEffect(() => {
        fetchByType();
    }, [fetchByType]);

    return {
        ...state,
        refetch: () => fetchByType(true)
    };
};

export const clearContentCache = () => {
    contentCache.clear();
};

export const invalidateContentCache = (cacheKey) => {
    contentCache.delete(cacheKey);
};
