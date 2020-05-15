FROM node:10

WORKDIR /usr/src/app

COPY package.json .

RUN yarn config set registry https://registry.npm.taobao.org && yarn

COPY . .

ENV NODE_ENV=production
ENV MONGO_URI=mongodb://db:27017/daily_report
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD [ "node", "./bin/www" ]