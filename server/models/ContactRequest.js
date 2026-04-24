const mongoose = require('mongoose');

const contactRequestSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 80
        },
        phone: {
            type: String,
            required: true,
            trim: true,
            maxlength: 20
        },
        source: {
            type: String,
            enum: ['modal', 'lead-magnet', 'installment', 'contact', 'admin', 'other'],
            default: 'other'
        },
        message: {
            type: String,
            trim: true,
            maxlength: 500,
            default: ''
        },
        status: {
            type: String,
            enum: ['new', 'processing', 'completed'],
            default: 'new'
        },
        ipAddress: {
            type: String,
            default: ''
        },
        userAgent: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model('ContactRequest', contactRequestSchema);