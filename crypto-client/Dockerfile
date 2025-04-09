FROM node:19.1.0

WORKDIR /crypto-client

COPY package.json /crypto-client/package.json
COPY package-lock.json /crypto-client/package-lock.json

RUN npm install  # устанавливаем все зависимости для React

COPY . /crypto-client

CMD ["npm", "start"]