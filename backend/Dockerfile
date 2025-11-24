FROM node:22-slim

WORKDIR /home/node/app

ENV PORT=4000
EXPOSE 4000:4000

COPY ./src ./src
COPY ./package.json ./package.json
COPY ./yarn.* ./

RUN yarn

CMD npm run $([ $NODE_ENV = 'production' ] && echo 'start' || echo 'dev')

