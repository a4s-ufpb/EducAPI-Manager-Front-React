// ============================================================
// CLIENTE HTTP — integrado com a EducAPI (Spring Boot)
// Base path: /v1/api/
// Troque VITE_API_URL no .env pela URL do seu deploy
// ============================================================

import type { User, Theme, Challenge } from '../types';

const BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/$/, '');
const API = `${BASE_URL}/v1/api`;

// ---- Token helpers ----
export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function saveToken(token: string): void {
  localStorage.setItem('token', token);
}

export function removeToken(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// Lê o id do usuário logado a partir do localStorage (usado como fallback
// para authorId em respostas de create/update que não trazem 'creator').
function getCurrentUserId(): string {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return '';
    const u = JSON.parse(raw) as { id?: string | number };
    return u.id != null ? String(u.id) : '';
  } catch {
    return '';
  }
}

// ---- Erro customizado ----
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ---- Request base ----
async function request<T>(path: string, options: RequestInit = {}, tokenOverride?: string): Promise<T> {
  const token = tokenOverride ?? getToken();

  // Quando o body é FormData, não definimos Content-Type:
  // o browser define automaticamente (multipart/form-data; boundary=...)
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      (body as { message?: string }).message ?? `Erro ${res.status}`,
      res.status,
      body
    );
  }

  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

