import React, { useMemo, useState } from 'react';

const containerStyle = {
    maxWidth: '720px',
    padding: '24px'
};

const cardStyle = {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)'
};

const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    marginTop: '6px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px'
};

const labelStyle = {
    display: 'block',
    marginBottom: '14px',
    color: '#111827',
    fontWeight: 600
};

const helpTextStyle = {
    display: 'block',
    marginTop: '6px',
    color: '#6b7280',
    fontSize: '12px'
};

const previewImageStyle = {
    marginTop: '8px',
    maxWidth: '100%',
    maxHeight: '280px',
    objectFit: 'cover',
    borderRadius: '12px',
    border: '1px solid #e5e7eb'
};

const baseButtonStyle = {
    padding: '10px 18px',
    borderRadius: '999px',
    border: '1px solid #d1d5db',
    background: '#ffffff',
    cursor: 'pointer',
    fontWeight: 600
};

const activeButtonStyle = {
    ...baseButtonStyle,
    background: '#111827',
    borderColor: '#111827',
    color: '#ffffff'
};

const submitButtonStyle = {
    padding: '12px 20px',
    borderRadius: '999px',
    border: 'none',
    background: '#0f766e',
    color: '#ffffff',
    fontWeight: 700,
    cursor: 'pointer'
};

const messageStyles = {
    success: {
        padding: '10px 12px',
        borderRadius: '10px',
        background: '#ecfdf5',
        border: '1px solid #a7f3d0',
        color: '#065f46'
    },
    error: {
        padding: '10px 12px',
        borderRadius: '10px',
        background: '#fef2f2',
        border: '1px solid #fecaca',
        color: '#991b1b'
    }
};

const defaultFormData = {
    title: '',
    description: '',
    category: 'gallery',
    style: 'art-deco',
    fileUrl: ''
};

const PhotoNewAction = () => {
    const [mode, setMode] = useState('upload');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState(defaultFormData);
    const [selectedFile, setSelectedFile] = useState(null);

    const previewUrl = useMemo(() => {
        if (selectedFile) {
            return URL.createObjectURL(selectedFile);
        }

        return formData.fileUrl || '';
    }, [formData.fileUrl, selectedFile]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const resetForm = () => {
        setFormData(defaultFormData);
        setSelectedFile(null);
        setMode('upload');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            let response;

            if (mode === 'upload') {
                if (!selectedFile) {
                    throw new Error('Оберіть файл для завантаження.');
                }

                const payload = new FormData();
                payload.append('image', selectedFile);
                payload.append('title', formData.title);
                payload.append('description', formData.description);
                payload.append('category', formData.category);
                payload.append('style', formData.style);

                response = await fetch('/api/photos/upload', {
                    method: 'POST',
                    body: payload
                });
            } else {
                if (!formData.fileUrl.trim()) {
                    throw new Error('Вкажіть URL зображення.');
                }

                response = await fetch('/api/photos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
            }

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Не вдалося зберегти фото.');
            }

            setMessage({
                type: 'success',
                text: 'Фото успішно збережено. Переходжу до списку...'
            });
            resetForm();

            window.setTimeout(() => {
                window.location.href = '/admin/resources/Photo';
            }, 700);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={{ marginTop: 0, marginBottom: '8px' }}>Додати нове фото</h2>
                <p style={{ marginTop: 0, marginBottom: '20px', color: '#6b7280' }}>
                    Можна або завантажити файл у `server/uploads/photos`, або зберегти зовнішній URL.
                </p>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <button
                        type="button"
                        style={mode === 'upload' ? activeButtonStyle : baseButtonStyle}
                        onClick={() => setMode('upload')}
                    >
                        Локальний файл
                    </button>
                    <button
                        type="button"
                        style={mode === 'url' ? activeButtonStyle : baseButtonStyle}
                        onClick={() => {
                            setMode('url');
                            setSelectedFile(null);
                        }}
                    >
                        Зовнішній URL
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <label style={labelStyle}>
                        Назва
                        <input
                            type="text"
                            style={inputStyle}
                            value={formData.title}
                            onChange={(event) => handleChange('title', event.target.value)}
                            placeholder="Кухня Арт-деко - варіант 1"
                            required
                        />
                    </label>

                    <label style={labelStyle}>
                        Стиль кухні
                        <select
                            style={inputStyle}
                            value={formData.style}
                            onChange={(event) => handleChange('style', event.target.value)}
                            required
                        >
                            <option value="art-deco">Арт-деко</option>
                            <option value="minimalism">Мінімалізм / Хайтек</option>
                            <option value="loft">Лофт / Індустріал</option>
                            <option value="neoclassic">Неокласика</option>
                            <option value="provance">Прованс / Шеббі-шик</option>
                            <option value="scandinavian">Скандинавський</option>
                        </select>
                    </label>

                    <label style={labelStyle}>
                        Категорія
                        <input
                            type="text"
                            style={inputStyle}
                            value={formData.category}
                            onChange={(event) => handleChange('category', event.target.value)}
                            placeholder="gallery"
                        />
                    </label>

                    <label style={labelStyle}>
                        Опис
                        <textarea
                            style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }}
                            value={formData.description}
                            onChange={(event) => handleChange('description', event.target.value)}
                            placeholder="Короткий опис фото"
                        />
                    </label>

                    {mode === 'upload' ? (
                        <label style={labelStyle}>
                            Файл зображення
                            <input
                                type="file"
                                style={inputStyle}
                                accept=".jpg,.jpeg,.png,.webp"
                                onChange={(event) => {
                                    const nextFile = event.target.files?.[0] || null;
                                    setSelectedFile(nextFile);
                                }}
                                required
                            />
                            <span style={helpTextStyle}>
                                Підтримуються JPG, PNG та WEBP. Файл буде збережено у `server/uploads/photos/`.
                            </span>
                        </label>
                    ) : (
                        <label style={labelStyle}>
                            URL зображення
                            <input
                                type="url"
                                style={inputStyle}
                                value={formData.fileUrl}
                                onChange={(event) => handleChange('fileUrl', event.target.value)}
                                placeholder="https://example.com/photo.jpg"
                                required
                            />
                            <span style={helpTextStyle}>
                                Зовнішній URL також підтримується і зберігається напряму в базі.
                            </span>
                        </label>
                    )}

                    {previewUrl ? (
                        <div style={{ marginBottom: '18px' }}>
                            <div style={{ color: '#111827', fontWeight: 600, marginBottom: '6px' }}>
                                Попередній перегляд
                            </div>
                            <img src={previewUrl} alt="Preview" style={previewImageStyle} />
                        </div>
                    ) : null}

                    {message ? (
                        <div style={{ ...messageStyles[message.type], marginBottom: '16px' }}>
                            {message.text}
                        </div>
                    ) : null}

                    <button type="submit" style={submitButtonStyle} disabled={loading}>
                        {loading ? 'Зберігаю...' : 'Зберегти фото'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PhotoNewAction;
