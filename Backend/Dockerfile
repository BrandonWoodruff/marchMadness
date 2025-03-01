FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
COPY dbm.js ./
COPY wait-for-it.sh ./
RUN chmod +x wait-for-it.sh

RUN apt-get update && apt-get install -y postgresql-client

RUN npm install

CMD ["./wait-for-it.sh", "postgres", "node", "dbm.js"]
