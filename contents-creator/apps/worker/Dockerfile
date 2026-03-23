FROM node:20-slim AS base

RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/worker/package.json ./apps/worker/
COPY packages/shared/package.json ./packages/shared/

RUN pnpm install --frozen-lockfile --filter @videoforge/worker...

COPY packages/shared/ ./packages/shared/
COPY apps/worker/ ./apps/worker/

RUN pnpm --filter @videoforge/shared build
RUN pnpm --filter @videoforge/worker build

EXPOSE 3001

CMD ["node", "apps/worker/dist/index.js"]
