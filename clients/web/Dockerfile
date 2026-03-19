# ===== СБОРКА (BUILD STAGE) =====
# Используем официальный Node.js образ на базе Alpine Linux (очень легкий)
# AS builder - даем имя этапу, чтобы потом скопировать из него файлы
FROM node:20-alpine AS builder

# Устанавливаем рабочую директорию внутри контейнера
# Все команды будут выполняться относительно этой папки
WORKDIR /app

# Копируем package.json и package-lock.json (если есть)
# Копируем отдельно от исходников, чтобы использовать кэш Docker
# Если зависимости не менялись - этот слой закэшируется
COPY package*.json ./

# Устанавливаем зависимости
# npm ci установит точно те версии, что в lock-файле
# --quiet - меньше логов, --no-fund - не показывать донаты
RUN npm ci --quiet --no-fund

# Копируем все исходники приложения
# .dockerignore исключает node_modules, .env и т.д.
COPY . .

# Собираем приложение (Vite создаст папку dist)
RUN npm run build

# ===== ПРОДАКШН СТЕЙДЖ (PRODUCTION STAGE) =====
# Берем легкий Nginx образ для раздачи статики
FROM nginx:alpine

# Копируем собранные файлы из builder стейджа в папку Nginx
# /app/dist - папка со сборкой из builder
# /usr/share/nginx/html - стандартная папка Nginx для статики
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем кастомный конфиг Nginx
# default.conf - дефолтный конфиг, который перезаписываем
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80 (HTTP)
EXPOSE 80

# Запускаем Nginx на переднем плане (не в демоне)
# daemon off - нужно для Docker, иначе контейнер сразу завершится
CMD ["nginx", "-g", "daemon off;"]