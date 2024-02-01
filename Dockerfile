FROM node:alpine as build
WORKDIR /app
COPY package*.json /app/
RUN npm install
RUN npm install --global serve
COPY ./ ./
RUN npm run build

FROM streetcode-frontend-server:latest  as server 
COPY --from=build /app/dist/ /usr/src/app/client-dist/
COPY --from=build /app/env.sh /usr/src/app/client-dist/env.sh
WORKDIR /usr/src/app/client-dist/
RUN apk add --no-cache bash
RUN chmod +x env.sh
RUN apk --no-cache add nginx
COPY nginx/nginx.conf /etc/nginx/nginx.conf
CMD ["/bin/bash", "-c", "/usr/src/app/client-dist/env.sh && nginx -g 'daemon off;' & npm run start"]

