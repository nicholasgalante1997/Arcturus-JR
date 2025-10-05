FROM oven/bun:1.2.23 AS base

WORKDIR /usr/src/apps/bun/arc-jr

FROM base AS setup_env

ENV ARCJR_WEBPACK_OPTIMIZE_SPLIT_CHUNKS=1
ENV ARCJR_WEBPACK_OPTIMIZE_RUNTIME_CHUNK=1
ENV ARCJR_WEBPACK_DEBUG_CONFIG=1
ENV NODE_ENV=production
ENV BUILD_ENV=docker
ENV DEBUG=arc:*

FROM setup_env AS copy_manifests

COPY package.json .
COPY bun.lock .

FROM copy_manifests AS install_dependencies

RUN bun install --frozen-lockfile

FROM install_dependencies AS copy_app

COPY . .

FROM copy_app AS test

RUN bun run test

FROM copy_app AS build

RUN bun run build

# Verify ./dist is present for the next stage
RUN echo "=== Checking dist directory ===" && \
    ls -la ./dist && \
    echo "=== Checking for index.html ===" && \
    (test -f ./dist/index.html && cat ./dist/index.html || echo "ERROR: index.html not found") && \
    echo "=== All files in dist ===" && \
    find ./dist -type f

FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/apps/bun/arc-jr/dist /usr/share/nginx/html
