FROM node:latest as build

WORKDIR /app

COPY package*.json ./

RUN  npm ci

RUN  npm install -g @angular/cli

COPY . .

RUN npm run build --configuration=prodiction

FROM nginx:latest

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/pilar-london-ng/browser /usr/share/nginx/html

EXPOSE 80
