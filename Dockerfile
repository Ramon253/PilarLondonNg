FROM node:latest as build
#
WORKDIR /app
#
COPY package*.json ./
RUN npm ci
RUN npm install -g @angular/cli
#
COPY . .
RUN npm run build --configuration=production

FROM nginx:latest

# Crear directorio para los certificados SSL
RUN mkdir -p /etc/nginx/certs

# Copiar certificados SSL a la imagen de Docker
COPY certs/fullchain.pem /etc/nginx/certs/fullchain.pem
COPY certs/privkey.pem /etc/nginx/certs/privkey.pem

# Copiar archivo de configuración de Nginx a la imagen de Docker
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar la salida de la construcción de Angular a la imagen de Docker
COPY --from=build /app/dist/pilar-london-ng/browser /usr/share/nginx/html

EXPOSE 80
EXPOSE 443
