# Multi-stage build for Node.js + Express backend
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

# Install standard dependencies
RUN npm ci --only=production

# Copy application source code
COPY . .

# Final slim environment
FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app /usr/src/app

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "server.js"]
