# Análisis y Propuesta de Reestructuración - InvestigaODS

## 📋 Resumen del Plan

Después de analizar el documento **Plan-InvestigaODS.md**, he identificado:

### ✅ Lo que ya tenemos implementado:
1. **Estructura básica de autenticación** (AuthContext, login/logout)
2. **Dashboard Student Basic** - Vista para usuarios gratuitos
3. **Dashboard Student Pro** - Vista para usuarios premium
4. **Componentes UI de Figma** (Header, Footer, CourseProgress, ProBanner, CommunitySection)
5. **Routing básico** con React Router
6. **Protección de rutas** con MainLayout y PublicLayout
7. **Tipos TypeScript** básicos

### ❌ Lo que falta implementar según el plan oficial:

#### **1. ROLES Y PERMISOS (Crítico)**
- ✅ ADMIN - Implementado
- ❌ **INSTRUCTOR** - Falta completamente
- ✅ STUDENT (BASIC/PRO) - Parcialmente implementado

#### **2. RUTAS COMPLETAS**

**Rutas Públicas (Faltantes):**
- ❌ `/` - Home/Landing page
- ❌ `/register` - Registro de usuarios
- ❌ `/courses` - Catálogo de cursos
- ❌ `/courses/:slug` - Detalle de curso

**Rutas Estudiante (Faltantes):**
- ❌ `/learn/:courseId/:lessonId` - Vista de lección con reproductor
- ❌ `/certificates` - Mis certificados
- ❌ `/my-enrollments` - Mis inscripciones

**Rutas Instructor (Todas faltantes):**
- ❌ `/instructor` - Dashboard instructor
- ❌ `/instructor/courses` - Mis cursos como instructor
- ❌ `/instructor/courses/:id/builder` - Constructor de curso
- ❌ `/instructor/courses/:id/students` - Estudiantes de mi curso

**Rutas Admin (Todas faltantes):**
- ❌ `/admin` - Dashboard admin
- ❌ `/admin/users` - Gestión de usuarios
- ❌ `/admin/catalog` - Gestión de catálogo
- ❌ `/admin/subscriptions` - Gestión de suscripciones

**Rutas Utilidad (Faltantes):**
- ❌ `/plans` - Comparativa de planes
- ❌ `/certificates/verify` - Verificación pública de certificados

#### **3. TIPOS Y MODELO DE DATOS**
- ✅ **Actualizado** con todas las entidades del plan:
  - User, Course, Module, Lesson
  - Enrollment, LessonProgress, CourseProgress
  - Quiz, Question, Attempt, Answer
  - Certificate, Subscription, MembershipPlan
  - LiveClass, Cohort, Challenge, etc.

#### **4. FUNCIONALIDADES CLAVE FALTANTES**

**Gating por Plan/Tier:**
- ❌ Verificar `course.tierRequired` vs `user.planCode`
- ❌ Mostrar badges FREE/BASIC/PRO en cursos
- ❌ Callouts de upgrade cuando no cumple requisitos
- ❌ Bloqueo 403 en backend cuando plan insuficiente

**Sistema de Inscripciones:**
- ❌ Inscribirse a cursos
- ❌ Ver progreso por lección
- ❌ Marcar lecciones como completadas

**Sistema de Evaluaciones:**
- ❌ Quizzes y exámenes
- ❌ Intentos y respuestas
- ❌ Auto-calificación
- ❌ Visualización de resultados

**Certificados:**
- ❌ Generación de certificados
- ❌ Descarga de PDF
- ❌ Verificación pública con hash SHA256

**Funcionalidades PRO:**
- ❌ Clases en vivo (LiveClass)
- ❌ Desafíos y gamificación
- ❌ Leaderboard
- ❌ Cohortes para cursos guiados

#### **5. INTEGRACIÓN BACKEND**
- ❌ **Backend no existe** - Necesita implementarse completo en NestJS
- ❌ API endpoints no disponibles
- ❌ Base de datos MySQL no configurada
- ❌ Docker Compose no existe

---

## 🚀 Estado Actual de Implementación

### ✅ FASE A - Páginas Públicas (COMPLETADA)
- ✅ **Home** (`/`) - Landing page con hero, features, CTAs
- ✅ **Register** (`/register`) - Registro en 2 pasos con opción upgrade PRO
- ✅ **Courses** (`/courses`) - Catálogo con filtros y 6 cursos mock
- ✅ **CourseDetail** (`/courses/:slug`) - Detalle con gating y enrollment
- ✅ **Plans** (`/plans`) - Comparativa de planes con FAQ

### ✅ FASE B - Páginas Estudiante (COMPLETADA)
- ✅ **Learn** (`/learn/:courseId/:lessonId`) - Vista de lección con sidebar, video, markdown content
- ✅ **Certificates** (`/certificates`) - Galería de certificados con gating PRO

### ⏳ FASE C - Pendiente
- ❌ Páginas Instructor (4 páginas)
- ❌ Páginas Admin (4 páginas)
- ❌ Backend NestJS completo

---

## 📊 Resumen de lo Implementado

### Páginas Creadas (9 totales)
1. **Home** - Landing con hero y features
2. **Register** - 2 pasos: registro + upgrade opcional
3. **Login** - Formulario con mock auth
4. **Courses** - Catálogo con filtros ALL/FREE/PRO
5. **CourseDetail** - Detalle con módulos, lecciones, gating
6. **Plans** - Comparativa BASIC vs PRO con FAQ
7. **Learn** - Reproductor de lecciones con sidebar
8. **Certificates** - Galería con gating PRO
9. **Dashboards** - Basic y Pro (ya existían, actualizados)

