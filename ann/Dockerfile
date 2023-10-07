FROM node:18.15.0

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install --save-dev ts-node nodemon

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
