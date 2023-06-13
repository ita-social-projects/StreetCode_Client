FROM node:alpine as build
WORKDIR /app
COPY package*.json /app/
RUN npm install
RUN npm install
COPY ./ ./
RUN npm run build
CMD serve ./dist/ 