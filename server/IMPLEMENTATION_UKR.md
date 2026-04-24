# Реалізація Управління Контентом Фронтенду через AdminJS

## План Реалізації

### 1. Модель Даних (Data Model)

**Файл**: `server/models/Content.js`

Схема MongoDB для зберігання динамічних блоків контенту:

```javascript
const ContentSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true }, // унікальний ідентифікатор
    type: { type: String, enum: ['hero', 'about', 'services', ...] }, // категорія
    title: String,           // назва для адмінки
    content: String,         // основний текст/HTML
    subtitle: String,        // підзаголовок
    buttonText: String,      // текст кнопки
    buttonLink: String,      // посилання кнопки
    imageUrl: String,        // URL зображення
    imageAlt: String,        // alt-текст зображення
    metadata: Map,           // JSON з додатковими даними
    isActive: { type: Boolean, default: true }, // активний/неактивний
    position: Number,        // порядок сортування
    language: { type: String, default: 'uk' }   // мова
}, { timestamps: true });
```

**Основні поля:**
- `key` - унікальний ідентифікатор, використовується у фронтенді (наприклад: 'hero-title', 'about-text')
- `type` - категорія блоку (герой, про нас, послуги, контакти)
- `content` - основний контент з підтримкою HTML
- `isActive` - перемикач публікації
- `position` - порядок відображення
- `language` - підтримка багатомовності

---

### 2. Конфігурація AdminJS

**Файл**: `server/config/adminjs.js`

Додаємо ресурс Content до панелі адміністрування:

```javascript
{
    resource: Content,
    options: {
        navigation: { name: 'Контент сайту', icon: 'FileText' },
        actions: { new: true, edit: true, delete: true },
        listProperties: ['key', 'title', 'type', 'isActive', 'language'],
        editProperties: [
            'key', 'type', 'title', 'content', 'subtitle',
            'buttonText', 'buttonLink', 'imageUrl', 'imageAlt',
            'metadata', 'isActive', 'position', 'language'
        ],
        properties: {
            key: {
                isRequired: true,
                description: 'Унікальний ідентифікатор для використання у коді'
            },
            type: {
                availableValues: [
                    { value: 'hero', label: 'Головний банер' },
                    { value: 'about', label: 'Про нас' },
                    { value: 'services', label: 'Послуги' },
                    // ... інші типи
                ]
            },
            content: { type: 'textarea', rows: 15 },
            metadata: { type: 'json' },
            isActive: { type: 'boolean', defaultValue: true }
        }
    }
}
```

**Кастомні компоненти для редагування:**

Для кращого редагування тексту можна додати Rich Text Editor:

```bash
npm install @adminjs/tinymce
```

```javascript
const AdminJSTinyMCE = await import('@adminjs/tinymce');
AdminJS.default.registerPlugin(AdminJSTinyMCE);

// У властивостях ресурсу:
properties: {
    content: {
        type: 'tinymce',
        editorOptions: {
            height: 400,
            menubar: false,
            plugins: ['link', 'lists', 'charmap', 'preview', 'fullscreen'],
            toolbar: 'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image media'
        }
    }
}
```

**Доступ до адмін-панелі:**
- URL: `http://localhost:5000/admin`
- Логін: `admin@vintallife.local`
- Пароль: `ChangeMe123!`

---

### 3. API Ендпоінти

**Файли:**
- `server/controllers/contentController.js`
- `server/routes/contentRoutes.js`

Реєструємо маршрути в `server/app.js`:
```javascript
app.use('/api/content', contentRoutes);
```

**Список ендпоінтів:**

| Метод | Шлях | Опис |
|--------|------|------|
| GET | `/api/content` | Отримати всі блоки (фільтрація: ?type, ?language, ?isActive) |
| GET | `/api/content/:key` | Отримати блок за ключем |
| GET | `/api/content/keys?keys=a,b,c` | Масовий запит за кількома ключами |
| POST | `/api/content` | Створити новий блок |
| PUT | `/api/content/:key` | Оновити блок |
| DELETE | `/api/content/:key` | Видалити блок |
| POST | `/api/content/upsert` | Масове створення/оновлення |

