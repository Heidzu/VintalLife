const mongoose = require('mongoose');

const CONTENT_TYPES = {
    HEADER: 'header',
    FIRST_SCREEN: 'first-screen',
    ADVANTAGES: 'advantages',
    CATALOG: 'catalog',
    PARTNERS: 'partners',
    LEAD_MAGNET: 'lead-magnet',
    INSTALLMENT: 'installment',
    CONTACT: 'contact',
    FOOTER: 'footer',
    HERO: 'hero',
    ABOUT: 'about',
    SERVICES: 'services',
    FEATURES: 'features',
    TESTIMONIALS: 'testimonials',
    CUSTOM: 'custom'
};

const CONTENT_SECTIONS = {
    GENERAL: 'general',
    HEADER: 'header',
    FIRST_SCREEN: 'first-screen',
    ADVANTAGES: 'advantages',
    CATALOG: 'catalog',
    PARTNERS: 'partners',
    LEAD_MAGNET: 'lead-magnet',
    INSTALLMENT: 'installment',
    CONTACT: 'contact',
    FOOTER: 'footer'
};

const CONTENT_KINDS = {
    TEXT: 'text',
    RICH_TEXT: 'rich-text',
    IMAGE: 'image',
    LINK: 'link',
    JSON: 'json'
};

const contentSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            match: /^[a-z0-9-]+$/,
            description: 'Stable frontend identifier.'
        },
        section: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            enum: Object.values(CONTENT_SECTIONS),
            default: CONTENT_SECTIONS.GENERAL,
            description: 'Visual section of the website.'
        },
        type: {
            type: String,
            enum: Object.values(CONTENT_TYPES),
            required: true,
            default: CONTENT_TYPES.CUSTOM,
            description: 'Logical content group.'
        },
        kind: {
            type: String,
            enum: Object.values(CONTENT_KINDS),
            required: true,
            default: CONTENT_KINDS.TEXT,
            description: 'Controls how the value is rendered on the frontend.'
        },
        title: {
            type: String,
            trim: true,
            maxlength: 200,
            default: '',
            description: 'Admin reference title or short label.'
        },
        content: {
            type: String,
            trim: true,
            default: '',
            description: 'Primary text or rich text value.'
        },
        subtitle: {
            type: String,
            trim: true,
            maxlength: 500,
            default: ''
        },
        buttonText: {
            type: String,
            trim: true,
            maxlength: 100,
            default: ''
        },
        buttonLink: {
            type: String,
            trim: true,
            maxlength: 500,
            default: ''
        },
        imageUrl: {
            type: String,
            trim: true,
            default: ''
        },
        imageAlt: {
            type: String,
            trim: true,
            maxlength: 200,
            default: ''
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: undefined,
            description: 'Additional structured data for complex sections.'
        },
        isActive: {
            type: Boolean,
            default: true,
            description: 'Whether this content block is publicly visible.'
        },
        position: {
            type: Number,
            min: 0,
            default: 0,
            description: 'Display order within section/type.'
        },
        language: {
            type: String,
            trim: true,
            lowercase: true,
            maxlength: 10,
            default: 'uk',
            description: 'Language code.'
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

contentSchema.pre('validate', async function syncSectionAndDefaults() {
    if (!this.section) {
        const normalizedType = String(this.type || '').trim().toLowerCase();
        const availableSections = Object.values(CONTENT_SECTIONS);

        this.section = availableSections.includes(normalizedType)
            ? normalizedType
            : CONTENT_SECTIONS.GENERAL;
    }

    if (!this.title) {
        this.title = this.key;
    }
});

contentSchema.index({ key: 1, language: 1 }, { unique: true });
contentSchema.index({ section: 1, language: 1, position: 1 });
contentSchema.index({ type: 1, position: 1 });
contentSchema.index({ isActive: 1 });

module.exports = mongoose.model('Content', contentSchema);
module.exports.CONTENT_TYPES = CONTENT_TYPES;
module.exports.CONTENT_SECTIONS = CONTENT_SECTIONS;
module.exports.CONTENT_KINDS = CONTENT_KINDS;
