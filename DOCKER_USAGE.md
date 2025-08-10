# 🐳 Guía de Uso de Docker

## Configuración Simplificada

Esta aplicación usa una configuración Docker simple con Node.js, sin nginx.

## 🚀 Comandos Rápidos

### Desarrollo
```bash
# Iniciar entorno de desarrollo
./deploy.sh dev

# O directamente con docker-compose
docker-compose --profile dev up -d
```

### Producción
```bash
# Iniciar entorno de producción
./deploy.sh prod

# O directamente con docker-compose
docker-compose up -d
```

### Gestión
```bash
# Ver logs
./deploy.sh logs

# Ver estado
./deploy.sh status

# Health check
./deploy.sh health

# Limpiar todo
./deploy.sh clean
```

## 📋 Puertos

- **Desarrollo**: http://localhost:3001
- **Producción**: http://localhost:3000

## 🔧 Configuración de Archivos

### Dockerfile (Producción)
- Usa Node.js 18 Alpine
- Construye la aplicación con `npm run build`
- Ejecuta con `npm run preview` en puerto 3000

### Dockerfile.dev (Desarrollo)
- Usa Node.js 18 Alpine
- Ejecuta con `npm run dev` en puerto 3000
- Hot reload habilitado

### docker-compose.yml
- **funds-frontend**: Servicio de producción
- **funds-frontend-dev**: Servicio de desarrollo (profile: dev)

## 🛠️ Comandos Avanzados

### Construir imagen manualmente
```bash
docker build -t funds-frontend .
```

### Ejecutar contenedor manualmente
```bash
docker run -p 3000:3000 funds-frontend
```

### Ver logs en tiempo real
```bash
docker-compose logs -f funds-frontend
```

### Reiniciar servicio
```bash
docker-compose restart funds-frontend
```

### Ver uso de recursos
```bash
docker stats
```

## 🔍 Troubleshooting

### Si el puerto está ocupado
```bash
# Ver qué está usando el puerto
lsof -i :3000

# Detener contenedores
docker-compose down
```

### Si hay problemas de permisos
```bash
# Dar permisos al script
chmod +x deploy.sh
```

### Si hay problemas de red
```bash
# Ver redes Docker
docker network ls

# Limpiar redes no utilizadas
docker network prune
```

## 📊 Monitoreo

### Health Check
```bash
curl http://localhost:3000
```

### Logs del contenedor
```bash
docker logs funds-frontend
```

### Estado del contenedor
```bash
docker ps
```

## 🧹 Limpieza

### Limpiar contenedores
```bash
docker-compose down
```

### Limpiar imágenes
```bash
docker image prune -f
```

### Limpiar todo
```bash
docker system prune -a
```

## 🔄 Actualización

### Reconstruir con cambios
```bash
# Detener contenedores
docker-compose down

# Reconstruir imagen
docker-compose build --no-cache

# Levantar contenedores
docker-compose up -d
```

### Actualizar desde Git
```bash
# Pull de cambios
git pull

# Reconstruir y levantar
./deploy.sh clean
./deploy.sh prod
```
