# Управління Контентом Фронтенду через AdminJS

## Огляд
Цей документ описує, як керувати блоками контенту фронтенду (тексти, зображення, посилання) через адмін-панель AdminJS та відображати їх динамічно у React-додатку.

---

## 1. Модель Даних: Content

Місце: `server/models/Content.js`

Модель `Content` зберігає динамічні блоки контенту, які відображаються на фронтенді:

```javascript
{
  key: String,          // Унікальний ідентифікатор (наприклад, 'hero-title', 'about-section')
  type: String,         // Категорія: hero, about, services, contact, features тощо
  title: String,        // Назва для адмін-панелі (не відображається на сайті)
  content: String,      // Основний rich text/HTML контент
  subtitle: String,     // Додатковий підзаголовок
  buttonText: String,   // Текст кнопки Call-to-Action
  buttonLink: String,   // URL кнопки Call-to-Action
  imageUrl: String,     // URL зображення (необов'язково)
  imageAlt: String,     // Alt-текст зображення
  metadata: Map,        // Гнучкий JSON для додаткових даних
  isActive: Boolean,    // Опублікувати/зняти з публікації
  position: Number,     // Порядок відображення всередині категорії
  language: String,     // Код мови (uk, en, тощо)
  createdAt: Date,
  updatedAt: Date
}
```

---

## 2. Конфігурація AdminJS

### Реєстрація Ресурсу
Місце: `server/config/adminjs.js`

Ресурс `Content` зареєстрований з кастомними налаштуваннями полів:

- **Key**: Унікальний ідентифікатор, який використовується у коді фронтенду
- **Type**: Випадаючий список з поперед визначеними категоріями
- **Content**: Велике поле textarea для rich text (підтримує HTML)
- **Metadata**: Поле JSON для структурованих даних
- **isActive**: Перемикач для публікації/зняття
- **position**: Число для впорядкування

### Доступ до Адмін-Панелі
URL: `http://localhost:5000/admin`
Логін за замовчуванням: admin@vintallife.local / ChangeMe123!

---

## 3. Rich Text Editor (Опціонально)

Для кращого досвіду редагування встановіть плагін rich text editor:

### Варіант A: Інтеграція TinyMCE

```bash
npm install @adminjs/tinymce
```

Далі в `adminjs.js`:

```javascript
const AdminJSTinyMCE = await import('@adminjs/tinymce');

// Реєстрація плагіну
AdminJS.default.registerPlugin(AdminJSTinyMCE);

// У налаштуваннях ресурсу Content змініть поле content:
properties: {
    content: {
        type: 'tinymce',
        editorOptions: {
            height: 400,
            menubar: false,
            plugins: ['link', 'lists', 'charmap', 'preview'],
            toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | link'
        }
    }
}
```

### Варіант B: Quill Editor

```bash
npm install @adminjs/quill
```

Зв'яжіться з розробником для сумісності з AdminJS v7.

---

## 4. API Ендпоінти

Місце: `server/routes/contentRoutes.js`

| Метод | Ендпоінт | Опис |
|--------|----------|------|
| GET | `/api/content` | Список всього контенту (підтримує ?type, ?language, ?isActive, ?page, ?limit) |
| GET | `/api/content/:key` | Отримати блок контенту за ключем |
| GET | `/api/content/keys?keys=key1,key2` | Отримати кілька блоків за ключами |
| POST | `/api/content` | Створити новий блок контенту |
| PUT | `/api/content/:key` | Оновити блок контенту |
| DELETE | `/api/content/:key` | Видалити блок контенту |
| POST | `/api/content/upsert` | Масове створення/оновлення (корисно для заповнення) |

---

## 5. Інтеграція з Фронтендом

### Налаштування

Створені файли:
- `client/src/services/contentService.js` - API клієнт
- `client/src/hooks/useContent.js` - React хуки
- `client/src/components/DynamicContentExample.js` - Приклади використання

### Приклади Використання

#### Одиночний блок контенту:
```javascript
import { useContent } from '../hooks/useContent';

function MyComponent() {
    const { data: heroContent, loading, error } = useContent('hero-title', {
        language: 'uk'
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error</div>;

    return <h1>{heroContent?.content}</h1>;
}
```

#### Кілька блоків (паралельний запит):
```javascript
import { useMultipleContents } from '../hooks/useContent';

function Page() {
    const keys = ['hero-title', 'hero-subtitle', 'hero-cta'];
    const { data, loading } = useMultipleContents(keys);

    // data = { 'hero-title': {...}, 'hero-subtitle': {...}, ... }
}
```

