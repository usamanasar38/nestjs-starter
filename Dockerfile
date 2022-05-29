# ******** DEVELOPMENT ********
FROM node:14 AS development

RUN npm install --global pnpm

ENV NODE_ENV=development

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --strict-peer-dependencies --reporter append-only --unsafe-perm

COPY . .

RUN pnpm build

# ******** PRODUCTION ********
FROM node:14-alpine as production

RUN npm install --global pnpm

RUN apk add dumb-init

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile --strict-peer-dependencies --reporter append-only --unsafe-perm

RUN chown -R node:node ./node_modules

COPY --chown=node:node . .

COPY --chown=node:node --from=development /usr/src/app/dist ./dist

USER node

CMD ["dumb-init", "node", "dist/main"]