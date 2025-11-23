FROM node:18-alpine 

WORKDIR /usr/src/app

RUN npm install -g npm@10.9.1
RUN npm install -g glob@10.5.0

COPY package*.json .

RUN npm install --production

COPY . . 

EXPOSE 5000

CMD ["npm", "start"]

