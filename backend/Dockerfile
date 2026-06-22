FROM node:18-alpine
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY backend/package.json ./backend/package.json
COPY shared ./shared
RUN cd backend && npm install
COPY backend/ ./backend/
WORKDIR /app/backend
RUN mkdir -p ./data
EXPOSE 3001
ENV PORT=3001
CMD ["node", "server.js"]
