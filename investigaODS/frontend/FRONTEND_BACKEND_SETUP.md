# Configuración Frontend-Backend InvestigaODS

## ✅ Cambios Realizados

### 1. Docker Compose
- **Modificado**: `docker-compose.yml`
- Corregida variable de entorno: `VITE_API_BASE_URL=http://backend:3000`
- Esto permite que el contenedor frontend se comunique con el contenedor backend

### 2. Dependencias
- **Agregado**: axios v1.7.2 en `package.json`
- Cliente HTTP para comunicación con el backend

### 3. Configuración de API
- **Creado**: `src/utils/api.ts`
  - Cliente axios configurado con interceptores
  - Manejo automático de tokens JWT
  - Refresh token automático en caso de expiración
  - Base URL desde variables de entorno

### 4. Servicios de API
- **Creado**: `src/services/api.service.ts`
  - `authService`: Login, registro, logout, perfil
  - `coursesService`: Obtener cursos, curso por ID, cursos inscritos
  - `enrollmentsService`: Inscribirse y desinscribirse de cursos
  - `progressService`: Seguimiento de progreso de lecciones
  - `usersService`: Actualizar perfil, cambiar contraseña
  - `plansService`: Obtener planes de suscripción

### 5. AuthContext Actualizado
- **Modificado**: `src/context/AuthContext.tsx`
  - Integración con API real del backend
  - Validación de sesión al cargar
  - Constante `USE_MOCK` para alternar entre mock/backend
  - Mantiene usuarios mock como fallback

### 6. Variables de Entorno
- **Creado**: `.env.example`
  - Plantilla para configuración local

## 🚀 Cómo Usar

### Modo Desarrollo con Backend Real

1. Instalar dependencias:
   ```bash
   cd frontend
   npm install
   ```

2. Crear archivo `.env` (copiar de `.env.example`):
   ```bash
   cp .env.example .env
   ```

3. Levantar servicios con Docker:
   ```bash
   docker-compose up --build
   ```

4. El frontend estará en: http://localhost:5173
5. El backend API estará en: http://localhost:3000/api
6. Swagger docs en: http://localhost:3000/api/docs

### Modo Mock (sin backend)

Cambiar en `src/context/AuthContext.tsx`:
```typescript
const USE_MOCK = true;
```

## 🔐 Endpoints Disponibles

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/profile` - Obtener perfil
- `POST /api/auth/refresh` - Refrescar token
- `GET /api/courses` - Lista de cursos
- `GET /api/courses/:id` - Curso específico
- `GET /api/enrollments/my-courses` - Mis cursos
- `POST /api/enrollments/:courseId` - Inscribirse
- Y más...

## 🔧 Próximos Pasos

1. Ejecutar `npm install` en el contenedor frontend
2. Verificar que el backend esté corriendo y respondiendo
3. Probar el login con credenciales del backend
4. Implementar servicios adicionales según necesidad
