const path = require('path');

const ContactRequest = require('../models/ContactRequest');
const Photo = require('../models/Photo');
const Content = require('../models/Content');
const { KITCHEN_STYLES } = require('../models/Photo');
const { CONTENT_TYPES, CONTENT_SECTIONS, CONTENT_KINDS } = require('../models/Content');

const ADMIN_ROOT_PATH = '/admin';

const KITCHEN_STYLE_LABELS = {
    [KITCHEN_STYLES.ART_DECO]: 'Арт-деко',
    [KITCHEN_STYLES.MINIMALISM]: 'Мінімалізм / Хайтек',
    [KITCHEN_STYLES.LOFT]: 'Лофт / Індустріал',
    [KITCHEN_STYLES.NEOCLASSIC]: 'Неокласика',
    [KITCHEN_STYLES.PROVANCE]: 'Прованс / Шеббі-шик',
    [KITCHEN_STYLES.SCANDINAVIAN]: 'Скандинавський'
};

const CONTENT_TYPE_LABELS = {
    [CONTENT_TYPES.HEADER]: 'Header',
    [CONTENT_TYPES.FIRST_SCREEN]: 'First Screen',
    [CONTENT_TYPES.ADVANTAGES]: 'Advantages',
    [CONTENT_TYPES.CATALOG]: 'Catalog',
    [CONTENT_TYPES.PARTNERS]: 'Partners',
    [CONTENT_TYPES.LEAD_MAGNET]: 'Lead Magnet',
    [CONTENT_TYPES.INSTALLMENT]: 'Installment',
    [CONTENT_TYPES.CONTACT]: 'Contact',
    [CONTENT_TYPES.FOOTER]: 'Footer',
    [CONTENT_TYPES.HERO]: 'Hero',
    [CONTENT_TYPES.ABOUT]: 'About',
    [CONTENT_TYPES.SERVICES]: 'Services',
    [CONTENT_TYPES.FEATURES]: 'Features',
    [CONTENT_TYPES.TESTIMONIALS]: 'Testimonials',
    [CONTENT_TYPES.CUSTOM]: 'Custom'
};

const CONTENT_SECTION_LABELS = {
    [CONTENT_SECTIONS.GENERAL]: 'General',
    [CONTENT_SECTIONS.HEADER]: 'Header',
    [CONTENT_SECTIONS.FIRST_SCREEN]: 'First Screen',
    [CONTENT_SECTIONS.ADVANTAGES]: 'Advantages',
    [CONTENT_SECTIONS.CATALOG]: 'Catalog',
    [CONTENT_SECTIONS.PARTNERS]: 'Partners',
    [CONTENT_SECTIONS.LEAD_MAGNET]: 'Lead Magnet',
    [CONTENT_SECTIONS.INSTALLMENT]: 'Installment',
    [CONTENT_SECTIONS.CONTACT]: 'Contact',
    [CONTENT_SECTIONS.FOOTER]: 'Footer'
};

const CONTENT_KIND_LABELS = {
    [CONTENT_KINDS.TEXT]: 'Text',
    [CONTENT_KINDS.RICH_TEXT]: 'Rich text',
    [CONTENT_KINDS.IMAGE]: 'Image',
    [CONTENT_KINDS.LINK]: 'Link',
    [CONTENT_KINDS.JSON]: 'JSON'
};

