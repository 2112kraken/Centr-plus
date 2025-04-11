# syntax=docker/dockerfile:1.2

######################
# STAGE 1: Buildtime #
######################
FROM node:23-alpine AS builder

ARG APP_NAME
ENV APP_NAME=${APP_NAME}

# Enable corepack and prepare pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files for caching
COPY package.json pnpm-lock.yaml ./

# Configure pnpm store and install dependencies
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
  pnpm config set store-dir /root/.local/share/pnpm/store && \
  pnpm install --frozen-lockfile

# Copy remaining files and build
COPY . .
RUN pnpm build ${APP_NAME}

# Create necessary directories
RUN mkdir -p dist/libs apps/${APP_NAME}/i18n/

####################
# STAGE 2: Runtime #
####################
FROM node:23-alpine AS runner

ARG APP_NAME
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
ENV APP_NAME=${APP_NAME}

WORKDIR /app

# Install wget for runtime
RUN apk add --no-cache wget

# Copy built files and dependencies
COPY --from=builder /app/dist/apps ./apps
COPY --from=builder /app/dist/common ./common
COPY --from=builder /app/dist/libs ./libs
COPY --from=builder /app/startup ./startup
COPY --from=builder /app/apps/${APP_NAME}/.env.local ./apps/${APP_NAME}/
COPY --from=builder /app/apps/${APP_NAME}/i18n ./apps/${APP_NAME}/i18n/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/data-source.ts ./

EXPOSE 3000

CMD ["sh", "-c", "node ./apps/${APP_NAME}/src/main.js"]