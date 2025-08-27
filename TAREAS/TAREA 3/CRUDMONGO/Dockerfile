FROM node:20-alpine

WORKDIR /app

#copiar los archivos necesarios al contenedor
COPY package.json .
COPY package-lock.json .

#instalar dependencias
RUN npm install

#copear el resto de los archivos del proyecto
COPY public ./public
COPY views ./views
COPY . .

#crear las carpetas uploads y log si no existen

#exponer el puerto 3000
EXPOSE 3000

#COMANDO PARA INICIAR EL SERVIDOR
CMD ["node", "app.js"]
