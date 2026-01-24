FROM node:20-alpine AS builder

WORKDIR /app

# Copia archivos de dependencias
COPY package*.json ./

# Instala dependencias
RUN npm ci --silent

# Copia código fuente
COPY . .

# Variable para la URL del API
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build de producción
RUN npm run build

# Etapa 2: Servidor web - versión SIMPLE
FROM nginx:alpine

# Copia los archivos construidos
COPY --from=builder /app/dist /usr/share/nginx/html

# Expone el puerto
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
