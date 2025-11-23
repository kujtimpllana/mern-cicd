FROM node:22-alpine 

WORKDIR /usr/src/app

RUN npm install -g npm@11.1.0

COPY package*.json .

RUN npm install --production

COPY . . 

EXPOSE 5000

CMD ["npm", "start"]