**Приклад відповіді:**
```json
{
    "success": true,
    "data": {
        "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
        "key": "hero-title",
        "type": "hero",
        "content": "АВТОРСЬКІ КУХНІ В ЛУЦЬКУ",
        "isActive": true,
        "language": "uk"
    }
}
```

---

### 4. Фронтенд Інтеграція

#### Структура фронтенду:
```
client/src/
├── services/
│   └── contentService.js    # API клієнт
├── hooks/
│   └── useContent.js        # React хуки
└── components/
    └── DynamicContentExample.js  # Приклади
```

#### Сервіс (`contentService.js`):

```javascript
// Базовий URL (проксується через CRA)
const API_BASE = '/api/content';

export const fetchContentByKey = async (key, options = {}) => {
    const params = new URLSearchParams();
    if (options.language) params.append('language', options.language);

    const response = await fetch(`${API_BASE}/${key}?${params}`);
    return response.json();
};

export const fetchMultipleContents = async (keys, options = {}) => {
    const params = new URLSearchParams();
    params.append('keys', keys.join(','));
    const response = await fetch(`${API_BASE}/keys?${params}`);
    return response.json();
};
```

#### Кастомні хуки (`useContent.js`):

```javascript
export const useContent = (key, options = {}) => {
    const [state, setState] = useState({ data: null, loading: true, error: null });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchContentByKey(key, options);
                setState({ data: result.data, loading: false, error: null });
            } catch (err) {
                setState({ data: null, loading: false, error: err.message });
            }
        };
        fetchData();
    }, [key]);

    return state;
};

export const useMultipleContents = (keys, options = {}) => {
    const [state, setState] = useState({ data: {}, loading: true, error: null });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchMultipleContents(keys, options);
                setState({ data: result.data, loading: false, error: null });
            } catch (err) {
                setState({ data: {}, loading: false, error: err.message });
            }
        };
        fetchData();
    }, [keys.join(',')]);

    return state;
};
```

#### Приклад використання в компоненті:

```javascript
import { useMultipleContents } from '../hooks/useContent';

function HeroSection() {
    const { data, loading } = useMultipleContents([
        'hero-title',
        'hero-subtitle',
        'hero-cta'
    ]);

    if (loading) return <div className="loader">Завантаження...</div>;

    return (
        <section className="hero">
            <h1>{data['hero-title']?.content}</h1>
            <p>{data['hero-subtitle']?.content}</p>
            <button>{data['hero-cta']?.content}</button>
        </section>
    );
}
```

---

### 5. Синхронізація та Кешування

#### Кеш на клієнті:

**Інвалідація кешу:**
- Кеш зберігається в пам'яті браузера
- TTL (Time To Live): 5 хвилин
- Після оновлення в AdminJS: кеш інвалідується при наступному запиті

**Функції для керування кешем:**
```javascript
import { clearContentCache, invalidateContentCache } from '../hooks/useContent';

// Очистити весь кеш (наприклад, при перемиканні мови)
clearContentCache();

// Інвалідувати конкретний ключ
invalidateContentCache('hero-title_uk');
```

**Примусове оновлення без кешу:**
```javascript
import { fetchContentByKey } from '../services/contentService';

const fresh = await fetchContentByKey('hero-title', { language: 'uk' });
```

**Ручна кнопка оновлення (тільки для розробки):**
```javascript
{process.env.NODE_ENV === 'development' && (
    <button onClick={() => window.location.reload()}>
        Оновити контент
    </button>
)}
```

---

### 6. Наповнення Початковими Даними

Створюємо скрипт для заповнення бази даних:

**Файл**: `server/scripts/seed-content.js`

