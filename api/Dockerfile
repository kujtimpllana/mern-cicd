FROM node:22-alpine 

WORKDIR /usr/src/app

RUN npm install -g npm@11.6.2

COPY package-lock.json package.json ./

RUN npm install --production && npm install glob@11.1.0

COPY . . 

EXPOSE 5000

CMD ["npm", "start"]

