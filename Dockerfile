FROM node:20-alpine

WORKDIR /app

ADD . /app/

RUN yarn install

RUN yarn run build

EXPOSE 3000

ENTRYPOINT yarn run start:prod
