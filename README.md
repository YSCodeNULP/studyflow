# StudyFlow

StudyFlow — веб-застосунок для студентів, який допомагає зберігати курси, керувати завданнями, фіксувати навчальні сесії та отримувати план підготовки за допомогою AI.

## Можливості

- вхід через Google
- курси та короткі нотатки
- завдання з пріоритетами і статусами
- історія навчальних сесій
- AI-помічник для формування плану підготовки
- збереження історії AI-запитів

## Технології

- Next.js
- TypeScript
- Firebase Authentication
- Cloud Firestore
- Gemini API
- Vercel

## Локальний запуск

Встановити залежності:

```bash
npm install
```

Створити файл `.env.local` на основі `.env.example` і заповнити змінні середовища:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=""
GEMINI_API_KEY=""
```

Запустити проєкт:

```bash
npm run dev
```

Після цього застосунок буде доступний за адресою:

```text
http://localhost:3000
```

## Firebase

Для роботи проєкту потрібно:
- створити Firebase-проєкт
- додати Web App
- увімкнути Google Sign-In в Authentication
- створити Firestore Database
- налаштувати Firestore Rules
- додати дозволені домени для локального запуску і деплою

## Деплой

Проєкт підготовлений для розгортання на Vercel.

Основні кроки:
- завантажити код у GitHub
- імпортувати репозиторій у Vercel
- додати environment variables
- після деплою додати домен Vercel у Firebase Authentication -> Authorized domains

## Сторінки

- `/` — головна
- `/courses` — курси
- `/tasks` — завдання
- `/history` — історія навчальних сесій
- `/assistant` — AI-помічник
- `/profile` — профіль
