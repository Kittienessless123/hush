Hush Messenger
Приватный мессенджер с сквозным шифрованием (E2EE). Бэкенд на NestJS + Prisma, фронтенд на React + Vite, прокси через Nginx.

🚀 Быстрый старт
Требования
Node.js 20+

Docker и Docker Compose (для продакшена)

PostgreSQL (для разработки) или SQLite

Установка для разработки
bash
# Клонировать репозиторий
git clone <your-repo-url>
cd hush

# Установка зависимостей для сервера
cd server
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run start:dev

# В новом терминале: установка для клиента
cd clients/web
npm install
cp .env.example .env
npm run dev
Запуск через Docker (продакшен)
bash
# Создать SSL сертификаты для разработки
mkdir ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/key.pem -out ssl/cert.pem \
  -subj "/C=RU/ST=Moscow/L=Moscow/O=Hush/CN=hush.local"

# Добавить в hosts (Windows: C:\Windows\System32\drivers\etc\hosts)
# 127.0.0.1 hush.local

# Запустить все сервисы
docker-compose up --build -d

# Посмотреть логи
docker-compose logs -f

# Остановить
docker-compose down
📁 Структура проекта
text
hush/
├── server/                 # NestJS бэкенд
│   ├── prisma/             # Схема БД и миграции
│   ├── src/                # Исходный код
│   │   ├── auth/           # Аутентификация
│   │   ├── users/          # Пользователи
│   │   ├── chats/          # Чаты
│   │   ├── messages/       # Сообщения
│   │   └── prisma/         # Prisma сервис
│   └── Dockerfile
│
├── clients/
│   └── web/                # React + Vite клиент
│       ├── src/
│       │   ├── components/ # UI компоненты
│       │   ├── pages/      # Страницы
│       │   ├── services/   # API и WebSocket
│       │   ├── store/      # Zustand сторы
│       │   └── types/      # TypeScript типы
│       └── Dockerfile
│
├── nginx/                   # Reverse proxy
│   ├── nginx.conf
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
🛠 Технологии
Бэкенд
NestJS — фреймворк

Prisma — ORM

PostgreSQL — база данных

JWT — аутентификация

bcrypt — хеширование паролей

tweetnacl — сквозное шифрование

Фронтенд
React + TypeScript

Vite — сборка

Ant Design — UI компоненты

Zustand — стейт-менеджмент

React Router — навигация

Axios — HTTP клиент

Socket.io — WebSocket

Инфраструктура
Nginx — reverse proxy, SSL termination

Docker — контейнеризация

Docker Compose — оркестрация

🔐 Сквозное шифрование
Все сообщения шифруются на клиенте с использованием tweetnacl:

Асимметричное шифрование (X25519) для обмена ключами

Симметричное шифрование (XSalsa20-Poly1305) для сообщений

Perfect Forward Secrecy через эфемерные ключи

📊 Модели данных
prisma
model User {
  id           String   @id @default(uuid())
  username     String   @unique
  login        String   @unique
  passwordHash String
  publicKey    String?
  // ... связи
}

model Chat {
  id        String   @id @default(uuid())
  user1Id   String
  user2Id   String
  messages  Message[]
  // ... связи
}

model Message {
  id        String   @id @default(uuid())
  chatId    String
  senderId  String
  text      String?
  fileUrl   String?
  encrypted Boolean  @default(true)
  // ... связи
}
🌐 API Endpoints
Auth
POST /auth/register — регистрация

POST /auth/login — вход

POST /auth/refresh — обновление токена

POST /auth/logout — выход

Users
GET /users — список пользователей

GET /users/:id — получить пользователя

PATCH /users/:id — обновить профиль

DELETE /users/:id — удалить пользователя

Chats
GET /chats — список чатов

POST /chats — создать чат

GET /chats/:id — получить чат

DELETE /chats/:id — удалить чат

Messages
GET /chats/:chatId/messages — история сообщений

POST /chats/:chatId/messages — отправить сообщение

DELETE /messages/:id — удалить сообщение

🔧 Переменные окружения
Сервер (.env)
env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/hush"

# JWT
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="7d"

