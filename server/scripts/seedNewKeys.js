const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Content = require('../models/Content');
const { CONTENT_TYPES, CONTENT_SECTIONS, CONTENT_KINDS } = require('../models/Content');

const NEW_CONTENT_BLOCKS = [
    // Catalog Main Titles
    {
        key: 'catalog-title',
        section: CONTENT_SECTIONS.CATALOG,
        type: CONTENT_TYPES.CATALOG,
        kind: CONTENT_KINDS.TEXT,
        title: 'Каталог: Головний заголовок секції',
        content: 'КАТАЛОГ КУХОНЬ ПО СТИЛЯМ',
        language: 'uk',
        position: 1
    },
    {
        key: 'catalog-button-text',
        section: CONTENT_SECTIONS.CATALOG,
        type: CONTENT_TYPES.CATALOG,
        kind: CONTENT_KINDS.TEXT,
        title: 'Каталог: Текст на кнопках карток',
        content: 'Переглянути фото',
        language: 'uk',
        position: 2
    },

    // Individual Catalog Cards (Stable paths from public folder)
    {
        key: 'catalog-item-art-deco',
        section: CONTENT_SECTIONS.CATALOG,
        type: CONTENT_TYPES.CATALOG,
        kind: CONTENT_KINDS.TEXT,
        title: 'АРТ ДЕКО',
        content: 'від 40 000 грн',
        imageUrl: 'images/photo-kitchen/3.jpg',
        metadata: { style: 'art-deco' },
        language: 'uk',
        position: 10
    },
    {
        key: 'catalog-item-minimalism',
        section: CONTENT_SECTIONS.CATALOG,
        type: CONTENT_TYPES.CATALOG,
        kind: CONTENT_KINDS.TEXT,
        title: 'М<span>I</span>Н<span>I</span>МАЛ<span>I</span>ЗМ ХАЙТЕК МОДЕРН',
        content: 'від 40 000 грн',
        imageUrl: 'images/photo-kitchen/4.jpg',
        metadata: { style: 'minimalism' },
        language: 'uk',
        position: 20
    },
    {
        key: 'catalog-item-loft',
        section: CONTENT_SECTIONS.CATALOG,
        type: CONTENT_TYPES.CATALOG,
        kind: CONTENT_KINDS.TEXT,
        title: 'ЛОФТ <span>I</span>НДАСТР<span>I</span>АЛ',
        content: 'від 40 000 грн',
        imageUrl: 'images/photo-kitchen/5.jpg',
        metadata: { style: 'loft' },
        language: 'uk',
        position: 30
    },
    {
        key: 'catalog-item-neoclassic',
        section: CONTENT_SECTIONS.CATALOG,
        type: CONTENT_TYPES.CATALOG,
        kind: CONTENT_KINDS.TEXT,
        title: 'НЕОКЛАСИКА',
        content: 'від 40 000 грн',
        imageUrl: 'images/photo-kitchen/6.jpg',
        metadata: { style: 'neoclassic' },
        language: 'uk',
        position: 40
    },
    {
        key: 'catalog-item-provance',
        section: CONTENT_SECTIONS.CATALOG,
        type: CONTENT_TYPES.CATALOG,
        kind: CONTENT_KINDS.TEXT,
        title: 'ПРОВАНС ШЕБ<span>I</span> ШИК КАНТР<span>I</span>',
        content: 'від 40 000 грн',
        imageUrl: 'images/photo-kitchen/7.jpg',
        metadata: { style: 'provance' },
        language: 'uk',
        position: 50
    },
    {
        key: 'catalog-item-scandinavian',
        section: CONTENT_SECTIONS.CATALOG,
        type: CONTENT_TYPES.CATALOG,
        kind: CONTENT_KINDS.TEXT,
        title: 'СКАНДИНАВСЬКИЙ',
        content: 'від 40 000 грн',
        imageUrl: 'images/photo-kitchen/8.jpg',
        metadata: { style: 'scandinavian' },
        language: 'uk',
        position: 60
    },

    // Lead Magnet
    {
        key: 'lead-magnet-image',
        section: CONTENT_SECTIONS.LEAD_MAGNET,
        type: CONTENT_TYPES.LEAD_MAGNET,
        kind: CONTENT_KINDS.IMAGE,
        title: 'Lead Magnet: Основне зображення',
        imageUrl: 'images/photo-kitchen/9.png',
        language: 'uk',
        position: 5
    },

    // Installment
    {
        key: 'installment-image-1',
        section: CONTENT_SECTIONS.INSTALLMENT,
        type: CONTENT_TYPES.INSTALLMENT,
        kind: CONTENT_KINDS.IMAGE,
        title: 'Розстрочка: Фото 1 (мале зліва)',
        imageUrl: 'images/photo-kitchen/11.png',
        language: 'uk',
        position: 6
    },
    {
        key: 'installment-image-2',
        section: CONTENT_SECTIONS.INSTALLMENT,
        type: CONTENT_TYPES.INSTALLMENT,
        kind: CONTENT_KINDS.IMAGE,
        title: 'Розстрочка: Фото 2 (мале зліва знизу)',
        imageUrl: 'images/photo-kitchen/11.jpg',
        language: 'uk',
        position: 7
    },
    {
        key: 'installment-image-3',
        section: CONTENT_SECTIONS.INSTALLMENT,
        type: CONTENT_TYPES.INSTALLMENT,
        kind: CONTENT_KINDS.IMAGE,
        title: 'Розстрочка: Фото 3 (велике справа)',
        imageUrl: 'images/photo-kitchen/12.png',
        language: 'uk',
        position: 8
    }
];

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        for (const block of NEW_CONTENT_BLOCKS) {
            await Content.findOneAndUpdate(
                { key: block.key, language: block.language },
                { $set: block },
                { upsert: true, returnDocument: 'after' }
            );
            console.log(`Synced key: ${block.key} with stable path: ${block.imageUrl || block.content}`);
        }

        console.log('Seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
