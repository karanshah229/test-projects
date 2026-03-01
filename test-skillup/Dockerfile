ARG ECR_IMAGE
FROM $ECR_IMAGE:latest as key-img
WORKDIR /

# Install dependencies only when needed
FROM node:18-alpine AS prod-deps
COPY --from=key-img /root/.ssh /root/.ssh
RUN chmod 400 /root/.ssh/id_rsa
RUN apk add --no-cache libc6-compat git bash openssh
RUN ssh-keyscan github.com >> /root/.ssh/known_hosts
WORKDIR /app
COPY package.json .npmrc yarn.lock ./
RUN yarn install --production

FROM node:18-alpine AS dev-deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
COPY --from=key-img /root/.ssh /root/.ssh
RUN chmod 400 /root/.ssh/id_rsa
RUN apk add --no-cache libc6-compat git bash openssh curl
RUN ssh-keyscan github.com >> /root/.ssh/known_hosts
WORKDIR /app
COPY package.json .npmrc yarn.lock ./
RUN yarn install
COPY . .

FROM node:18-alpine AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=dev-deps /app/node_modules/ ./node_modules
COPY . .
ENV NODE_ENV production
ARG NEXT_PUBLIC_CDN_URL
ENV NEXT_PUBLIC_CDN_URL ${NEXT_PUBLIC_CDN_URL}
ARG NEW_RELIC_LICENSE_KEY
ENV NEW_RELIC_LICENSE_KEY ${NEW_RELIC_LICENSE_KEY}
ARG NEW_RELIC_APP_NAME
ENV NEW_RELIC_APP_NAME ${NEW_RELIC_APP_NAME}
ENV BACKEND_URL=''
RUN yarn build


# Final stage
FROM node:18-alpine AS runner
ARG BUILD_PORT=3000
# Set node environment to production
WORKDIR /app


RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/next-i18next.config.js ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/public ./.next/static
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.npmrc /app/yarn.lock ./

USER nextjs
# Open desired port
EXPOSE ${BUILD_PORT}

ENV NODE_ENV production
ENV PORT ${BUILD_PORT}

CMD yarn start
