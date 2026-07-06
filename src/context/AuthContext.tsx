import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi, saveToken, removeToken } from '../lib/api';
import type { AuthContextType, User } from '../types';

// ----------------------------------------------------------------
// Contexto
// ----------------------------------------------------------------
const AuthContext = createContext<AuthContextType | null>(null);

// ----------------------------------------------------------------
// Provider
// ----------------------------------------------------------------
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Ao iniciar, tenta recuperar o usuário salvo e valida o token
  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      setUser(JSON.parse(saved));
      // Valida o token com a API em background
      authApi
        .me()
        .then((u) => {
          setUser(u);
          localStorage.setItem('user', JSON.stringify(u));
        })
        .catch(() => {
          removeToken();
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user } = await authApi.login(email, password);
    saveToken(token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const register = async (name: string, email: string, password: string) => {
    const { token, user } = await authApi.register(name, email, password);
    saveToken(token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const loginWithGoogle = async (googleToken: string) => {
    const { token, user } = await authApi.googleLogin(googleToken);
    saveToken(token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  /**
   * PUT /auth/users/password. O backend rejeita com 403 (GoogleAccountException)
   * se a conta não tiver senha local (login via Google) — o erro é repassado
   * para quem chamar tratar (ver ProfilePage + friendlyError(err, 'password')).
   */
  const changePassword = async (currentPassword: string, newPassword: string) => {
    const updated = await authApi.changePassword(currentPassword, newPassword);
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  /** DELETE /auth/users. Funciona para contas locais e contas Google. */
  const deleteAccount = async () => {
    await authApi.deleteAccount();
    removeToken();
    setUser(null);
  };

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SYSADMIN';
  const isSysAdmin = user?.role === 'SYSADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        changePassword,
        deleteAccount,
        isAdmin,
        isSysAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ----------------------------------------------------------------
// Hook de consumo
// ----------------------------------------------------------------
export function useAuthContext(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext deve ser usado dentro de AuthProvider');
  return ctx;
}
