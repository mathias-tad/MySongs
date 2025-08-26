FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server/dist ./server/dist
#COPY --from=builder /app/.env .env

RUN npm install --production

# Expose the application port (change if needed) 
EXPOSE 1316

# Start the application
CMD ["node", "server/dist/server.js"]