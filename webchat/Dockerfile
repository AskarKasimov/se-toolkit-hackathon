FROM node:25-alpine3.22 AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --omit-dev


FROM node:25-alpine3.22 AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build


FROM node:25-alpine3.22 AS runner
WORKDIR /app

ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# COPY --from=builder /app/public ./public

EXPOSE 3000

ENTRYPOINT ["node", "server.js"]
