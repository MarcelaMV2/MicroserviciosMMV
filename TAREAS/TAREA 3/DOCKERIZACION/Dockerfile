FROM node:20-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY public ./public
COPY views ./views
COPY . .

EXPOSE 3000

CMD ["node", "app.js"]
