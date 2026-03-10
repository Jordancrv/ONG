# InvestigaODS API

Este repositorio contiene el backend (NestJS + TypeORM) de la plataforma de aprendizaje.

## Notas de seguridad y acceso (Planes y Roles)

A partir del 2025-10-21, se ajustó la lógica del guard de planes (`PlansGuard`) para mejorar la experiencia de creación de contenido:

- Usuarios con rol INSTRUCTOR o ADMIN pueden acceder a funcionalidades premium sin requerir una suscripción PRO.
- Los estudiantes (rol STUDENT) sí deben contar con plan PRO activo para acceder a funcionalidades premium (p. ej., clases en vivo, retos/puntos).

Archivo relevante: `src/common/guards/plans.guard.ts`.

Motivación: permitir que creadores (instructores) y administradores puedan crear y administrar contenido premium sin fricción, mientras que los consumidores (estudiantes) mantienen el modelo de suscripción.

## Credenciales de prueba seed (backend + frontend)

Al ejecutar el seed (`npm run seed`) se crean estos usuarios alineados con el frontend:

- `estudiante@test.com` / `123456` - `STUDENT` con plan `BASIC`
- `pro@test.com` / `123456` - `STUDENT` con plan `PRO`
- `instructor@test.com` / `123456` - `INSTRUCTOR` con plan `BASIC`
- `admin@test.com` / `123456` - `ADMIN` con plan `BASIC`

Con Docker Compose principal, el backend ejecuta automaticamente `schema:sync` y `seed` al iniciar.

## Funcionalidades del API

### 🏥 Health & Status

#### `GET /api/health`
Health check básico - verifica estado de la app y base de datos.

**Ejemplo:**
```bash
curl http://localhost:3000/api/health
```

**Respuesta:**
```json
{"app":"ok","db":"ok"}
```

#### `GET /api/ready`
Readiness check - verifica si la aplicación está lista para recibir tráfico.

**Ejemplo:**
```bash
curl http://localhost:3000/api/ready
```

**Respuesta:**
```json
{"status":"ready"}
```

### 🔐 Autenticación

#### `POST /api/auth/register`
Registra un nuevo usuario (por defecto con rol STUDENT).

**Estructura:**
```json
{
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string"
}
```

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@example.com",
    "password": "Password123!",
    "firstName": "Nuevo",
    "lastName": "Usuario"
  }'
```

**Respuesta:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "nuevo@example.com",
    "firstName": "Nuevo",
    "lastName": "Usuario",
    "role": "STUDENT",
    "avatarUrl": null
  }
}
```

#### `POST /api/auth/login`
Inicia sesión y obtiene tokens de acceso.

**Estructura:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Respuesta:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 11,
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "role": "INSTRUCTOR"
  }
}
```

#### `POST /api/auth/refresh`
Refresca el token de acceso usando el refresh token de las cookies.

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Cookie: refreshToken=<tu_refresh_token>"
```

**Respuesta:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### `POST /api/auth/logout`
Cierra sesión e invalida el refresh token.

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer <tu_access_token>"
```

**Respuesta:**
```json
{
  "message": "Logged out successfully"
}
```

### 👤 Usuarios

#### `GET /api/users/me`
Obtiene el perfil del usuario autenticado.

**Ejemplo:**
```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer <tu_access_token>"
```

**Respuesta:**
```json
{
  "id": 11,
  "email": "test@example.com",
  "firstName": "Test",
  "lastName": "User",
  "role": "INSTRUCTOR",
  "avatarUrl": "https://example.com/avatar.jpg",
  "createdAt": "2025-10-17T14:58:37.182Z",
  "updatedAt": "2025-10-21T22:00:00.000Z"
}
```

#### `PATCH /api/users/me`
Actualiza el perfil del usuario (firstName, lastName, avatarUrl). El campo `role` es ignorado por seguridad.

**Estructura:**
```json
{
  "firstName": "string (opcional)",
  "lastName": "string (opcional)",
  "avatarUrl": "string (opcional)"
}
```

**Ejemplo:**
```bash
curl -X PATCH http://localhost:3000/api/users/me \
  -H "Authorization: Bearer <tu_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Nuevo Nombre",
    "avatarUrl": "https://example.com/nuevo-avatar.jpg"
  }'
