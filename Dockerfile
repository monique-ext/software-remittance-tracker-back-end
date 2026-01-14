# ===== STAGE 1: Build =====
FROM mcr.microsoft.com/devcontainers/javascript-node:dev-20 AS build

WORKDIR /app

COPY package*.json ./

RUN npm config set strict-ssl false

RUN npm install

RUN npm config set strict-ssl true

COPY . .

RUN npm run build

# ===== STAGE 2: Produção =====
FROM mcr.microsoft.com/devcontainers/javascript-node:dev-20

WORKDIR /app

# Copia apenas os arquivos necessários
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 3001

CMD ["node", "dist/main.js"]