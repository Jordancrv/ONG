# InvestigaODS - Plataforma Educativa de Sostenibilidad

Plataforma educativa enfocada en los Objetivos de Desarrollo Sostenible (ODS) con sistema de roles y planes de suscripción.

## 🔑 Acceso Rápido - Credenciales de Prueba

**Todos los usuarios usan la contraseña:** `123456`

| Rol | Email | Acceso |
|-----|-------|--------|
| 👨‍🎓 **Estudiante BASIC** | `estudiante@test.com` | Dashboard gratuito, cursos FREE |
| ⭐ **Estudiante PRO** | `pro@test.com` | Dashboard PRO, todos los cursos, certificados |
| 👨‍🏫 **Instructor** | `instructor@test.com` | Gestión de cursos, estudiantes, contenido |
| 👑 **Administrador** | `admin@test.com` | Control total: usuarios, catálogo, suscripciones |

**📖 [Ver credenciales detalladas](./CREDENCIALES.md)**

---

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Acceder a la aplicación
http://localhost:5173
```

---

## 📁 Estructura del Proyecto

```
src/
├── pages/
│   ├── Home.tsx                    # Landing page
│   ├── Login.tsx                   # Login con credenciales de prueba
│   ├── Register.tsx                # Registro de usuarios
│   ├── Courses.tsx                 # Catálogo de cursos
│   ├── CourseDetail.tsx            # Detalle de curso
│   ├── Plans.tsx                   # Planes BASIC vs PRO
│   ├── DashboardBasic.tsx          # Dashboard estudiante FREE
│   ├── DashboardPro.tsx            # Dashboard estudiante PRO
│   ├── Learn.tsx                   # Visor de lecciones
│   ├── Certificates.tsx            # Galería de certificados
│   ├── instructor/
│   │   ├── InstructorDashboard.tsx # Panel instructor
│   │   ├── InstructorCourses.tsx   # Gestión de cursos
│   │   ├── CourseBuilder.tsx       # Editor de contenido
│   │   └── CourseStudents.tsx      # Progreso de estudiantes
│   └── admin/
│       ├── AdminDashboard.tsx      # Panel administrador
│       ├── AdminUsers.tsx          # Gestión de usuarios
│       ├── AdminCatalog.tsx        # Gestión de catálogo
│       └── AdminSubscriptions.tsx  # Gestión de suscripciones
├── context/
│   └── AuthContext.tsx             # Autenticación y usuarios mock
├── types/
│   └── index.ts                    # TypeScript definitions
└── utils/
    └── constants.ts                # Rutas, colores, datos mock
```

---

## 🎭 Roles y Permisos

### 👨‍🎓 Estudiante BASIC (FREE)
- ✅ Cursos gratuitos
- ✅ Lecciones básicas
- ❌ Cursos PRO bloqueados
- ❌ Certificados limitados

### ⭐ Estudiante PRO ($29/mes)
- ✅ Todos los cursos (FREE + PRO)
- ✅ Certificados completos
- ✅ Clases en vivo
- ✅ Desafíos exclusivos
- ✅ Soporte prioritario

### 👨‍🏫 Instructor
- ✅ Crear y editar cursos
- ✅ Ver estadísticas de estudiantes
- ✅ Gestionar módulos y lecciones
- ✅ Publicar/despublicar cursos

### 👑 Administrador
- ✅ Gestionar usuarios (cambiar roles, activar/desactivar)
- ✅ Aprobar/rechazar cursos
- ✅ Marcar cursos destacados
- ✅ Gestionar suscripciones
- ✅ Ver actividad del sistema

---

## 🛣️ Rutas Principales

### Públicas
- `/` - Home
- `/login` - Inicio de sesión
- `/register` - Registro
- `/courses` - Catálogo de cursos
- `/courses/:slug` - Detalle de curso
- `/plans` - Planes BASIC vs PRO

### Estudiantes
- `/dashboard/basic` - Dashboard FREE
- `/dashboard/pro` - Dashboard PRO
- `/learn/:courseId/:lessonId` - Visor de lecciones
- `/certificates` - Certificados

### Instructor
- `/instructor` - Dashboard
- `/instructor/courses` - Gestión de cursos
- `/instructor/courses/:id/builder` - Editor de curso
- `/instructor/courses/:id/students` - Estudiantes

### Administrador
- `/admin` - Dashboard
- `/admin/users` - Usuarios
- `/admin/catalog` - Catálogo
- `/admin/subscriptions` - Suscripciones

---

## 🎨 Stack Tecnológico

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Routing:** React Router DOM v6
- **Styling:** Inline styles (Figma-generated)
- **Auth:** Context API + localStorage (mock)
- **State:** React Hooks
- **Backend:** NestJS (pendiente integración)
- **Database:** MySQL (pendiente integración)

---

## 📝 Fases de Implementación

✅ **Fase A - Páginas Públicas** (5 páginas)
- Home, Register, Courses, CourseDetail, Plans

✅ **Fase B - Páginas Estudiante** (2 páginas)
- Learn, Certificates, Dashboards

✅ **Fase C - Páginas Instructor/Admin** (8 páginas)
- 4 páginas instructor + 4 páginas admin

⏳ **Fase D - Backend** (pendiente)
- API NestJS
- Base de datos MySQL
- Autenticación JWT
- Docker orchestration

---

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

---

## 📚 Documentación Adicional

- **[Credenciales de Acceso](./CREDENCIALES.md)** - Usuarios de prueba detallados
- **[Fase C Completada](./FASE_C_COMPLETADA.md)** - Resumen de páginas instructor/admin
- **[Plan del Proyecto](./public/docs/Plan-InvestigaODS.md)** - Arquitectura completa

---

## 🎯 Características Destacadas

- ✨ Sistema de roles completo (STUDENT, INSTRUCTOR, ADMIN)
- ✨ Planes FREE/BASIC y PRO con gating
- ✨ Navegación automática por rol
- ✨ Mock data realista para desarrollo
- ✨ 0 errores de TypeScript
- ✨ ~3,500+ líneas de código funcional
- ✨ Diseño responsive con inline styles

---

## 🤝 Contribuir

Este proyecto está en desarrollo activo. Para contribuir:
1. Fork el repositorio
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

---

## 📧 Contacto

Para más información sobre el proyecto InvestigaODS, consulta la documentación en `/public/docs/`.

---

**Estado actual:** ✅ Frontend completo | ⏳ Backend en desarrollo

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
