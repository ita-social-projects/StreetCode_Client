FROM node:alpine as build
WORKDIR /app
COPY package*.json /app/
RUN npm install
RUN npm install --global serve
COPY ./ ./
RUN npm run build
CMD serve ./dist/ 