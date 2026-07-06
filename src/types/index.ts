// ============================================================
// TIPOS GLOBAIS DA APLICAÇÃO
// ============================================================

export type Role = 'CLIENTE' | 'ADMIN' | 'SYSADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  /** true quando a conta foi criada via login com Google (sem senha local) */
  googleAccount?: boolean;
  /** Nível de acesso do usuário. Default no backend é CLIENTE. */
  role: Role;
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
  /** true se o usuário logado tem role ADMIN ou SYSADMIN */
  isAdmin: boolean;
  /** true se o usuário logado tem role SYSADMIN */
  isSysAdmin: boolean;
}

// ----------------------------------------------------------------
// ADMINISTRAÇÃO (ADMIN / SYSADMIN)
// ----------------------------------------------------------------

/** Usuário retornado pela listagem administrativa (GET /admin/users) */
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export type AcaoAuditoria =
  | 'LOGIN'
  | 'CRIACAO_TEMA'
  | 'EXCLUSAO_TEMA'
  | 'CRIACAO_DESAFIO'
  | 'EXCLUSAO_DESAFIO'
  | 'EXCLUSAO_USUARIO'
  | 'PROMOCAO_ADMIN'
  | 'DEMOCAO_ADMIN'
  | 'LIMPEZA_LOGS';

export interface LogAuditoria {
  id: string;
  atorEmail: string;
  atorNome: string;
  acao: AcaoAuditoria;
  tipoEntidade: string;
  entidadeId: string | null;
  detalhes: string | null;
  timestamp: string;
}

/** Resultado de uma limpeza de logs por retenção (DELETE /admin/logs). */
export interface LimpezaLogsResult {
  removidos: number;
  diasRetencao: number;
  cortadoEm: string;
}

/** Formato de página do Spring Data usado por /admin/users e /admin/logs */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean;
}
