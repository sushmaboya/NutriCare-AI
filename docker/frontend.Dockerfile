# Build React app
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

# Set Vite API URL variable for compile-time injection
ARG VITE_API_URL=http://localhost:5000/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Nginx host stage
FROM nginx:alpine

# Copy built assets to Nginx html directory
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Copy custom Nginx configuration to support client-side SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
