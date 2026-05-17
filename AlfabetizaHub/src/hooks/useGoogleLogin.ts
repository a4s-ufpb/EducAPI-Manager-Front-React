// ============================================================
// HOOK DE LOGIN COM GOOGLE
// Encapsula toda a lógica do Google Identity Services
// ============================================================

declare const google: any;

interface UseGoogleLoginOptions {
  onSuccess: (accessToken: string) => Promise<void>;
  onError: (message: string) => void;
  onLoadingChange: (loading: boolean) => void;
}

export function useGoogleLogin({ onSuccess, onError, onLoadingChange }: UseGoogleLoginOptions) {
  const trigger = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      onError('VITE_GOOGLE_CLIENT_ID não configurado no .env');
      return;
    }

    if (typeof google === 'undefined') {
      onError('Biblioteca do Google não carregada. Verifique o index.html.');
      return;
    }

    onLoadingChange(true);

    const client = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'openid email profile',
      callback: async (response: any) => {
        if (response.error) {
          onError('Login com Google cancelado.');
          onLoadingChange(false);
          return;
        }
        try {
          await onSuccess(response.access_token);
        } catch {
          onError('Erro ao autenticar com Google.');
        } finally {
          onLoadingChange(false);
        }
      },
    });

    client.requestAccessToken();
  };

  return { trigger };
}
