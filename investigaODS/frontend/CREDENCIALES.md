# 🔑 Credenciales de Acceso - InvestigaODS

## Usuarios de Prueba Disponibles

Todos los usuarios tienen la misma contraseña: **`123456`**

---

### 👨‍🎓 Estudiante BASIC (FREE)
- **Email:** `estudiante@test.com`
- **Contraseña:** `123456`
- **Rol:** STUDENT
- **Plan:** BASIC (gratuito)
- **Acceso a:**
  - Dashboard BASIC
  - Cursos gratuitos
  - Lecciones básicas
  - Vista limitada de certificados

**Redirige automáticamente a:** `/dashboard/basic`

---

### ⭐ Estudiante PRO
- **Email:** `pro@test.com`
- **Contraseña:** `123456`
- **Rol:** STUDENT
- **Plan:** PRO ($29/mes)
- **Acceso a:**
  - Dashboard PRO
  - Todos los cursos (FREE + PRO)
  - Certificados completos
  - Clases en vivo
  - Desafíos exclusivos

**Redirige automáticamente a:** `/dashboard/pro`

---

### 👨‍🏫 Instructor
- **Email:** `instructor@test.com`
- **Contraseña:** `123456`
- **Rol:** INSTRUCTOR
- **Plan:** BASIC
- **Acceso a:**
  - Panel de instructor (`/instructor`)
  - Gestión de cursos (`/instructor/courses`)
  - Editor de cursos (`/instructor/courses/:id/builder`)
  - Vista de estudiantes (`/instructor/courses/:id/students`)
  - Estadísticas de cursos
  - Gestión de contenido

**Redirige automáticamente a:** `/instructor`

---

### 👑 Administrador
- **Email:** `admin@test.com`
- **Contraseña:** `123456`
- **Rol:** ADMIN
- **Plan:** BASIC
- **Acceso a:**
  - Panel de administración (`/admin`)
  - Gestión de usuarios (`/admin/users`)
  - Gestión de catálogo (`/admin/catalog`)
  - Gestión de suscripciones (`/admin/subscriptions`)
  - Control total de la plataforma

**Redirige automáticamente a:** `/admin`

---

## 🚀 Cómo Usar

### Opción 1: Auto-completar desde la página de login
1. Ve a `/login`
2. Haz clic en cualquiera de los botones de credenciales de prueba
3. Los campos se llenarán automáticamente
4. Presiona "Iniciar Sesión"
5. Serás redirigido automáticamente según tu rol

### Opción 2: Ingreso manual
1. Ve a `/login`
2. Ingresa el email del usuario que quieras probar
3. Ingresa la contraseña: `123456`
4. Presiona "Iniciar Sesión"

---

## 🚪 Cerrar Sesión

Hay varias formas de cerrar sesión en la plataforma:

### **En Páginas de Estudiante:**
- **Home (/)**: Botón "Cerrar Sesión" en el header (cuando estás logueado)
- **Dashboard Basic/Pro**: Botón "Cerrar Sesión" en el componente Header
- **Learn (/learn/:courseId/:lessonId)**: Botón "Cerrar Sesión" en la barra superior derecha
- **Certificates (/certificates)**: Botón "Cerrar Sesión" en el header

### **En Páginas de Instructor:**
- Botón "Salir" en el header de todas las páginas:
  - InstructorDashboard
  - InstructorCourses
  - CourseBuilder
  - CourseStudents

### **En Páginas de Admin:**
- Botón "Salir" en el header de todas las páginas:
  - AdminDashboard
  - AdminUsers
  - AdminCatalog
  - AdminSubscriptions

**Nota:** Al cerrar sesión, se mostrará una confirmación y serás redirigido a la página de login.

---

## 🎯 Diferencias entre Roles

### Estudiante BASIC vs PRO
| Característica | BASIC | PRO |
|---|---|---|
| Cursos gratuitos | ✅ | ✅ |
| Cursos PRO | ❌ | ✅ |
| Certificados | Vista limitada | ✅ Completo |
| Clases en vivo | ❌ | ✅ |
| Desafíos | ❌ | ✅ |
| Soporte prioritario | ❌ | ✅ |
| Precio | $0 | $29/mes |

### Instructor
- Crear y editar cursos propios
- Ver estadísticas de estudiantes
- Gestionar módulos y lecciones
- Publicar/despublicar cursos
- No tiene acceso a funciones de admin

### Administrador
- Control total de la plataforma
- Gestionar todos los usuarios (cambiar roles, activar/desactivar)
- Aprobar/rechazar cursos de instructores
- Marcar cursos como destacados
- Ver todas las suscripciones
- Cancelar suscripciones
- Ver actividad reciente del sistema

---

## 🛠️ Configuración Técnica

El sistema de autenticación está en:
- **Archivo:** `/app/src/context/AuthContext.tsx`
- **Constante:** `MOCK_USERS`
- **Almacenamiento:** `localStorage` (key: `investiga_user`)

Para agregar más usuarios de prueba, edita el objeto `MOCK_USERS` en `AuthContext.tsx`.

---

## 📝 Notas Importantes

1. **Persistencia:** El usuario permanece logueado incluso después de refrescar la página (usa localStorage)
2. **Logout:** Usa el botón "Salir" en cualquier header para cerrar sesión
3. **Navegación automática:** Al hacer login, el sistema te redirige automáticamente según tu rol
4. **Sin backend:** Actualmente usa datos mock. Cuando se integre el backend NestJS, estos usuarios se reemplazarán por datos reales
5. **Validación:** El sistema valida email y contraseña. Si las credenciales son incorrectas, mostrará un error

---

## 🔄 Cambiar de Usuario

Para probar diferentes roles:
1. Cierra sesión con el botón "Salir"
2. Regresa a `/login`
3. Selecciona un usuario diferente de las credenciales de prueba
4. Inicia sesión y serás redirigido a la vista correspondiente

---

## ✨ Próximos Pasos

Cuando se implemente el backend:
- [ ] Reemplazar `MOCK_USERS` con llamada a API real
- [ ] Implementar JWT tokens
- [ ] Agregar refresh tokens
- [ ] Implementar recuperación de contraseña
- [ ] Agregar validación de email
- [ ] Implementar 2FA (opcional)
