# Dependencies step
FROM node:20-alpine as dev
RUN apk add --no-cache libc6-compat

WORKDIR /app

ENV NODE_ENV dev

COPY --chown=node:node . .

RUN yarn --frozen-lockfile

USER node

# Build step
FROM node:20-alpine as build

WORKDIR /app
RUN apk add --no-cache libc6-compat

ENV NODE_ENV production

COPY --chown=node:node --from=dev /app/node_modules ./node_modules
COPY --chown=node:node . .

RUN yarn workspace api build
RUN yarn workspace ui build

RUN yarn --frozen-lockfile --production && yarn cache clean

USER node

# Production image
FROM node:20-alpine as prod

WORKDIR /app
RUN apk add --no-cache libc6-compat

ENV NODE_ENV production

COPY --chown=node:node --from=build /app/node_modules node_modules
COPY --chown=node:node --from=build /app/workspaces/api/dist dist
COPY --chown=node:node --from=build /app/workspaces/api/data data
COPY --chown=node:node --from=build /app/workspaces/ui/dist public

USER node

CMD ["node", "dist/main.js"]