```javascript
const mongoose = require('mongoose');
const Content = require('../models/Content');

const initialData = [
    {
        key: 'hero-title',
        type: 'hero',
        title: 'Головний заголовок героя',
        content: 'АВТОРСЬКІ КУХНІ В ЛУЦЬКУ',
        isActive: true,
        position: 1,
        language: 'uk'
    },
    {
        key: 'hero-subtitle',
        type: 'hero',
        title: 'Підзаголовок героя',
        content: 'Більше 1000 фото в каталозі',
        isActive: true,
        position: 2,
        language: 'uk'
    },
    {
        key: 'about-title',
        type: 'about',
        title: 'Заголовок про нас',
        content: 'Про нашу компанію',
        isActive: true,
        position: 1,
        language: 'uk'
    }
];

async function seed() {
    await mongoose.connect(process.env.MONGODB_URI);

    for (const item of initialData) {
        await Content.findOneAndUpdate(
            { key: item.key },
            { $set: item },
            { upsert: true, new: true }
        );
        console.log(`✓ Створено/оновлено: ${item.key}`);
    }

    console.log('✅ Сеїнг завершено!');
    process.exit(0);
}

seed().catch(err => {
    console.error('✗ Помилка:', err);
    process.exit(1);
});
```

Запуск: `node server/scripts/seed-content.js`

---

### 7. Підтримка Багатомовності

Створюємо окремі блоки для кожної мови:

```javascript
// Англійська версія
{
    key: 'hero-title',
    type: 'hero',
    language: 'en',
    content: 'AUTHOR KITCHENS IN LUTSK'
}

// Українська версія
{
    key: 'hero-title',
    type: 'hero',
    language: 'uk',
    content: 'АВТОРСЬКІ КУХНІ В ЛУЦЬКУ'
}
```

Запит з конкретною мовою:
```
GET /api/content/hero-title?language=en
```

Запит усієї мови:
```
GET /api/content?type=hero&language=uk
```

---

### 8. Хмарне Зберігання Зображень (Cloudinary)

Для зберігання зображень контенту рекомендується Cloudinary:

1. Реєстрація на Cloudinary.com
2. Встановлення пакетів:
   ```bash
   npm install cloudinary multer-storage-cloudinary
   ```
3. Налаштування в `.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```
4. Додати middleware для завантаження зображень в AdminJS

---

### 9. Практичні Приклади Використання

#### Приклад 1: Персоналізований Header

```javascript
import { useContent } from '../hooks/useContent';

function CustomHeader() {
    const { data: siteName } = useContent('site-name');
    const { data: logoUrl } = useContent('logo-url');

    return (
        <header>
            <img src={logoUrl?.content || '/default-logo.png'} alt="Логотип" />
            <h1>{siteName?.content || 'VintalLife'}</h1>
        </header>
    );
}
```

#### Приклад 2: Динамичні кнопки CTA

```javascript
import { useContentByType } from '../hooks/useContent';

function CTASection() {
    const { data: ctaBlocks } = useContentByType('cta', { limit: 3 });

    return (
        <div className="cta-container">
            {ctaBlocks.map(block => (
                <a
                    key={block._id}
                    href={block.buttonLink}
                    className="cta-button"
                >
                    {block.buttonText}
                </a>
            ))}
        </div>
    );
}
```

#### Приклад 3: Секція відгуків (testimonials)

```javascript
function TestimonialsSection() {
    const { data: testimonials } = useContentByType('testimonials', {
        language: 'uk',
        limit: 10
    });

    return (
        <section className="testimonials">
            <h2>Відгуки клієнтів</h2>
            {testimonials.map(item => (
                <div key={item._id} className="testimonial-card">
                    <div dangerouslySetInnerHTML={{ __html: item.content }} />
                    {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.imageAlt} />
                    )}
                </div>
            ))}
        </section>
    );
}
```

---

### 10. Переваги Реалізації

✅ **Гнучкість**: Додавайте/змінюйте контент без зміни коду фронтенду
✅ **Багатомовність**: Підтримка кількох мов через поле `language`
✅ **Верстатика**: HTML-контент дозволяє стилізувати як завгодно
✅ **Керування**: Всі зміни через зручний адмін-інтерфейс
✅ **Кешування**: Оптимізація продуктивності через клієнтський кеш
✅ **SEO-дружність**: Контент завантажується з сервера (SSR-ready)
✅ **Масштабованість**: Легко додати нові типи контенту

