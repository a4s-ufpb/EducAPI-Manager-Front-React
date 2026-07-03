// ============================================================
// TIPOS GLOBAIS DA APLICAÇÃO
// ============================================================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  /** true quando a conta foi criada via login com Google (sem senha local) */
  googleAccount?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Theme {
  id: string;
  /** Campo 'name' da API (Context) */
  text: string;
  authorId: string;
  createdAt: string;
  imageUrl?: string;
  soundUrl?: string;
  videoUrl?: string;
}

export interface Challenge {
  id: string;
  /** Campo 'word' da API */
  text: string;
  imageUrl: string;
  soundUrl?: string;
  videoUrl?: string;
  authorId: string;
  themeId: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: (googleToken: string) => Promise<void>;
  logout: () => void;
  /** PUT /auth/users/password — bloqueado no backend (403) para contas Google */
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  /** DELETE /auth/users — funciona para qualquer tipo de conta */
  deleteAccount: () => Promise<void>;
}
