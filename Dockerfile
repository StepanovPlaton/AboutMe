# Используем официальный Node.js образ
FROM node:22-alpine

# Устанавливаем pnpm глобально
RUN npm install -g pnpm@9.14.4

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы конфигурации пакетов
COPY package.json pnpm-lock.yaml ./

# Устанавливаем зависимости
RUN pnpm install --frozen-lockfile

# Копируем остальные файлы проекта
COPY . .

# Устанавливаем переменную окружения для Docker
ENV DOCKER=true

# Accept build arguments and set environment variables
ARG OAUTH_GITHUB_CLIENT_ID
ARG OAUTH_GITHUB_CLIENT_SECRET
ENV OAUTH_GITHUB_CLIENT_ID=${OAUTH_GITHUB_CLIENT_ID}
ENV OAUTH_GITHUB_CLIENT_SECRET=${OAUTH_GITHUB_CLIENT_SECRET}

# Собираем проект
RUN pnpm run build

# Открываем порт (Node.js adapter по умолчанию использует 4321)
EXPOSE 4321

# Устанавливаем переменную окружения для порта
ENV PORT=4321
ENV HOST=0.0.0.0

# Запускаем Astro сервер через Node.js adapter
# В standalone режиме entry point находится в dist/server/entry.mjs
CMD ["node", "dist/server/entry.mjs"]