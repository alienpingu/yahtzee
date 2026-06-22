FROM node:18-alpine
WORKDIR /app/frontend
ARG NEXT_PUBLIC_WS_URL=ws://localhost:3001
ENV NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL
COPY frontend/package.json ./package.json
COPY shared /app/shared
RUN npm install
COPY frontend/ ./
RUN npm run build
EXPOSE 3000
ENV PORT=3000
CMD ["npm", "start"]
