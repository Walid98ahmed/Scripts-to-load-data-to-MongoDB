FROM node:16

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

ENV NODE_OPTIONS='--max-old-space-size=16384'

EXPOSE 8989

CMD [ "node", "dist/index.js" ]
