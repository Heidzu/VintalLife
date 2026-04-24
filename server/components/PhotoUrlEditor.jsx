import React from 'react';
import { FormGroup, Label, Input } from '@adminjs/design-system';

const PhotoUrlEditor = (props) => {
    const { property, record, onChange } = props;
    const value = record.params.fileUrl || '';

    const handleChange = (e) => {
        onChange(property.path, e.target.value);
    };

    return (
        <FormGroup>
            <Label>{property.label}</Label>
            <Input
                type="url"
                value={value}
                onChange={handleChange}
                placeholder="https://res.cloudinary.com/..."
                required={property.isRequired}
            />
            {value && (
                <div style={{ marginTop: '10px' }}>
                    <img 
                        src={value} 
                        alt="Preview" 
                        style={{ 
                            maxWidth: '200px', 
                            maxHeight: '150px', 
                            objectFit: 'cover',
                            borderRadius: '4px',
                            border: '1px solid #ddd'
                        }} 
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                </div>
            )}
        </FormGroup>
    );
};

export default PhotoUrlEditor;
