ARG NODE_VERSION=20
ARG PNPM_VERSION=10.12.1

FROM node:${NODE_VERSION}-slim AS amplify-base
RUN apt-get update && \
    apt-get install -y \
    curl \
    git \
    openssh-client \
    bash \
    wget \
    tar && \
    rm -rf /var/lib/apt/lists/*

FROM amplify-base AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN corepack prepare pnpm@${PNPM_VERSION} --activate
WORKDIR /app

FROM base AS fetcher
COPY pnpm-lock.yaml /app/
RUN pnpm fetch --prod

FROM fetcher AS builder
COPY . .
RUN pnpm i --prefer-offline --frozen-lockfile
RUN pnpm run build

FROM fetcher AS runner
COPY --from=builder /app/.next /app/.next
COPY package.json /app/
RUN pnpm i --offline --prod --frozen-lockfile
EXPOSE 3000
CMD [ "pnpm", "start" ]