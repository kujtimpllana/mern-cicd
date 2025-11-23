FROM node:18-alpine 

WORKDIR /usr/src/app

RUN npm uninstall -g cross-spawn && npm cache clean --force && \
npm install -g cross-spawn@7.0.5 --force

RUN npm uninstall -g glob && npm cache clean --force && \
npm install -g glob@11.1.0 --force

COPY package*.json .

RUN npm install --production

COPY . . 

EXPOSE 5000

CMD ["npm", "start"]

