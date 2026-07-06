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
import AdminLayout from '../pages/admin/AdminLayout';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminLogsPage from '../pages/admin/AdminLogsPage';

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

/**
 * Protege as rotas do painel de administração (gestão de usuários e log de
 * auditoria). Exclusivo do SYSADMIN — o ADMIN não acessa mais essa área;
 * seu poder fica restrito à moderação de temas/desafios (editar/excluir
 * conteúdo de qualquer autor), habilitada diretamente nos cards.
 */
function SysAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isSysAdmin } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/auth" replace />;
  return isSysAdmin ? <>{children}</> : <Navigate to="/" replace />;
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

      {/* Rotas de administração (exclusivo SYSADMIN) */}
      <Route
        path="/admin"
        element={
          <SysAdminRoute>
            <AppLayout>
              <AdminLayout />
            </AppLayout>
          </SysAdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/usuarios" replace />} />
        <Route path="usuarios" element={<AdminUsersPage />} />
        <Route path="logs" element={<AdminLogsPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
