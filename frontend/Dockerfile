FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx ng build --configuration production

RUN ls -la /app/www || echo "PASTA WWW NAO ENCONTRADA"

EXPOSE 8080

CMD ["node", "server.js"]
