# VintalLife

Веб-сайт для виробництва авторських кухонь на замовлення в Луцьку.

## Технології

- **Frontend:** React 19, Bootstrap 5, Swiper
- **Backend:** Node.js, Express, MongoDB, AdminJS
- **Адмін-панель:** AdminJS для керування контентом, заявками, галереєю

## Локальна розробка

### Вимоги
- Node.js >= 18
- MongoDB (локально або Atlas)
- npm або yarn

### Встановлення

1. **Клонуйте репозиторій**
```bash
git clone https://github.com/Heidzu/VintalLife.git
cd VintalLife
```

2. **Встановіть залежності**
```bash
# Клієнт
cd client
npm install

# Сервер
cd ../server
npm install
```

3. **Налаштуйте змінні оточення**
```bash
# Сервер
cp .env.example .env
# Редагуйте .env — вкажіть MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD тощо

# Клієнт (опційно)
cd ../client
cp .env.example .env
```

4. **Запустіть MongoDB**
- Локально: `mongod`
- Або створіть безкоштовний кластер на MongoDB Atlas

5. **Запустіть сервер**
```bash
cd server
npm start
```
Сервер запуститься на http://localhost:5000

6. **Запустіть клієнт (окремий термінал)**
```bash
cd client
npm start
```
Клієнт запуститься на http://localhost:3000

## Production build

### Збірка клієнта
```bash
cd client
npm run build
```
Буде створено папку `client/build/` зі статичними файлами.

### Запуск сервера в production
```bash
cd server
NODE_ENV=production npm start
```
Сервер обслуговуватиме статичні файли з `client/build/` та API на `/api`.

### Адмін-панель
- URL: http://localhost:5000/admin
- Логін: `admin@vintallife.local`
- Пароль: `ChangeMe123!` (змініть у `.env`!)

## API Endpoints

- `POST /api/requests` — відправка заявки з форми
- `GET /api/photos/style/:style` — отримання фото кухонь за стилем
- `GET /api/content` — отримання контенту (за ключами або типом)
- `GET /api/health` — перевірка стану сервера

## Структура проєкту

```
VintalLife/
├── client/                 # React SPA
│   ├── public/            # статичні ресурси (index.html, manifest)
│   ├── src/
│   │   ├── components/    # React компоненти
│   │   ├── hooks/         # кастомні хуки (useContent, useFormValidation)
│   │   ├── services/      # API сервіси
│   │   ├── content/       # контент-ключі та fallbacks
│   │   └── assets/        # зображення, стилі
│   ├── package.json
│   └── .env.example
├── server/                # Express API
│   ├── config/           # конфігурація (adminjs, db)
│   ├── models/           # Mongoose моделі (ContactRequest, Photo, Content)
│   ├── routes/           # Express роутери
│   ├── middlewares/      # власні middleware (errorHandler, mongoSanitize)
│   ├── index.js          # точка входу
│   ├── app.js            # створення Express app
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

## Хостинг

### Безкоштовні опції
- **Railway.app** — $5 кредитів на старті, підтримує Node.js + MongoDB Atlas
- **Render.com** — безкоштовний Always Free tier, HTTPS
- **Vercel** — для фронтенду (React), бекенд окремо

### Приклад деплою на Railway
1. Зареєструйтесь на railway.app
2. Підключіть GitHub репозиторій
3. Додайте змінні оточення (MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_COOKIE_SECRET, CLIENT_URL)
4. Deploy

## Лицензія
ISC
