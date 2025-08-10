# Dockerfile simplificado para React con Vite
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema
RUN apk add --no-cache git

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Exponer puerto 3000
EXPOSE 3000

# Comando para ejecutar en producción
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
