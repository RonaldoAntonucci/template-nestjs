FROM node:20.13.1-alpine AS base

FROM base AS development

WORKDIR /app

ENV NODE_ENV=development

COPY package*.json ./

RUN npm ci

COPY . .

# RUN chmod -R 777 /usr/src/app/node_modules
# RUN mkdir -p /usr/src/app/node_modules/.vite
# RUN chmod -R 777 /usr/src/app/node_modules/.vite

# USER node

FROM base AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci --production

COPY . .

RUN npm run build

FROM base AS production

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist

USER node

EXPOSE $PORT

CMD ["npm", "start:prod"]