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

## 🐳 Docker

O projeto tem suporte a Docker para dois cenários: **desenvolvimento** (com hot-reload) e **produção** (build estático servido por Nginx). Os dois usam o mesmo `Dockerfile`, através de *multi-stage build*.

### Como funciona

```
Dockerfile
├── deps          → instala as dependências (npm ci), reaproveitado pelos outros stages
├── development   → roda `npm run dev` (Vite dev server)
├── build         → roda `npm run build` (gera a pasta dist/)
└── production    → Nginx servindo os arquivos de dist/ (imagem final leve, sem Node)
```

- Em **produção**, as variáveis `VITE_*` são embutidas no bundle JS durante o build (é assim que o Vite funciona), então são passadas como *build args*, lidas automaticamente do seu `.env` pelo `docker-compose.yml`.
- Em **desenvolvimento**, o código local é montado como volume no container, então o `.env` é lido normalmente em runtime, igual rodando `npm run dev` fora do Docker.
- O `nginx.conf` tem uma regra de *SPA routing* (`try_files ... /index.html`) para o React Router funcionar corretamente em rotas acessadas direto pela URL (ex: `/themes/1/challenges`).

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/) instalados
- Um `.env` na raiz do projeto (`cp .env.example .env` e preencha as variáveis)

### Rodando em desenvolvimento

```bash
docker compose up frontend-dev
```

Acesse em **http://localhost:3000**. O hot-reload funciona normalmente ao editar os arquivos localmente (o Vite roda com *polling* de arquivos ativado, necessário para funcionar dentro do container).

Se editar o `Dockerfile` ou o `docker-compose.yml`, é preciso recriar o container:

```bash
docker compose down
docker compose up frontend-dev --build
```

### Rodando em produção

```bash
docker compose up frontend-prod --build
```

Acesse em **http://localhost:8080**. Essa imagem não tem hot-reload nem Node.js — é só o build estático (`dist/`) servido pelo Nginx, pronta pra deploy.

### Comandos úteis

| Comando                                       | O que faz                                        |
|------------------------------------------------|---------------------------------------------------|
| `docker compose up frontend-dev`                | Sobe o ambiente de desenvolvimento                |
| `docker compose up frontend-prod --build`       | Builda e sobe o ambiente de produção              |
| `docker compose down`                           | Para e remove os containers                       |
| `docker compose logs -f frontend-dev`           | Acompanha os logs em tempo real                   |
| `docker build --target production -t app .`     | Builda só a imagem de produção manualmente        |

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