```

**Respuesta:**
```json
{
  "id": 11,
  "email": "test@example.com",
  "firstName": "Nuevo Nombre",
  "lastName": "User",
  "role": "INSTRUCTOR",
  "avatarUrl": "https://example.com/nuevo-avatar.jpg",
  "updatedAt": "2025-10-22T00:15:00.000Z"
}
```

### 📚 Cursos

#### `GET /api/courses`
Lista todos los cursos disponibles.

**Ejemplo:**
```bash
curl http://localhost:3000/api/courses
```

**Respuesta:**
```json
[
  {
    "id": 7,
    "title": "Curso de Introducción",
    "slug": "curso-introduccion",
    "description": "Descripción del curso",
    "thumbnailUrl": null,
    "level": "BEGINNER",
    "visibility": "PUBLIC"
  }
]
```

#### `GET /api/courses/:id`
Obtiene el detalle completo de un curso específico.

**Ejemplo:**
```bash
curl http://localhost:3000/api/courses/7
```

**Respuesta:**
```json
{
  "id": 7,
  "title": "Curso de Introducción",
  "slug": "curso-introduccion",
  "description": "Descripción del curso",
  "summary": "Resumen breve",
  "owner": {
    "id": 11,
    "firstName": "Test",
    "lastName": "User"
  },
  "tags": [],
  "modules": []
}
```

#### `GET /api/courses/:id/outline`
Obtiene la estructura completa del curso con módulos y lecciones anidadas.

**Ejemplo:**
```bash
curl http://localhost:3000/api/courses/7/outline
```

**Respuesta:**
```json
{
  "id": 7,
  "title": "Curso de Introducción",
  "modules": [
    {
      "id": 1,
      "title": "Módulo 1",
      "order": 1,
      "lessons": [
        {
          "id": 1,
          "title": "Lección 1",
          "order": 1,
          "contentType": "VIDEO"
        }
      ]
    }
  ]
}
```

#### `POST /api/courses`
Crea un nuevo curso (requiere rol INSTRUCTOR o ADMIN).

**Estructura:**
```json
{
  "title": "string",
  "slug": "string",
  "description": "string",
  "summary": "string (opcional)",
  "thumbnailUrl": "string (opcional)",
  "level": "BEGINNER|INTERMEDIATE|ADVANCED (opcional)",
  "language": "string (opcional)",
  "visibility": "PUBLIC|PRIVATE (opcional)",
  "tierRequired": "FREE|PRO (opcional)"
}
```

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Authorization: Bearer <tu_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi Nuevo Curso",
    "slug": "mi-nuevo-curso",
    "description": "Descripción detallada del curso",
    "level": "BEGINNER"
  }'
```

#### `PATCH /api/courses/:id`
Actualiza un curso existente (solo el propietario).

**Estructura:** (todos los campos son opcionales)
```json
{
  "title": "string",
  "description": "string",
  "summary": "string",
  "thumbnailUrl": "string",
  "level": "BEGINNER|INTERMEDIATE|ADVANCED",
  "visibility": "PUBLIC|PRIVATE"
}
```

**Ejemplo:**
```bash
curl -X PATCH http://localhost:3000/api/courses/7 \
  -H "Authorization: Bearer <tu_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Descripción actualizada",
    "summary": "Nuevo resumen"
  }'
```

#### `DELETE /api/courses/:id`
Elimina un curso (solo el propietario).

**Ejemplo:**
```bash
curl -X DELETE http://localhost:3000/api/courses/7 \
  -H "Authorization: Bearer <tu_access_token>"
```

**Respuesta:**
```json
{"success": true}
```

#### `POST /api/courses/:id/modules`
Agrega un módulo a un curso (solo el propietario).

**Estructura:**
```json
{
  "title": "string",
  "description": "string (opcional)",
  "order": "number"
}
```

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/api/courses/7/modules \
  -H "Authorization: Bearer <tu_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Módulo 1: Introducción",
    "description": "Contenidos básicos",
    "order": 1
  }'
