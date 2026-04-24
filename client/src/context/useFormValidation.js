import { useCallback, useMemo, useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

export const useFormValidation = ({ source = 'other', onSuccess, onError } = {}) => {
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [errors, setErrors] = useState({ name: false, phone: false });
    const [isCapsLock, setIsCapsLock] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const checkCapsLock = useCallback((event) => {
        setIsCapsLock(event.getModifierState('CapsLock'));
    }, []);

    const handleChange = useCallback((event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: false }));
    }, []);

    const resetForm = useCallback(() => {
        setFormData({ name: '', phone: '' });
        setErrors({ name: false, phone: false });
        setIsCapsLock(false);
        setIsSubmitting(false);
    }, []);

    const nameRegex = useMemo(() => /^[A-Za-zА-Яа-яІіЇїЄєҐґ'`\-\s]+$/u, []);
    const phoneRegex = useMemo(() => /^\+?[0-9]{10,15}$/, []);

    const validateForm = useCallback(() => {
        let isValid = true;
        const nextErrors = { name: false, phone: false };
        const trimmedName = formData.name.trim();
        const trimmedPhone = formData.phone.trim();
        const isAllUppercase = trimmedName !== '' && trimmedName === trimmedName.toUpperCase();

        if (!trimmedName) {
            nextErrors.name = true;
            isValid = false;
        }

        if (!trimmedPhone) {
            nextErrors.phone = true;
            isValid = false;
        }

        if (trimmedName && (!nameRegex.test(trimmedName) || isAllUppercase || trimmedName.length < 2)) {
            nextErrors.name = true;
            isValid = false;
        }

        if (trimmedPhone && !phoneRegex.test(trimmedPhone)) {
            nextErrors.phone = true;
            isValid = false;
        }

        setErrors(nextErrors);
        return isValid;
    }, [formData.name, formData.phone, nameRegex, phoneRegex]);

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            onError?.();
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_BASE_URL}/requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    phone: formData.phone.trim(),
                    source
                })
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || `Request failed with status ${response.status}`);
            }

            onSuccess?.();
            resetForm();
        } catch (error) {
            console.error('Failed to submit contact request:', error);
            onError?.(error);
            setIsSubmitting(false);
        }
    }, [formData.name, formData.phone, onError, onSuccess, resetForm, source, validateForm]);

    return {
        formData,
        errors,
        isCapsLock,
        isSubmitting,
        handleChange,
        checkCapsLock,
        handleSubmit,
        resetForm
    };
};
