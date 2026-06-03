FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN npm install -g typescript ts-node && npm run build

EXPOSE 5000

CMD ["node", "dist/app.js"]
