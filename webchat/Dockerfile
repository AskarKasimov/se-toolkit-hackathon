# Use the official Node.js 18 image based on Alpine Linux
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package.json package-lock.json* ./

# Install dependencies (only production deps if needed, but we need all for build)
RUN npm ci

# Copy the rest of your application code
COPY . .

# Build the Next.js application
RUN npm run build

# Start a new, smaller image for the production environment
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy package.json to the runner image
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose the correct port
EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED=1

# Start the application
CMD ["npm", "start"]
