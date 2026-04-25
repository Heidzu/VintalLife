import React, { useState } from 'react';
import { FormGroup, Label, Input, Button, Box, Text } from '@adminjs/design-system';

const PhotoNewEditor = (props) => {
    const { resource, onChange } = props;
    const [preview, setPreview] = useState('');

    const handleUrlChange = (e) => {
        const url = e.target.value;
        onChange('fileUrl', url);
        setPreview(url);
    };

    const handleTitleChange = (e) => {
        onChange('title', e.target.value);
    };

    const handleStyleChange = (e) => {
        onChange('style', e.target.value);
    };

    const handleDescriptionChange = (e) => {
        onChange('description', e.target.value);
    };

    return (
        <Box flex flexDirection="column" gap="xl">
            <FormGroup>
                <Label required>URL зображення</Label>
                <Input
                    type="url"
                    onChange={handleUrlChange}
                    placeholder="https://res.cloudinary.com/your-cloud/image/upload/..."
                    required
                />
                <Text mt="default">Вставте посилання на зображення з Cloudinary</Text>
            </FormGroup>

            {preview && (
                <FormGroup>
                    <Label>Попередній перегляд</Label>
                    <img
                        src={preview}
                        alt="Preview"
                        style={{
                            maxWidth: '300px',
                            maxHeight: '200px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '1px solid #ddd'
                        }}
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                </FormGroup>
            )}

            <FormGroup>
                <Label required>Назва</Label>
                <Input
                    type="text"
                    onChange={handleTitleChange}
                    placeholder="Кухня Арт Деко - варіант 1"
                    required
                />
            </FormGroup>

            <FormGroup>
                <Label required>Стиль кухні</Label>
                <Input
                    as="select"
                    onChange={handleStyleChange}
                    required
                >
                    <option value="">Оберіть стиль...</option>
                    <option value="art-deco">Арт Деко</option>
                    <option value="minimalism">Мінімалізм Хайтек</option>
                    <option value="loft">Лофт Індустріал</option>
                    <option value="neoclassic">Неокласика</option>
                    <option value="provance">Прованс Шеббі</option>
                    <option value="scandinavian">Скандинавський</option>
                </Input>
            </FormGroup>

            <FormGroup>
                <Label>Опис</Label>
                <Input
                    as="textarea"
                    onChange={handleDescriptionChange}
                    placeholder="Опис фотографії..."
                    style={{ minHeight: '80px' }}
                />
            </FormGroup>
        </Box>
    );
};

export default PhotoNewEditor;