# App
PORT=3000
NODE_ENV=development
CLIENT_URL="http://localhost:3001"
Клиент (.env)
env
VITE_API_URL="http://localhost:3000"
VITE_WS_URL="ws://localhost:3000"
📦 Команды
Сервер
bash
npm run start:dev    # разработка
npm run build        # сборка
npm run start:prod   # продакшен
npx prisma studio    # UI для БД
npx prisma migrate   # миграции
Клиент
bash
npm run dev          # разработка
npm run build        # сборка
npm run preview      # предпросмотр сборки
Docker
bash
docker-compose up    # запуск всех сервисов
docker-compose down  # остановка
docker-compose logs  # логи
🤝 Вклад в проект
Форкнуть репозиторий

Создать ветку (git checkout -b feature/amazing-feature)

Закоммитить изменения (git commit -m 'Add amazing feature')

Запушить (git push origin feature/amazing-feature)

Открыть Pull Request

📄 Лицензия
MIT

📞 Контакты
Автор: [Ваше имя]

Email: [ваш email]

Telegram: [@username]

Hush — говори тихо, говори безопасно 🔒





---------------

БД: 
Таблицы и их описание
users — пользователи системы
Поле	Тип	Описание
id	UUID	Первичный ключ
username	String(50)	Уникальный никнейм пользователя
login	String(255)	Уникальный email/логин
passwordHash	String(255)	Хеш пароля (bcrypt, содержит соль)
publicKey	Text	Публичный ключ для шифрования (опционально)
createdAt	DateTime	Дата регистрации
updatedAt	DateTime	Дата обновления профиля
chats — личные чаты между пользователями
Поле	Тип	Описание
id	UUID	Первичный ключ
user1Id	UUID	Первый участник чата (FK → users.id)
user2Id	UUID	Второй участник чата (FK → users.id)
createdAt	DateTime	Дата создания чата
updatedAt	DateTime	Дата последнего обновления
Unique constraint	[user1Id, user2Id]	Гарантирует уникальность пары
messages — сообщения в чатах
Поле	Тип	Описание
id	UUID	Первичный ключ
chatId	UUID	ID чата (FK → chats.id)
senderId	UUID	ID отправителя (FK → users.id)
text	Text	Текст сообщения (null, если только файл)
fileUrl	String	Ссылка на файл (опционально)
fileType	String	MIME-тип файла (опционально)
encrypted	Boolean	Флаг шифрования (по умолчанию true)
createdAt	DateTime	Время отправки
updatedAt	DateTime	Время редактирования
Index	[chatId, createdAt]	Для быстрой загрузки истории
refresh_tokens — токены обновления для JWT
Поле	Тип	Описание
id	UUID	Первичный ключ
userId	UUID	ID владельца токена (FK → users.id)
token	String	Уникальный refresh токен
expiresAt	DateTime	Дата истечения
deviceInfo	String	Информация об устройстве (опционально)
revoked	Boolean	Отозван ли токен
createdAt	DateTime	Дата выдачи токена
🔗 Связи между таблицами
User → Message (Один ко многим)
Один пользователь может отправить много сообщений

Message.senderId → User.id

User → Chat (Один ко многим через две связи)
Пользователь может быть первым участником многих чатов (chatsAsUser1)

Пользователь может быть вторым участником многих чатов (chatsAsUser2)

Chat.user1Id → User.id

Chat.user2Id → User.id

User → RefreshToken (Один ко многим)
Один пользователь может иметь несколько активных сессий (токенов)

RefreshToken.userId → User.id

Каскадное удаление: при удалении пользователя удаляются все его токены

Chat → Message (Один ко многим)
Один чат содержит много сообщений

Message.chatId → Chat.id

Каскадное удаление: при удалении чата удаляются все его сообщения

🎯 Индексы для производительности
sql
-- Для быстрой загрузки истории сообщений
CREATE INDEX idx_messages_chat_created ON messages(chat_id, created_at DESC);

-- Для поиска пользователей
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_login ON users(login);

-- Для поиска чатов между пользователями
CREATE INDEX idx_chats_user1 ON chats(user1_id);
CREATE INDEX idx_chats_user2 ON chats(user2_id);

-- Для управления токенами
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);