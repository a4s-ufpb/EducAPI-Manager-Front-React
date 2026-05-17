// ============================================================
// TIPOS GLOBAIS DA APLICAÇÃO
// ============================================================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
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
}
