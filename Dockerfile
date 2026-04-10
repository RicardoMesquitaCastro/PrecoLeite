FROM node:20-alpine

WORKDIR /app

COPY frontend/package*.json ./

RUN npm install

COPY frontend/ .

RUN npx ng build --configuration production

EXPOSE 3000

CMD ["node", "server.js"]