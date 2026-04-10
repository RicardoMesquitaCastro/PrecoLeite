FROM node:20-alpine
 
WORKDIR /app
 
COPY package*.json ./
 
RUN npm install
 
COPY . .
 
RUN npx ng build --configuration production
 
EXPOSE 3000
 
CMD ["node", "server.js"]