const buildAdminPanel = async () => {
    const { default: AdminJS, ComponentLoader } = await import('adminjs');
    const AdminJSExpress = await import('@adminjs/express');
    const AdminJSMongoose = await import('@adminjs/mongoose');
    const session = require('express-session');
    const MongoDBStore = require('connect-mongodb-session')(session);

    AdminJS.registerAdapter({
        Database: AdminJSMongoose.Database,
        Resource: AdminJSMongoose.Resource
    });

    const componentLoader = new ComponentLoader();
    const components = {
        PhotoNewAction: componentLoader.add('PhotoNewAction', path.join(__dirname, '..', 'components', 'PhotoNewAction')),
        PhotoUrlEditor: componentLoader.add('PhotoUrlEditor', path.join(__dirname, '..', 'components', 'PhotoUrlEditor')),
        PhotoNewEditor: componentLoader.add('PhotoNewEditor', path.join(__dirname, '..', 'components', 'PhotoNewEditor'))
    };

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@vintallife.local';
    const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
    const cookieSecret = process.env.ADMIN_COOKIE_SECRET || 'vintallife-admin-secret-change-me';
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vintallife';

    const store = new MongoDBStore({
        uri: mongoUri,
        collection: 'admin_sessions'
    });

    store.on('error', (error) => {
        console.error('Session store error:', error);
    });

    const adminJs = new AdminJS({
        rootPath: ADMIN_ROOT_PATH,
        componentLoader,
        branding: {
            companyName: 'VintalLife Admin',
            favicon: '/favicon.ico',
            withMadeWithLove: false,
            softwareBrothers: false
        },
        resources: [
            {
                resource: ContactRequest,
                options: {
                    navigation: { name: 'CRM', icon: 'User' },
                    sort: {
                        sortBy: 'createdAt',
                        direction: 'desc'
                    },
                    actions: {
                        new: { isAccessible: false }
                    },
                    listProperties: ['name', 'phone', 'source', 'status', 'createdAt'],
                    filterProperties: ['name', 'phone', 'source', 'status', 'createdAt'],
                    editProperties: ['name', 'phone', 'source', 'message', 'status'],
                    showProperties: [
                        'name',
                        'phone',
                        'source',
                        'message',
                        'status',
                        'ipAddress',
                        'userAgent',
                        'createdAt',
                        'updatedAt'
                    ],
                    properties: {
                        _id: { isVisible: { list: false, filter: false, show: true, edit: false } },
                        createdAt: { isVisible: { list: true, filter: true, show: true, edit: false } },
                        updatedAt: { isVisible: { list: false, filter: false, show: true, edit: false } },
                        ipAddress: { isVisible: { list: false, filter: false, show: true, edit: false } },
                        userAgent: { isVisible: { list: false, filter: false, show: true, edit: false } }
                    }
                }
            },
            {
                resource: Photo,
                options: {
                    navigation: { name: 'Галерея', icon: 'Camera' },
                    sort: {
                        sortBy: 'createdAt',
                        direction: 'desc'
                    },
                    actions: {
                        new: {
                            isAccessible: true,
                            component: components.PhotoNewAction
                        },
                        edit: { isAccessible: true },
                        delete: { isAccessible: true },
                        bulkDelete: { isAccessible: true }
                    },
                    listProperties: ['title', 'style', 'fileUrl', 'createdAt'],
                    filterProperties: ['title', 'style', 'category', 'createdAt'],
                    editProperties: ['title', 'description', 'category', 'style', 'fileUrl'],
                    showProperties: [
                        'title',
                        'description',
                        'category',
                        'style',
                        'fileUrl',
                        'createdAt',
                        'updatedAt'
                    ],
                    properties: {
                        _id: { isVisible: { list: false, filter: false, show: false, edit: false } },
                        title: {
                            isRequired: true,
                            position: 1
                        },
                        description: {
                            type: 'textarea',
                            position: 2
                        },
                        category: {
                            position: 3
                        },
                        style: {
                            isRequired: true,
                            position: 4,
                            availableValues: Object.entries(KITCHEN_STYLE_LABELS).map(([value, label]) => ({
                                value,
                                label
                            }))
                        },
                        fileUrl: {
                            isRequired: true,
                            position: 5,
                            description: 'Може бути URL або локальний шлях /uploads/photos/...',
                            components: {
                                edit: components.PhotoUrlEditor
                            }
                        },
                        fileName: { isVisible: false },
                        originalName: { isVisible: false },
                        mimeType: { isVisible: false },
                        size: { isVisible: false },
                        createdAt: { isVisible: { list: true, filter: true, show: true, edit: false } },
                        updatedAt: { isVisible: { list: false, filter: false, show: true, edit: false } }
                    }
                }
            },
            {
                resource: Content,
                options: {
                    navigation: { name: 'Контент сайту', icon: 'FileText' },
                    sort: {
                        sortBy: 'updatedAt',
                        direction: 'desc'
                    },
                    actions: {
                        new: { isAccessible: true },
                        edit: { isAccessible: true },
                        delete: { isAccessible: true },
                        bulkDelete: { isAccessible: false }
                    },
                    listProperties: ['section', 'key', 'title', 'kind', 'isActive', 'language', 'updatedAt'],
                    filterProperties: ['section', 'type', 'kind', 'key', 'title', 'isActive', 'language'],
                    editProperties: [
                        'section',
                        'type',
                        'kind',
                        'key',
                        'title',
                        'content',
                        'subtitle',
                        'buttonText',
                        'buttonLink',
                        'imageUrl',
                        'imageAlt',
                        'metadata',
                        'isActive',
                        'position',
                        'language'
                    ],
                    showProperties: [
                        'section',
                        'type',
                        'kind',
                        'key',
                        'title',
                        'content',
                        'subtitle',
                        'buttonText',
                        'buttonLink',
                        'imageUrl',
                        'imageAlt',
                        'metadata',
                        'isActive',
                        'position',
                        'language',
                        'createdAt',
                        'updatedAt'
                    ],
                    properties: {
                        _id: { isVisible: false },
                        section: {
                            isRequired: true,
                            position: 1,
                            availableValues: Object.entries(CONTENT_SECTION_LABELS).map(([value, label]) => ({
                                value,
                                label
                            })),
                            description: 'Виберіть секцію сайту, де використовується цей блок.'
                        },
                        type: {
                            isRequired: true,
                            position: 2,
                            availableValues: Object.entries(CONTENT_TYPE_LABELS).map(([value, label]) => ({
                                value,
                                label
                            })),
                            description: 'Логічна група для фільтрації та API.'
                        },
                        kind: {
                            isRequired: true,
                            position: 3,
                            availableValues: Object.entries(CONTENT_KIND_LABELS).map(([value, label]) => ({
                                value,
                                label
                            })),
                            description: 'Підказка фронтенду, як рендерити значення.'
                        },
                        key: {
                            isRequired: true,
                            position: 4,
                            description: 'Стабільний ключ для фронтенду, наприклад first-screen-title-line-1.'
                        },
                        title: {
                            position: 5,
                            description: 'Назва для адміністрування.'
                        },
                        content: {
                            type: 'textarea',
                            position: 6,
                            rows: 12,
                            description: 'Основний текст або rich text. Для зображень поле можна залишити порожнім.'
                        },
                        subtitle: {
                            position: 7
                        },
                        buttonText: {
                            position: 8
                        },
                        buttonLink: {
                            position: 9,
                            description: 'Підтримуються абсолютні URL, /path, #anchor, tel:, mailto:.'
                        },
                        imageUrl: {
                            position: 10,
                            description: 'URL або локальний шлях /uploads/photos/...'
                        },
                        imageAlt: {
                            position: 11
                        },
                        metadata: {
                            position: 12,
                            description: 'Обʼєкт JSON для складних структур.'
                        },
                        isActive: {
                            type: 'boolean',
                            position: 13,
                            defaultValue: true
                        },
                        position: {
                            type: 'number',
                            position: 14,
                            defaultValue: 0
                        },
                        language: {
                            position: 15,
                            availableValues: [
                                { value: 'uk', label: 'Українська' },
                                { value: 'en', label: 'English' }
                            ],
                            defaultValue: 'uk'
                        },
                        createdAt: { isVisible: { list: false, filter: true, show: true, edit: false } },
                        updatedAt: { isVisible: { list: true, filter: false, show: true, edit: false } }
                    }
                }
            }
        ],
        locale: {
            translations: {
                labels: {
                    ContactRequest: 'Заявки',
                    Photo: 'Фотографії кухонь',
                    Content: 'Контент сайту'
                }
            }
        }
    });

    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
        adminJs,
        {
            authenticate: async (email, password) => {
                if (email === adminEmail && password === adminPassword) {
                    return { email };
                }

                return null;
            },
            cookieName: 'vintallife-admin',
            cookiePassword: cookieSecret
        },
        null,
        {
            resave: false,
            saveUninitialized: false,
            secret: cookieSecret,
            store: store,
            cookie: {
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 8
            }
        }
    );

    return {
        adminJs,
        adminRouter
    };
};

module.exports = {
    buildAdminPanel,
    ADMIN_ROOT_PATH
};
