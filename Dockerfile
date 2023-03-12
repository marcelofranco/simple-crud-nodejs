FROM node:18-alpine3.16
WORKDIR /app

COPY . .

RUN yarn install

RUN yarn run build

EXPOSE 8080

CMD [ "node", "build/src/server.js" ]