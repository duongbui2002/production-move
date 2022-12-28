FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build
EXPOSE 3000

# Start the server using the production build
CMD [ "node", "dist/main.js" ]