---

### 11. Можливі Проблеми та Рішення

**Проблема**: Контент не оновлюється після змін в адмінці
**Рішення**:
- Очистити кеш браузера
- Додати `?t=${Date.now()}` до URL для примусового оновлення
- Зменшити TTL кешу в `useContent.js`

**Проблема**: XSS-вразливість через HTML в контенті
**Рішення**:
- Використовувати `DOMPurify` на клієнті:
  ```javascript
  import DOMPurify from 'dompurify';
  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
  ```
- Або зберігати контент лише як текст (без HTML)

**Проблема**: Дублювання ключів
**Рішення**:
- Використовувати префікси (наприклад: `hero-`, `about-`, `services-`)
- Перевіряти унікальність при створенні

---

### 12. Розширення Функціоналу

#### a) Прев'ю контенту перед публікацією:
```javascript
// Додати поле previewMode у Content
// Коли previewMode=true, показувати на фронтенді незагальмований контент
```

#### b) Версіонування:
```javascript
// Створити модель ContentVersion
// Зберігати історію змін і можливість відкату
```

#### c) Сповіщення (Webhooks):
```javascript
// При оновленні контенту відправляти webhook на фронтенд
// Фронтенд слухає eventsource і оновлює кеш
```

#### d) Дерево контенту (ймовірність в майбутньому):
```javascript
// Додати parentId для ієрархії
// Створювати вкладені секції
```

---

### 13. Тестування

**Мануальне тестування:**
1. Створити блок через AdminJS
2. Перевірити відображення на фронтенді
3. Змінити контент → оновити сторінку → перевірити зміни

**Автоматичні тести (за потреби):**
```javascript
// server/tests/content.test.js
describe('Content API', () => {
    test('POST /api/content створює блок', async () => {
        const res = await request(app)
            .post('/api/content')
            .send({ key: 'test', content: 'Тест' });
        expect(res.status).toBe(201);
    });
});
```

---

### 14. Безпека

- ✅ Валідація вхідних даних (express-validator)
- ✅ Санітизація (sanitizeInput.js)
- ✅ XSS захист (DOMPurify на клієнті)
- ✅ Обмеження частоты запитів (rate-limit)
- ✅ Аутентифікація в AdminJS
- ✅ Обмеження доступу до `/admin` (IP whitelist у продакшені)

---

### 15. Документація Коду

**Коментарі українською:**
```javascript
/**
 * Отримує блок контенту за ключем
 * @param {string} key - Ключ блоку (наприклад, 'hero-title')
 * @param {Object} opts - Опції (language, enabled)
 * @returns {Promise<Object>} - Дані контенту
 */
```

**JSDoc теги:**
- `@param` - параметри функції
- `@returns` - що повертає
- `@example` - приклад використання

---

### Висновок

Реалізація дозволяє:
1. Керувати всьом контентом фронтенду через AdminJS
2. Відображати контент динамічно без перезборки фронтенду
3. Підтримувати кілька мов
4..Optimizuvati продуктивність через кешування
5. Легко розширювати новими типами контенту

**Необхідні дії для запуску:**

1. Створити модель `Content.js`
2. Додати контролер `contentController.js`
3. Додати маршрути `contentRoutes.js`
4. Підключити в `app.js`
5. Додати ресурс у `adminjs.js`
6. Перезапустити сервер
7. Створити перші блоки через адмін-панель або API
8. Використовувати хуки `useContent` у React компонентах

**Приклад швидкого старту:**
```bash
# 1. Створення моделі (вже зроблено)
# 2. Створення контенту через API:
curl -X POST http://localhost:5000/api/content \
  -H "Content-Type: application/json" \
  -d '{"key":"hero-title","type":"hero","content":"ЛАСКАВО ПРОСИМО"}'

# 3. Використання у фронтенді:
import { useContent } from './hooks/useContent';
const { data } = useContent('hero-title');
// В компоненті: <h1>{data?.content}</h1>
```
