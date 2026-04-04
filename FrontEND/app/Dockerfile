# ── Stage 1: Install dependencies ──────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ── Stage 2: Build ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:5000
ARG NEXT_PUBLIC_INVENTORY_SERVICE_URL=http://localhost:5001
ARG NEXT_PUBLIC_RECIPE_SERVICE_URL=http://localhost:5002
ARG NEXT_PUBLIC_IMAGE_PROCESSING_SERVICE_URL=http://localhost:5003
ENV NEXT_PUBLIC_USER_SERVICE_URL=$NEXT_PUBLIC_USER_SERVICE_URL
ENV NEXT_PUBLIC_INVENTORY_SERVICE_URL=$NEXT_PUBLIC_INVENTORY_SERVICE_URL
ENV NEXT_PUBLIC_RECIPE_SERVICE_URL=$NEXT_PUBLIC_RECIPE_SERVICE_URL
ENV NEXT_PUBLIC_IMAGE_PROCESSING_SERVICE_URL=$NEXT_PUBLIC_IMAGE_PROCESSING_SERVICE_URL
RUN npm run build

# ── Stage 3: Run ────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
