const mongoose = require('mongoose');

const KITCHEN_STYLES = {
    ART_DECO: 'art-deco',
    MINIMALISM: 'minimalism',
    LOFT: 'loft',
    NEOCLASSIC: 'neoclassic',
    PROVANCE: 'provance',
    SCANDINAVIAN: 'scandinavian'
};

const photoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 120
        },
        description: {
            type: String,
            trim: true,
            maxlength: 500,
            default: ''
        },
        category: {
            type: String,
            trim: true,
            maxlength: 80,
            default: 'general'
        },
        style: {
            type: String,
            enum: Object.values(KITCHEN_STYLES),
            required: true
        },
        fileUrl: {
            type: String,
            required: true,
            trim: true
        },
        fileName: {
            type: String,
            trim: true,
            default: ''
        },
        originalName: {
            type: String,
            trim: true,
            default: ''
        },
        mimeType: {
            type: String,
            trim: true,
            default: 'image/jpeg'
        },
        size: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

photoSchema.index({ style: 1, createdAt: -1 });

module.exports = mongoose.model('Photo', photoSchema);
module.exports.KITCHEN_STYLES = KITCHEN_STYLES;