FROM node:24-slim

WORKDIR /home/node/app

ENV PORT=3000
EXPOSE 3000:3000


COPY package*.json ./
COPY ./yarn.* ./

RUN yarn

RUN yarn global add serve

COPY ./ ./

RUN yarn build

CMD serve -s -p 3000 build

