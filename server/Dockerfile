# ===== СБОРКА (BUILD STAGE) =====
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем package файлы
COPY package*.json ./
COPY prisma ./prisma/

# Устанавливаем зависимости
RUN npm ci

# Генерируем Prisma Client
RUN npx prisma generate

# Копируем исходники
COPY . .

# Собираем проект
RUN npm run build

# ===== ПРОДАКШН СТЕЙДЖ =====
FROM node:20-alpine

WORKDIR /app

# Устанавливаем netcat-openbsd для скрипта ожидания БД
RUN apk add --no-cache netcat-openbsd

# Копируем необходимые файлы
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Копируем скрипт ожидания БД (убедитесь, что он есть в папке)
COPY docker-entrypoint.sh ./docker-entrypoint.sh

# Делаем скрипт исполняемым
RUN chmod +x docker-entrypoint.sh

# Открываем порт
EXPOSE 3000

# Запускаем приложение через скрипт ожидания БД
CMD ["./docker-entrypoint.sh"]