### Sistema Completo
- ✅ **Routing**: 11 rutas configuradas (públicas + protegidas)
- ✅ **Autenticación**: Login con mock, localStorage, guards
- ✅ **Gating por Plan**: Verificación FREE vs PRO en cursos
- ✅ **Tipos TypeScript**: 250+ líneas de tipos completos
- ✅ **Mock Data**: Cursos, lecciones, certificados, planes
- ✅ **Responsive**: Diseño adaptable (pendiente mobile optimization)
- ✅ **Sin errores**: 0 errores de compilación TypeScript

---

#### A. Actualizar sistema de autenticación
- Actualizar AuthContext para manejar roles: ADMIN, INSTRUCTOR, STUDENT
- Actualizar User type para usar `firstName`, `lastName` en lugar de `name`
- Agregar `planCode` al User

#### B. Crear páginas públicas
1. **Home** (`/`) - Landing page con hero, features, CTA
2. **Register** (`/register`) - Formulario de registro con selector de plan
3. **Courses** (`/courses`) - Catálogo con filtros y badges de tier
4. **CourseDetail** (`/courses/:slug`) - Detalle con módulos y gating

#### C. Crear páginas estudiante
1. **Learn** (`/learn/:courseId/:lessonId`) - Vista de lección con navegación
2. **Certificates** (`/certificates`) - Galería de certificados descargables
3. **MyEnrollments** (`/my-enrollments`) - Lista de cursos inscritos

#### D. Crear páginas instructor
1. **InstructorDashboard** (`/instructor`) - Overview de mis cursos
2. **InstructorCourses** (`/instructor/courses`) - Lista editable
3. **CourseBuilder** (`/instructor/courses/:id/builder`) - Editor de contenido
4. **CourseStudents** (`/instructor/courses/:id/students`) - Progreso de alumnos

#### E. Crear páginas admin
1. **AdminDashboard** (`/admin`) - Métricas y stats
2. **AdminUsers** (`/admin/users`) - CRUD usuarios
3. **AdminCatalog** (`/admin/catalog`) - CRUD cursos
4. **AdminSubscriptions** (`/admin/subscriptions`) - Gestión planes

#### F. Crear páginas utilidad
1. **Plans** (`/plans`) - Comparativa de planes con pricing
2. **VerifyCertificate** (`/certificates/verify`) - Validador público

#### G. Implementar sistema de gating
- Guards por rol en routing
- Verificación de tier en componentes de curso
- UI de upgrade/paywall para funciones PRO

---

### **Fase 2: Backend (Posterior - fuera del alcance actual)**
- Setup NestJS + TypeORM + MySQL
- Docker Compose con servicios
- Implementar todos los módulos según plan
- API completa con Swagger
- Testing con Jest

---

## 🚀 Recomendación Inmediata

**Opción 1: Reestructuración completa (3-4 horas)**
- Crear todas las páginas de Fase 1
- Actualizar routing completo
- Implementar gating y roles
- Mock data para todas las vistas

**Opción 2: Incremental (recomendado)**
1. **Ahora:** Actualizar AuthContext y tipos para compatibilidad
2. **Luego:** Crear páginas públicas (Home, Register, Courses)
3. **Después:** Páginas estudiante con gating
4. **Finalmente:** Instructor y Admin

**Opción 3: Enfoque mínimo viable**
- Solo ajustar lo existente para alinear con el plan
- Crear Home, Register, Courses públicas
- Añadir página de Planes
- Dejar Instructor/Admin para cuando exista backend

---

## 📝 Archivos a modificar/crear

### Modificar:
- ✅ `src/types/index.ts` - Actualizado con tipos completos
- ✅ `src/utils/constants.ts` - Actualizado con rutas y planes
- ⏳ `src/context/AuthContext.tsx` - Añadir roles INSTRUCTOR
- ⏳ `src/App.tsx` - Routing completo con guards por rol
- ⏳ `src/pages/DashboardBasic.tsx` - Ajustar a nuevos tipos User
- ⏳ `src/pages/DashboardPro.tsx` - Ajustar a nuevos tipos User
- ⏳ `src/pages/Login.tsx` - Ajustar a nuevos tipos User

### Crear (15 nuevas páginas):
```
src/pages/
  ├── Home.tsx                    # Landing pública
  ├── Register.tsx                # Registro con plan selector
  ├── Courses.tsx                 # Catálogo público
  ├── CourseDetail.tsx            # Detalle con gating
  ├── Learn.tsx                   # Vista de lección
  ├── Certificates.tsx            # Mis certificados
  ├── MyEnrollments.tsx           # Mis inscripciones
  ├── Plans.tsx                   # Comparativa de planes
  ├── VerifyCertificate.tsx       # Verificador público
  ├── instructor/
  │   ├── InstructorDashboard.tsx
  │   ├── InstructorCourses.tsx
  │   ├── CourseBuilder.tsx
  │   └── CourseStudents.tsx
  └── admin/
      ├── AdminDashboard.tsx
      ├── AdminUsers.tsx
      ├── AdminCatalog.tsx
      └── AdminSubscriptions.tsx
```

---

## ❓ ¿Qué prefieres hacer?

1. **Reestructuración completa ahora** - Creo todas las páginas de Fase 1
2. **Incremental** - Empezamos por páginas públicas y vamos agregando
3. **Mínimo viable** - Solo esencial: Home, Register, Courses, Plans
4. **Solo ajustes** - Arreglar lo existente para alinear con plan oficial

Por favor indica cuál opción prefieres y continuamos.
