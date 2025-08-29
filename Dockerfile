FROM node:20-alpine
WORKDIR /app

# 1) Dépendances
COPY package*.json ./
RUN npm ci

# 2) Code + build
COPY . .
RUN npm run build

# 3) Run en prod
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "dist/server/index.js"]
