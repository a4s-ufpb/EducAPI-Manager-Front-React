# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Stage: deps
# Instala as dependências uma única vez e reaproveita nos outros stages
# (acelera o build graças ao cache de camadas do Docker).
# ---------------------------------------------------------------------------
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci


# ---------------------------------------------------------------------------
# Stage: development
# Usado com `docker build --target development`.
# Roda o Vite dev server com hot-reload. O código-fonte é montado como
# volume pelo docker-compose, então aqui só preparamos o ambiente.
# ---------------------------------------------------------------------------
FROM node:22-alpine AS development

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]


# ---------------------------------------------------------------------------
# Stage: build
# Gera os arquivos estáticos de produção (pasta dist/).
#
# As variáveis VITE_* precisam ser passadas como build args porque o Vite
# as embute no bundle JS durante o `npm run build` (não em runtime).
# ---------------------------------------------------------------------------
FROM deps AS build

WORKDIR /app

ARG VITE_API_URL
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

COPY . .
RUN npm run build


# ---------------------------------------------------------------------------
# Stage: production
# Imagem final: apenas Nginx + arquivos estáticos. Não tem Node.js,
# fica pequena e rápida.
# ---------------------------------------------------------------------------
FROM nginx:1.27-alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
