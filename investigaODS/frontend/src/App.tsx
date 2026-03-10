import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { MainLayout } from './layouts/MainLayout';
import { PublicLayout } from './layouts/PublicLayout';
import { 
  Home, 
  Login, 
  Register, 
  Courses, 
  CourseDetail,
  Plans,
  TestConnection,
  DashboardBasic, 
  DashboardPro,
  LeccionDemo,
  CourseLessonPage,
  Certificates,
  Explore,
  Community,
  Profile,
  EditProfile,
  MyCourses,
  CategoryPage,
  CoursesByTag,
  NotFound,
  InstructorDashboard,
  InstructorCourses,
  InstructorStudents,
  CourseCreate,
  CourseBuilder,
  CourseStudents,
  CourseManagement,
  StudentDetail,
  AdminDashboard,
  AdminUsers,
  AdminCatalog,
  AdminSubscriptions,
} from './pages';
import './App.css';

// Componente que maneja la redirección según el rol del usuario
const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirigir según el plan del usuario
  if (user.planCode === 'PRO') {
    return <Navigate to="/dashboard/pro" replace />;
  }

  return <Navigate to="/dashboard/basic" replace />;
};

// Componente de protección de ruta PRO
const ProtectProRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Solo usuarios con plan PRO pueden acceder
  if (user.planCode !== 'PRO') {
    return <Navigate to="/dashboard/basic" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:slug" element={<CourseDetail />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/test-conexion" element={<TestConnection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rutas protegidas */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardRouter />} />
            <Route path="/dashboard/basic" element={<DashboardBasic />} />
            <Route path="/dashboard/pro" element={<ProtectProRoute><DashboardPro /></ProtectProRoute>} />
            <Route path="/course/:courseId/lesson/:lessonId" element={<CourseLessonPage />} />
            <Route path="/lecciones/3" element={<LeccionDemo />} />
            <Route path="/certificates" element={<Certificates />} />
            
            {/* New student routes */}
            <Route path="/explore" element={<Explore />} />
            <Route path="/community" element={<Community />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/courses/tag/:tagName" element={<CoursesByTag />} />
            
            {/* Instructor routes */}
            <Route path="/instructor" element={<InstructorDashboard />} />
            <Route path="/instructor/courses" element={<InstructorCourses />} />
            <Route path="/instructor/courses/new" element={<CourseCreate />} />
            <Route path="/instructor/courses/:courseId/builder" element={<CourseBuilder />} />
            <Route path="/instructor/courses/:courseId/students" element={<CourseStudents />} />
            <Route path="/instructor/courses/:courseId/manage" element={<CourseManagement />} />
            <Route path="/instructor/students" element={<InstructorStudents />} />
            <Route path="/instructor/students/:studentId" element={<StudentDetail />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/catalog" element={<AdminCatalog />} />
            <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
          </Route>

          {/* Ruta 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
