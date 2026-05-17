# AlfabetizaHub — Frontend

Frontend React + TypeScript com estrutura profissional e modular.

---

## 🗂️ Estrutura de Pastas

```
src/
├── App.tsx                        # Raiz da aplicação (mínimo: providers + router)
├── main.tsx                       # Entry point
├── index.css                      # Estilos globais (Tailwind)
│
├── types/                         # Tipagens globais compartilhadas
│   └── index.ts                   # User, Theme, Challenge, AuthContextType...
│
├── lib/                           # Lógica pura, sem React
│   ├── api.ts                     # Cliente HTTP, ApiError e todos os endpoints
│   └── utils.ts                   # Funções utilitárias (friendlyError, formatDate...)
│
├── context/                       # Contextos React (estado global)
│   └── AuthContext.tsx            # AuthProvider + useAuthContext
│
├── hooks/                         # Hooks customizados reutilizáveis
│   ├── useAuth.ts                 # Atalho para useAuthContext
│   ├── useThemes.ts               # CRUD de temas com estado local
│   ├── useChallenges.ts           # CRUD de desafios com estado local
│   └── useGoogleLogin.ts          # Lógica do Google Identity Services
│
├── router/                        # Configuração de rotas
│   └── index.tsx                  # Todas as rotas + guards PrivateRoute/PublicRoute
│
├── components/
│   ├── layout/                    # Componentes de estrutura de página
│   │   └── AppLayout.tsx          # Header + Main + Footer
│   │
│   ├── ui/                        # Componentes de UI genéricos e reutilizáveis
│   │   ├── Spinner.tsx            # Loading spinner animado
│   │   ├── PageLoader.tsx         # Tela cheia de carregamento
│   │   ├── ErrorMessage.tsx       # Alerta de erro animado
│   │   └── EmptyState.tsx         # Estado vazio reutilizável
│   │
│   └── shared/                    # Componentes de domínio reutilizáveis
│       ├── GoogleButton.tsx       # Botão de login com Google
│       ├── AuthDivider.tsx        # Divisor "ou" entre opções de auth
│       ├── ThemeCard.tsx          # Card de um tema
│       ├── ThemeForm.tsx          # Form inline de criação de tema
│       ├── ChallengeCard.tsx      # Card de um desafio
│       └── ChallengeForm.tsx      # Form de criação/edição de desafio
│
└── pages/                         # Uma pasta por rota/tela
    ├── auth/
    │   ├── LoginPage.tsx          # Tela de login (/auth)
    │   └── RegisterPage.tsx       # Tela de cadastro (/auth/cadastro)
    ├── themes/
    │   └── ThemesPage.tsx         # Listagem de temas (/)
    ├── challenges/
    │   └── ChallengesPage.tsx     # Desafios de um tema (/themes/:id/challenges)
    └── NotFoundPage.tsx           # Página 404 (*) 
```

---

## 🚀 Instalação

```bash
npm install
cp .env.example .env
# Edite o .env com as suas variáveis
npm run dev
```

---

## 🔑 Variáveis de Ambiente

| Variável              | Descrição                                         |
|-----------------------|---------------------------------------------------|
| `VITE_API_URL`        | URL base da sua API REST                         |
| `VITE_GOOGLE_CLIENT_ID` | Client ID do Google Cloud Console (OAuth 2.0) |

---

## 📡 Rotas da Aplicação

| Rota                              | Página             | Proteção  |
|-----------------------------------|--------------------|-----------|
| `/auth`                           | LoginPage          | Público   |
| `/auth/cadastro`                  | RegisterPage       | Público   |
| `/`                               | ThemesPage         | Privado   |
| `/themes/:themeId/challenges`     | ChallengesPage     | Privado   |
| `*`                               | NotFoundPage       | —         |

---

## 🧩 Princípios da Arquitetura

- **Pages** — Orquestram os hooks e montam a UI. Sem lógica de negócio direta.
- **Hooks** — Contêm todo o estado e chamadas de API. Reutilizáveis em qualquer page.
- **Components/shared** — Componentes de domínio (ThemeCard, ChallengeForm) sem estado próprio de dados.
- **Components/ui** — Componentes genéricos (Spinner, EmptyState) sem dependência de domínio.
- **Lib** — Funções puras, sem React. Fácil de testar isoladamente.
- **Types** — Fonte única de verdade para os tipos de dados da aplicação.