// ----------------------------------------------------------------
// AUTH
// ----------------------------------------------------------------
export const authApi = {
  /**
   * POST /v1/api/auth/login  →  { token }
   * Busca o usuário em seguida via GET /auth/users
   */
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const { token } = await request<{ token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const user = await authApi.me(token);
    return { token, user };
  },

  /**
   * POST /v1/api/users  →  UserDTO  (sem token)
   * Faz login automaticamente logo após para obter o token.
   */
  register: async (name: string, email: string, password: string): Promise<{ token: string; user: User }> => {
    await request<User>('/users', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    return authApi.login(email, password);
  },

  /**
   * GET /v1/api/auth/users  →  User
   * Garante que o id venha como string para comparação consistente com authorId.
   */
  me: (tokenOverride?: string): Promise<User> =>
    request<User>('/auth/users', {}, tokenOverride).then((u) => ({ ...u, id: String(u.id) })),

  /**
   * POST /v1/api/auth/login/google  →  { token }
   * Envia o Google ID Token para o backend validar e retorna o JWT do sistema.
   * O backend cria o usuário automaticamente se for o primeiro acesso.
   */
  googleLogin: async (googleIdToken: string): Promise<{ token: string; user: User }> => {
    const { token } = await request<{ token: string }>('/auth/login/google', {
      method: 'POST',
      body: JSON.stringify({ googleIdToken }),
    });
    const user = await authApi.me(token);
    return { token, user };
  },

  /**
   * PUT /v1/api/auth/users/password  →  UserDTO
   * Troca a senha do usuário logado. O backend retorna 403 (GoogleAccountException)
   * se a conta tiver sido criada via login com Google (não possui senha local).
   */
  changePassword: (currentPassword: string, newPassword: string): Promise<User> =>
    request<User>('/auth/users/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }).then((u) => ({ ...u, id: String(u.id) })),

  /**
   * DELETE /v1/api/auth/users  →  UserDTO
   * Exclui a conta do usuário logado. Funciona tanto para contas locais
   * quanto para contas Google.
   */
  deleteAccount: (): Promise<void> => request<void>('/auth/users', { method: 'DELETE' }),
};

// ----------------------------------------------------------------
// TEMAS  →  Contexts na API
// ----------------------------------------------------------------
interface ApiContext {
  id: number;
  name: string;
  imageUrl?: string;
  soundUrl?: string;
  videoUrl?: string;
  creator?: { id: number; name: string; email: string };
}

function contextToTheme(c: ApiContext, fallbackAuthorId = ''): Theme {
  return {
    id: String(c.id),
    text: c.name,
    authorId: c.creator ? String(c.creator.id) : fallbackAuthorId,
    createdAt: '',
    imageUrl: c.imageUrl,
    soundUrl: c.soundUrl,
    videoUrl: c.videoUrl,
  };
}

export const themesApi = {
  /**
   * GET /v1/api/contexts?size=100
   * Endpoint público — retorna temas de TODOS os usuários (sem auth).
   * Usado para que qualquer visitante veja todos os temas cadastrados.
   */
  list: (): Promise<Theme[]> =>
    request<{ content: ApiContext[] }>('/contexts?size=100', { headers: { Authorization: '' } })
      .then((page) => page.content.map(contextToTheme)),

  /** POST /v1/api/auth/contexts (JSON ou multipart, se houver arquivo) */
  create: (name: string, imageUrl = '', soundUrl = '', videoUrl = '', file?: File | null): Promise<Theme> => {
    if (file) {
      const form = new FormData();
      form.append('name', name);
      form.append('soundUrl', soundUrl);
      form.append('videoUrl', videoUrl);
      form.append('file', file);
      return request<ApiContext>('/auth/contexts', {
        method: 'POST',
        body: form,
      }).then((c) => contextToTheme(c, getCurrentUserId()));
    }
    return request<ApiContext>('/auth/contexts', {
      method: 'POST',
      body: JSON.stringify({ name, imageUrl, soundUrl, videoUrl }),
    }).then((c) => contextToTheme(c, getCurrentUserId()));
  },

  /** PUT /v1/api/auth/contexts/{id} (JSON ou multipart, se houver arquivo) */
  update: (id: string, name: string, imageUrl = '', soundUrl = '', videoUrl = '', file?: File | null): Promise<Theme> => {
    if (file) {
      const form = new FormData();
      form.append('name', name);
      form.append('soundUrl', soundUrl);
      form.append('videoUrl', videoUrl);
      form.append('file', file);
      return request<ApiContext>(`/auth/contexts/${id}`, {
        method: 'PUT',
        body: form,
      }).then((c) => contextToTheme(c, getCurrentUserId()));
    }
    return request<ApiContext>(`/auth/contexts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, imageUrl, soundUrl, videoUrl }),
    }).then((c) => contextToTheme(c, getCurrentUserId()));
  },

  /** DELETE /v1/api/auth/contexts/{id} */
  remove: (id: string): Promise<void> =>
    request<void>(`/auth/contexts/${id}`, { method: 'DELETE' }),
};

// ----------------------------------------------------------------
// DESAFIOS  →  Challenges na API
// ----------------------------------------------------------------
interface ApiChallenge {
  id: number;
  word: string;
  imageUrl?: string;
  soundUrl?: string;
  videoUrl?: string;
  creator?: { id: number; name: string; email: string };
}

// Formato retornado por GET /contexts/{idContext}
interface ApiContextWithChallenges {
  id: number;
  name: string;
  challenges: ApiChallenge[];
}

function apiChallengeToChallenge(c: ApiChallenge, themeId: string, fallbackAuthorId = ''): Challenge {
  return {
    id: String(c.id),
    text: c.word,
    imageUrl: c.imageUrl ?? '',
    soundUrl: c.soundUrl,
    videoUrl: c.videoUrl,
    authorId: c.creator ? String(c.creator.id) : fallbackAuthorId,
    themeId,
    createdAt: '',
  };
}

export const challengesApi = {
  /**
   * GET /v1/api/contexts/{idContext}
   * Busca o contexto pelo ID (sem auth) e extrai apenas os desafios dele.
   * Isso garante que só os desafios do tema selecionado sejam exibidos.
   */
  list: (themeId: string): Promise<Challenge[]> =>
    request<ApiContextWithChallenges>(`/contexts/${themeId}`, { headers: { Authorization: '' } }).then(
      (ctx) => (ctx.challenges ?? []).map((c) => apiChallengeToChallenge(c, themeId))
    ),

  /** POST /v1/api/auth/challenges/{idContext} (JSON ou multipart, se houver arquivo) */
  create: (themeId: string, word: string, imageUrl = '', soundUrl = '', videoUrl = '', file?: File | null): Promise<Challenge> => {
    if (file) {
      const form = new FormData();
      form.append('word', word);
      form.append('soundUrl', soundUrl);
      form.append('videoUrl', videoUrl);
      form.append('file', file);
      return request<ApiChallenge>(`/auth/challenges/${themeId}`, {
        method: 'POST',
        body: form,
      }).then((c) => apiChallengeToChallenge(c, themeId, getCurrentUserId()));
    }
    return request<ApiChallenge>(`/auth/challenges/${themeId}`, {
      method: 'POST',
      body: JSON.stringify({ word, imageUrl, soundUrl, videoUrl }),
    }).then((c) => apiChallengeToChallenge(c, themeId, getCurrentUserId()));
  },

  /** PUT /v1/api/auth/challenges/{idChallenge} (JSON ou multipart, se houver arquivo) */
  update: (themeId: string, id: string, word: string, imageUrl = '', soundUrl = '', videoUrl = '', file?: File | null): Promise<Challenge> => {
    if (file) {
      const form = new FormData();
      form.append('word', word);
      form.append('soundUrl', soundUrl);
      form.append('videoUrl', videoUrl);
      form.append('file', file);
      return request<ApiChallenge>(`/auth/challenges/${id}`, {
        method: 'PUT',
        body: form,
      }).then((c) => apiChallengeToChallenge(c, themeId, getCurrentUserId()));
    }
    return request<ApiChallenge>(`/auth/challenges/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ word, imageUrl, soundUrl, videoUrl }),
    }).then((c) => apiChallengeToChallenge(c, themeId, getCurrentUserId()));
  },

  /** DELETE /v1/api/auth/challenges/{idChallenge} */
  remove: (_themeId: string, id: string): Promise<void> =>
    request<void>(`/auth/challenges/${id}`, { method: 'DELETE' }),
};
