FROM node:18-alpine
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN mkdir -p /app/data
EXPOSE 3001
ENV PORT=3001
CMD ["node", "server.js"]
