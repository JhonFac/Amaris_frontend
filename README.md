# 🏦 Fondos de Inversión - Frontend

Aplicación web moderna para la gestión de fondos de inversión, construida con React, Vite y Docker.

## 🚀 Características

- **Interfaz moderna y responsive** con diseño CRM
- **Panel de pruebas de API** integrado
- **Gestión completa de clientes** y fondos
- **Operaciones financieras** (suscripciones, cancelaciones, depósitos)
- **Dockerizado** para fácil despliegue
- **Configuración simple** con Node.js

## 🛠️ Tecnologías

- **React 18** - Framework de UI
- **Vite** - Build tool y dev server
- **React Router DOM** - Enrutamiento
- **Docker** - Containerización
- **Node.js** - Servidor de producción

## 📋 Prerrequisitos

- **Node.js** 18+ 
- **Docker** y **Docker Compose**
- **Git**

## 🐳 Despliegue con Docker

### Opción 1: Script de Despliegue (Recomendado)

```bash
# Dar permisos de ejecución al script
chmod +x deploy.sh

# Desarrollo (puerto 3001)
./deploy.sh dev

# Producción (puerto 3000)
./deploy.sh prod

# Construir imagen
./deploy.sh build

# Limpiar contenedores
./deploy.sh clean

# Ver logs
./deploy.sh logs

# Ver estado
./deploy.sh status

# Health check
./deploy.sh health
```

### Opción 2: Docker Compose Directo

```bash
# Desarrollo
docker-compose --profile dev up -d

# Producción
docker-compose up -d

# Detener
docker-compose down
```

### Opción 3: Docker Build Manual

```bash
# Construir imagen
docker build -t funds-frontend .

# Ejecutar contenedor
docker run -p 3000:3000 funds-frontend
```

## 🔧 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Preview de producción
npm run preview
```

## 🌐 URLs de Acceso

- **Desarrollo**: http://localhost:3001
- **Producción**: http://localhost:3000

## 📁 Estructura del Proyecto

```
├── src/
│   ├── components/          # Componentes React
│   │   ├── ApiTest.jsx      # Panel de pruebas de API
│   │   ├── Dashboard.jsx    # Dashboard principal
│   │   ├── Funds.jsx        # Gestión de fondos
│   │   ├── Clients.jsx      # Gestión de clientes
│   │   ├── CreateClient.jsx # Creación de clientes
│   │   ├── ClientDetail.jsx # Detalle de cliente
│   │   └── Operations.jsx   # Operaciones financieras
│   ├── config/
│   │   └── api.js          # Configuración de API
│   ├── App.jsx             # Componente principal
│   └── index.css           # Estilos globales
├── Dockerfile              # Configuración Docker producción
├── Dockerfile.dev          # Configuración Docker desarrollo
├── docker-compose.yml      # Orquestación de servicios
├── deploy.sh               # Script de despliegue
└── .gitignore              # Archivos ignorados por Git
```

## 🔌 Configuración de API

La aplicación se conecta a la API backend en:
- **URL Base**: `http://52.90.248.152:8080`
- **Endpoints**: Configurados en `src/config/api.js`

### Endpoints Principales:
- `/api/health/` - Verificación del sistema
- `/api/funds/` - Gestión de fondos
- `/api/clients/` - Gestión de clientes
- `/api/subscribe/` - Suscripciones
- `/api/cancel/` - Cancelaciones
- `/api/deposit/` - Depósitos

## 🧪 Panel de Pruebas de API

La aplicación incluye un panel completo para probar todas las APIs:

1. **Configuración**: Ajusta parámetros de prueba
2. **Categorías**: Pruebas organizadas por funcionalidad
3. **Resultados**: Visualización en tiempo real
4. **Scroll automático**: Navegación fluida

## 🔒 Seguridad

- **CORS** manejado correctamente
- **Headers de seguridad** configurados
- **Validación** de datos en frontend

## 📊 Monitoreo

- **Health checks** automáticos
- **Logs** estructurados
- **Estado** de contenedores

## 🚀 Despliegue en Producción

### Variables de Entorno
```bash
NODE_ENV=production
```

### Puertos
- **3000**: Aplicación principal
- **3001**: Desarrollo

### Comandos Útiles

```bash
# Ver logs en tiempo real
docker-compose logs -f funds-frontend

# Reiniciar servicio
docker-compose restart funds-frontend

# Ver uso de recursos
docker stats

# Backup de datos
docker-compose exec funds-frontend tar -czf backup.tar.gz /app/dist
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- **Email**: [tu-email@ejemplo.com]
- **Issues**: [GitHub Issues](https://github.com/tu-usuario/funds-frontend/issues)

---

**¡Disfruta desarrollando con Fondos de Inversión! 🎉**