#### Отримання за типом:
```javascript
import { useContentByType } from '../hooks/useContent';

function Features() {
    const { data: features } = useContentByType('features', {
        limit: 10,
        language: 'uk'
    });

    return (
        <div>
            {features.map(f => (
                <div key={f._id}>{f.content}</div>
            ))}
        </div>
    );
}
```

---

## 6. Інвалідація Кешу та Синхронізація

### Кеш на Стороні Клієнта
- Контент кешується в пам'яті на **5 хвилин**
- Автоматичне пропускання кешу після закінчення TTL
- Ручне оновлення через функцію `refetch()`

### Ручне Оновлення
Додайте кнопку оновлення в режимі розробки:

```javascript
import { useContent, clearContentCache } from '../hooks/useContent';

function Page() {
    const { data, refetch } = useContent('hero-title');

    return (
        <>
            <h1>{data?.content}</h1>
            {process.env.NODE_ENV === 'development' && (
                <button onClick={refetch}>Оновити Контент</button>
            )}
        </>
    );
}
```

### Примусове Оновлення Без Кешу
Пропустити кеш за потреби:

```javascript
import { fetchContentByKey } from '../services/contentService';

// Прямий запит (без кешу)
const freshData = await fetchContentByKey('hero-title', { language: 'uk' });
```

### Розгляди для Продакшену
- Деплой бекенду (Node.js + MongoDB)
- Встановити `NODE_ENV=production`
- AdminJS доступний за `/admin` (розгляньте IP whitelist або VPN)
- Фронтенд автоматично оновлюється при кожному завантаженні сторінки (TTL кешу регулює частоту)

---

## 7. Додавання Початкового Контенту

Використовуйте ендпоінт upsert для створення початкових блоків контенту:

```javascript
// server/scripts/seed-content.js
const axios = require('axios');

const initialContent = [
    {
        key: 'hero-title',
        type: 'hero',
        title: 'Головний заголовок',
        content: 'АВТОРСЬКІ КУХНІ В ЛУЦЬКУ',
        isActive: true,
        position: 1,
        language: 'uk'
    },
    {
        key: 'hero-subtitle',
        type: 'hero',
        title: 'Головний підзаголовок',
        content: 'Більше 1000 фото в каталозі',
        isActive: true,
        position: 2,
        language: 'uk'
    },
    // ... ще блоки
];

module.exports = async () => {
    const response = await axios.post('http://localhost:5000/api/content/upsert', {
        contents: initialContent
    });
    console.log(response.data);
};
```

Запуск: `node server/scripts/seed-content.js`

---

## 8. Важливі Примітки

### Ключі Контенту
- Використовуйте lowercase, тільки дефіси (наприклад, `about-section`, `contact-phone`)
- Ключі є **Незмінними** після створення (поле key доступне лише для читання при редагуванні в AdminJS)
- Послідовно посилайтеся на ключі у коді фронтенду

### Безпека Rich Text
- Поле content AdminJS приймає HTML
- Санітизуйте контент перед відображенням (XSS захист)
- Бекенд санітизує вхідні дані через `sanitizeInput.js`

### Поле Metadata
Використовуйте `metadata` для гнучких структурованих даних:

```json
{
  "ctaButtons": [
    { "text": "Замірити", "link": "#contact" },
    { "text": "Каталог", "link": "#catalog" }
  ],
  "layout": "fullwidth",
  "backgroundColor": "#f5f5f5"
}
```

Доступ у фронтенді: `content.metadata.ctaButtons`

### Підтримка Мов
- Створюйте окремі блоки контенту для кожної мови
- Фільтрація за `?language=uk` або `?language=en`
- Мова за замовчуванням: 'uk'

---

## 9. Усунення Несправностей

**Контент не відображається у фронтенді:**
- Перевірте, що `isActive` встановлено в true
- Переконайтеся, що `key` збігається точно (регістрозалежний у API)
- Перевірте консоль браузера на наявність помилок CORS
- Переконайтеся, що proxy працює на порту 5000

**AdminJS не показує ресурс Content:**
- Перезапустіть сервер після створення моделі
- Перевірте підключення Mongoose
- Перевірте шляхи файлів у adminjs.js

**Проблеми з кешем:**
- Викличіть `clearContentCache()` з консолі браузера
- Додайте `?t=${Date.now()}` до URL API для кеш-баста
- Зменшіть TTL у `client/src/hooks/useContent.js`

---

## 10. Наступні Кроки

- Встановити плагін rich text editor (@adminjs/tinymce або @adminjs/ckeditor)
- Налаштувати завантаження зображень через Cloudinary для зображень контенту
- Додати попередній перегляд контенту в AdminJS перед публікацією
- Реалізувати webhook сповіщення для реальночасів оновлення кешу
- Додати версіонування/історію контенту