```

#### `POST /api/courses/modules/:id/lessons`
Agrega una lección a un módulo (solo el propietario del curso).

**Estructura:**
```json
{
  "title": "string",
  "description": "string (opcional)",
  "contentType": "VIDEO|TEXT|QUIZ|INTERACTIVE",
  "contentUrl": "string (opcional)",
  "duration": "number (opcional, en minutos)",
  "order": "number"
}
```

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/api/courses/modules/1/lessons \
  -H "Authorization: Bearer <tu_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Lección 1: Conceptos básicos",
    "contentType": "VIDEO",
    "contentUrl": "https://youtube.com/watch?v=abc123",
    "duration": 15,
    "order": 1
  }'
```

### 📖 Inscripciones

#### `POST /api/courses/:id/enroll`
Inscribe al usuario autenticado en un curso.

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/api/courses/7/enroll \
  -H "Authorization: Bearer <tu_access_token>"
```

**Respuesta:**
```json
{
  "id": 1,
  "enrolledAt": "2025-10-22T00:00:00.000Z",
  "course": {
    "id": 7,
    "title": "Curso de Introducción"
  },
  "user": {
    "id": 12,
    "email": "student@example.com"
  }
}
```

#### `GET /api/me/enrollments`
Lista todas las inscripciones del usuario autenticado.

**Ejemplo:**
```bash
curl http://localhost:3000/api/me/enrollments \
  -H "Authorization: Bearer <tu_access_token>"
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "enrolledAt": "2025-10-22T00:00:00.000Z",
    "course": {
      "id": 7,
      "title": "Curso de Introducción",
      "slug": "curso-introduccion"
    }
  }
]
```

#### `GET /api/courses/:id/students`
Lista todos los estudiantes inscritos en un curso (solo el propietario).

**Ejemplo:**
```bash
curl http://localhost:3000/api/courses/7/students \
  -H "Authorization: Bearer <tu_access_token>"
```

**Respuesta:**
```json
[
  {
    "id": 12,
    "email": "student@example.com",
    "firstName": "Student",
    "lastName": "User",
    "enrolledAt": "2025-10-22T00:00:00.000Z"
  }
]
```

### 📊 Progreso

#### `POST /api/progress/lessons/:id/progress`
Actualiza el progreso de una lección específica para el usuario autenticado.

**Estructura:**
```json
{
  "progressPct": "number (0-100, opcional)",
  "completed": "boolean (opcional)"
}
```

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/api/progress/lessons/1/progress \
  -H "Authorization: Bearer <tu_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "progressPct": 100,
    "completed": true
  }'
```

**Respuesta:**
```json
{
  "id": 1,
  "progressPct": 100,
  "completed": true,
  "lastViewedAt": "2025-10-22T00:00:00.000Z",
  "lesson": {
    "id": 1,
    "title": "Lección 1"
  }
}
```

#### `GET /api/progress/me/courses/:courseId`
Obtiene el progreso agregado del usuario en un curso completo.

**Ejemplo:**
```bash
curl http://localhost:3000/api/progress/me/courses/7 \
  -H "Authorization: Bearer <tu_access_token>"
```

**Respuesta:**
```json
{
  "courseId": 7,
  "totalLessons": 10,
  "completedLessons": 5,
  "progressPercentage": 50,
  "lessonProgress": [
    {
      "id": 1,
      "progressPct": 100,
      "completed": true,
      "lastViewedAt": "2025-10-22T00:00:00.000Z",
      "lesson": {
        "id": 1,
        "title": "Lección 1"
      }
    }
  ]
}
```

### 📝 Quizzes y Exámenes

#### `POST /api/lessons/:id/quizzes`
Crea un quiz para una lección (solo el propietario del curso).

**Estructura:**
```json
{
  "title": "string",
  "passingScore": "number (0-100)",
  "questions": [
    {
      "prompt": "string",
      "type": "MCQ|TRUE_FALSE|OPEN",
      "points": "number",
      "options": [
        {
          "text": "string",
          "isCorrect": "boolean"
        }
      ]
    }
  ]
}
```

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/api/lessons/1/quizzes \
  -H "Authorization: Bearer <tu_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Quiz de Introducción",
    "passingScore": 70,
    "questions": [
      {
        "prompt": "¿Cuál es la capital de Francia?",
        "type": "MCQ",
        "points": 10,
        "options": [
          {"text": "París", "isCorrect": true},
          {"text": "Londres", "isCorrect": false},
          {"text": "Berlín", "isCorrect": false}
        ]
      }
    ]
  }'
