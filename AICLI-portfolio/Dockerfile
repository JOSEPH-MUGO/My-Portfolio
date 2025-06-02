FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# Copy your AI-CLI code
COPY . .

EXPOSE 4000
CMD ["node", "index.js"]
