import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Layout
import AppLayout from '../components/layout/AppLayout';

// Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ThemesPage from '../pages/themes/ThemesPage';
import ChallengesPage from '../pages/challenges/ChallengesPage';
import ProfilePage from '../pages/profile/ProfilePage';
import NotFoundPage from '../pages/NotFoundPage';

// Components
import PageLoader from '../components/ui/PageLoader';

// ----------------------------------------------------------------
// Guards de rota
// ----------------------------------------------------------------

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? <>{children}</> : <Navigate to="/" replace />;
}

// ----------------------------------------------------------------
// Rotas da aplicação
// ----------------------------------------------------------------

export default function AppRouter() {
  return (
    <Routes>
      {/* Rotas públicas (auth) */}
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/cadastro"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Rotas privadas */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <AppLayout>
              <ThemesPage />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/themes/:themeId/challenges"
        element={
          <PrivateRoute>
            <AppLayout>
              <ChallengesPage />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <PrivateRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </PrivateRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
