FROM node:26.5.0-alpine AS builder

RUN corepack enable && corepack prepare pnpm@11.17.0 --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM nginx:1.29-alpine

ENV BACKEND_URL=http://backend:25610 \
    NGINX_ENVSUBST_FILTER=BACKEND_URL

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80