```

#### `GET /api/quizzes/:id`
Obtiene un quiz con todas sus preguntas (sin revelar respuestas correctas).

**Ejemplo:**
```bash
curl http://localhost:3000/api/quizzes/1 \
  -H "Authorization: Bearer <tu_access_token>"
```

**Respuesta:**
```json
{
  "id": 1,
  "title": "Quiz de Introducción",
  "passingScore": 70,
  "questions": [
    {
      "id": 1,
      "prompt": "¿Cuál es la capital de Francia?",
      "type": "MCQ",
      "points": 10,
      "options": [
        {"id": 1, "text": "París"},
        {"id": 2, "text": "Londres"},
        {"id": 3, "text": "Berlín"}
      ]
    }
  ]
}
```

#### `POST /api/quizzes/:id/attempts`
Inicia un nuevo intento de quiz.

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/api/quizzes/1/attempts \
  -H "Authorization: Bearer <tu_access_token>"
```

**Respuesta:**
```json
{
  "id": 1,
  "startedAt": "2025-10-22T00:00:00.000Z",
  "status": "IN_PROGRESS",
  "quiz": {
    "id": 1,
    "title": "Quiz de Introducción"
  }
}
```

#### `POST /api/attempts/:id/answers`
Registra la respuesta a una pregunta durante un intento.

**Estructura:**
```json
{
  "questionId": "number",
  "selectedOptionId": "number (para MCQ/TRUE_FALSE)",
  "openAnswer": "string (para OPEN)"
}
```

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/api/attempts/1/answers \
  -H "Authorization: Bearer <tu_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "questionId": 1,
    "selectedOptionId": 1
  }'
```

**Respuesta:**
```json
{
  "id": 1,
  "question": {"id": 1},
  "selectedOption": {"id": 1},
  "openAnswer": null
}
```

#### `POST /api/attempts/:id/submit`
Finaliza el intento y calcula la calificación.

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/api/attempts/1/submit \
  -H "Authorization: Bearer <tu_access_token>"
```

**Respuesta:**
```json
{
  "id": 1,
  "status": "COMPLETED",
  "score": 80,
  "submittedAt": "2025-10-22T00:05:00.000Z"
}
```

#### `GET /api/attempts/:id/result`
Obtiene el resultado detallado de un intento completado.

**Ejemplo:**
```bash
curl http://localhost:3000/api/attempts/1/result \
  -H "Authorization: Bearer <tu_access_token>"
```

**Respuesta:**
```json
{
  "id": 1,
  "score": 80,
  "passed": true,
  "status": "COMPLETED",
  "answers": [
    {
      "question": {
        "id": 1,
        "prompt": "¿Cuál es la capital de Francia?"
      },
      "selectedOption": {"id": 1, "text": "París"},
      "isCorrect": true,
      "points": 10
    }
  ]
}
```

### 🎓 Certificados

#### `POST /api/courses/:id/certificates/issue`
Emite un certificado a un estudiante (solo instructor/propietario del curso).

**Estructura:**
```json
{
  "userId": "number"
}
```

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/api/courses/7/certificates/issue \
  -H "Authorization: Bearer <tu_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 12
  }'
