FROM node:19-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

CMD ["node", "./server.js"]

