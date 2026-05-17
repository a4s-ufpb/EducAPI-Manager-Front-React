import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, LogIn, LogOut, BookOpen } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#141414] font-sans flex flex-col">
      {/* ── Header ── */}
      <header className="border-b border-[#141414]/10 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <BookOpen className="w-6 h-6 text-[#5A5A40]" />
            <span>AlfabetizaHub</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium hover:text-[#5A5A40] transition-colors flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Início</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-3 bg-[#5A5A40]/10 px-3 py-1.5 rounded-full border border-[#5A5A40]/20">
                {user.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                )}
                <span className="text-xs font-semibold text-[#5A5A40] hidden sm:block">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold uppercase tracking-wider text-[#5A5A40] hover:underline flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  Sair
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-2 bg-[#141414] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#141414]/90 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Entrar
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[#141414]/10 bg-white/50 backdrop-blur-sm py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-mono text-[#141414]/40 uppercase tracking-widest">
            AlfabetizaHub &copy; {new Date().getFullYear()} — Sistema de Gestão Educacional
          </p>
        </div>
      </footer>
    </div>
  );
}