```

**Respuesta:**
```json
{
  "id": 1,
  "serialNumber": "CERT-2025-ABC123XYZ",
  "issuedAt": "2025-10-22T00:00:00.000Z",
  "course": {
    "id": 7,
    "title": "Curso de Introducción"
  },
  "user": {
    "id": 12,
    "firstName": "Student",
    "lastName": "User"
  }
}
```

#### `GET /api/me/certificates`
Lista todos los certificados obtenidos por el usuario autenticado.

**Ejemplo:**
```bash
curl http://localhost:3000/api/me/certificates \
  -H "Authorization: Bearer <tu_access_token>"
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "serialNumber": "CERT-2025-ABC123XYZ",
    "issuedAt": "2025-10-22T00:00:00.000Z",
    "course": {
      "id": 7,
      "title": "Curso de Introducción"
    }
  }
]
```

#### `GET /api/certificates/verify?serial=CERT-2025-ABC123XYZ`
Verifica la autenticidad de un certificado mediante su número de serie.

**Ejemplo:**
```bash
curl "http://localhost:3000/api/certificates/verify?serial=CERT-2025-ABC123XYZ"
```

**Respuesta:**
```json
{
  "valid": true,
  "certificate": {
    "serialNumber": "CERT-2025-ABC123XYZ",
    "issuedAt": "2025-10-22T00:00:00.000Z",
    "course": {
      "title": "Curso de Introducción"
    },
    "user": {
      "firstName": "Student",
      "lastName": "User"
    }
  }
}
```

### 🎯 Challenges y Puntos
_Requiere plan PRO para estudiantes. Instructores/Admin tienen acceso sin restricción._

#### `POST /api/courses/:courseId/challenges`
Crea un reto/desafío para un curso (solo INSTRUCTOR/ADMIN).

**Estructura:**
```json
{
  "title": "string",
  "description": "string",
  "points": "number",
  "rules": "string (opcional)"
}
```

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/api/courses/7/challenges \
  -H "Authorization: Bearer <tu_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Reto: Proyecto Final",
    "description": "Desarrolla una aplicación completa",
    "points": 100,
    "rules": "Debe incluir frontend y backend"
  }'
```

**Respuesta:**
```json
{
  "id": 1,
  "title": "Reto: Proyecto Final",
  "description": "Desarrolla una aplicación completa",
  "points": 100,
  "rules": "Debe incluir frontend y backend",
  "course": {
    "id": 7,
    "title": "Curso de Introducción"
  }
}
```

#### `POST /api/challenges/:id/submissions`
Envía una solución a un reto. **Al enviar, se asignan automáticamente los puntos del reto.**

**Estructura:**
```json
{
  "artifactUrl": "string"
}
```

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/api/challenges/1/submissions \
  -H "Authorization: Bearer <tu_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "artifactUrl": "https://github.com/usuario/proyecto-final"
  }'
```

**Respuesta:**
```json
{
  "id": 1,
  "artifactUrl": "https://github.com/usuario/proyecto-final",
  "status": "SUBMITTED",
  "submittedAt": "2025-10-22T00:00:00.000Z",
  "challenge": {
    "id": 1,
    "title": "Reto: Proyecto Final"
  }
}
```

#### `GET /api/me/points`
Obtiene los puntos acumulados por el usuario en todos los cursos.

**Ejemplo:**
```bash
curl http://localhost:3000/api/me/points \
  -H "Authorization: Bearer <tu_access_token>"
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "points": 100,
    "course": {
      "id": 7,
      "title": "Curso de Introducción"
    },
    "user": {
      "id": 12,
      "firstName": "Student",
      "lastName": "User"
    }
  }
]
```

### 🎥 Clases en Vivo
_Requiere plan PRO para estudiantes. Instructores/Admin tienen acceso sin restricción._

#### `POST /api/courses/:courseId/live-classes`
Crea una clase en vivo para un curso (solo INSTRUCTOR/ADMIN).

**Estructura:**
```json
{
  "title": "string",
  "description": "string (opcional)",
  "scheduledFor": "string (ISO 8601 date)",
  "meetingUrl": "string",
  "duration": "number (minutos, opcional)"
}
```

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/api/courses/7/live-classes \
  -H "Authorization: Bearer <tu_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sesión en Vivo: Q&A",
    "description": "Resolvemos todas tus dudas",
    "scheduledFor": "2025-10-25T18:00:00Z",
    "meetingUrl": "https://zoom.us/j/123456789",
    "duration": 60
  }'
```

**Respuesta:**
```json
{
  "id": 1,
  "title": "Sesión en Vivo: Q&A",
  "description": "Resolvemos todas tus dudas",
  "scheduledFor": "2025-10-25T18:00:00.000Z",
  "meetingUrl": "https://zoom.us/j/123456789",
  "duration": 60,
  "course": {
    "id": 7,
    "title": "Curso de Introducción"
  }
}
```

#### `GET /api/courses/:courseId/live-classes`
Lista todas las clases en vivo de un curso.

