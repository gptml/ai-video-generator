FROM node:24-slim

WORKDIR /home/node/app

ENV PORT=4000
EXPOSE 4000:4000

COPY package*.json ./
COPY ./yarn.* ./

RUN yarn

COPY ./src ./src

CMD npm run $([ $NODE_ENV = 'production' ] && echo 'start' || echo 'dev')

