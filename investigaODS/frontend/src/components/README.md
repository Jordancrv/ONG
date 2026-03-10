# Componentes generados desde Figma

Este directorio contiene los componentes React generados automáticamente desde el diseño de Figma.

## Componentes disponibles

### 1. **Header**
- Navegación principal
- Logo de Investiga ODS
- Menú: Inicio, Explorar, Favoritos, Comunidad
- Botón de Perfil

### 2. **CourseProgress**
- Muestra lista de cursos iniciados
- Barras de progreso personalizables
- Información de profesor y porcentaje de avance

### 3. **ProBanner**
- Banner promocional de membresía PRO
- Lista de cursos exclusivos
- Botón CTA para contratar
- Icono de award

### 4. **CommunitySection**
- Galería de imágenes de la comunidad
- Título "Comunidad en acción"

### 5. **Footer**
- Logo de Investiga ODS
- Enlaces legales
- Enlaces de trabajo
- Redes sociales

## Uso

```tsx
import { Header, CourseProgress, ProBanner, CommunitySection, Footer } from './components';

// En tu componente
<Header onNavigate={handleNavigate} />
<CourseProgress courses={coursesData} />
<ProBanner onSubscribe={handleSubscribe} />
<CommunitySection />
<Footer />
```

## Assets

Las imágenes se cargan desde la API de Figma y están disponibles por 7 días. Para producción, descarga las imágenes y almacénalas localmente.

## Personalización

Todos los componentes usan inline styles basados en el diseño de Figma. Para personalizarlos:

1. Modifica los estilos directamente en cada componente
2. O extrae los estilos a archivos CSS/módulos CSS
3. O migra a un sistema de diseño con styled-components/emotion