**Ejemplo:**
```bash
curl http://localhost:3000/api/courses/7/live-classes \
  -H "Authorization: Bearer <tu_access_token>"
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "title": "Sesión en Vivo: Q&A",
    "scheduledFor": "2025-10-25T18:00:00.000Z",
    "meetingUrl": "https://zoom.us/j/123456789",
    "duration": 60
  }
]
```

### 💳 Planes y Suscripciones

#### `GET /api/plans`
Lista todos los planes de membresía disponibles.

**Ejemplo:**
```bash
curl http://localhost:3000/api/plans
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "code": "BASIC",
    "name": "Basic",
    "features": {
      "live": false
    }
  },
  {
    "id": 2,
    "code": "PRO",
    "name": "Pro",
    "features": {
      "live": true
    }
  }
]
```

#### `GET /api/me/subscription`
Obtiene la suscripción actual del usuario autenticado.

**Ejemplo:**
```bash
curl http://localhost:3000/api/me/subscription \
  -H "Authorization: Bearer <tu_access_token>"
```

**Respuesta:**
```json
{
  "id": 1,
  "startDate": "2025-10-22T00:00:00.000Z",
  "endDate": null,
  "status": "ACTIVE",
  "plan": {
    "id": 1,
    "code": "BASIC",
    "name": "Basic"
  }
}
```

#### `POST /api/subscriptions/upgrade`
Mejora la suscripción del usuario a un plan superior.

**Estructura:**
```json
{
  "planCode": "PRO"
}
```

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/api/subscriptions/upgrade \
  -H "Authorization: Bearer <tu_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "planCode": "PRO"
  }'
```

**Respuesta:**
```json
{
  "id": 2,
  "startDate": "2025-10-22T00:00:00.000Z",
  "endDate": null,
  "status": "ACTIVE",
  "plan": {
    "id": 2,
    "code": "PRO",
    "name": "Pro"
  }
}
```

### 🔧 Administración
_Requiere rol ADMIN._

#### `GET /api/admin/users`
Lista todos los usuarios del sistema (solo ADMIN).

**Ejemplo:**
```bash
curl http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer <tu_admin_token>"
```

**Respuesta:**
```json
[
  {
    "id": 11,
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "role": "INSTRUCTOR",
    "createdAt": "2025-10-17T14:58:37.182Z"
  },
  {
    "id": 12,
    "email": "student@example.com",
    "firstName": "Student",
    "lastName": "User",
    "role": "STUDENT",
    "createdAt": "2025-10-20T10:00:00.000Z"
  }
]
```

#### `PATCH /api/admin/users/:id`
Actualiza cualquier usuario del sistema (solo ADMIN). Permite cambiar roles.

**Estructura:** (todos los campos son opcionales)
```json
{
  "firstName": "string",
  "lastName": "string",
  "role": "STUDENT|INSTRUCTOR|ADMIN",
  "avatarUrl": "string"
}
```

**Ejemplo:**
```bash
curl -X PATCH http://localhost:3000/api/admin/users/12 \
  -H "Authorization: Bearer <tu_admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "INSTRUCTOR",
    "lastName": "Updated"
  }'
```

**Respuesta:**
```json
{
  "id": 12,
  "email": "student@example.com",
  "firstName": "Student",
  "lastName": "Updated",
  "role": "INSTRUCTOR",
  "updatedAt": "2025-10-22T00:20:00.000Z"
}
```

### 💬 Chat

#### `POST /api/chat/message`
Envía un mensaje al sistema de chat.

**Estructura:**
```json
{
  "message": "string"
}
```

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/api/chat/message \
  -H "Authorization: Bearer <tu_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hola, tengo una pregunta sobre el curso"
  }'
```

**Estado:** ⚠️ Endpoint no probado

## Resumen de cobertura
- ✅ **Probado**: 37 endpoints
- ⚠️ **No probado**: 1 endpoint (POST chat/message)
- Total: 38 endpoints REST expuestos

## Cambios recientes
- Award de puntos al enviar un reto: ahora, al crear una submission de challenge, se asignan automáticamente los puntos definidos por el reto al usuario en el curso correspondiente.
- Perfil de usuario: se habilitó el campo `avatarUrl` en `PATCH /api/users/me`.
