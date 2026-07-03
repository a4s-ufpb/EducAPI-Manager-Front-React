import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Necessário para o hot-reload funcionar dentro de containers Docker
    // (bind mounts nem sempre propagam eventos nativos do filesystem).
    watch: {
      usePolling: true,
      interval: 300,
    },
    // Garante que o WebSocket do HMR conecte na porta certa quando
    // acessado de fora do container (ex: http://localhost:3000).
    hmr: {
      clientPort: 3000,
    },
  },
});
