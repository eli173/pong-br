
FROM node:12

WORKDIR /usr/src/pbr

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 6789

CMD [ "npm", "start" ]