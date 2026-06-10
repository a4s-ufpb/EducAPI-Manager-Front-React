// ============================================================
// HOOK DE LOGIN COM GOOGLE
// Usa initTokenClient que abre popup REAL (não One Tap).
// Envia o access_token ao backend que valida via tokeninfo.
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
 
    if (!clientId || clientId.includes('SEU_CLIENT_ID')) {
      onError('Configure o VITE_GOOGLE_CLIENT_ID no arquivo .env');
      return;
    }
 
    if (typeof google === 'undefined') {
      onError('Biblioteca do Google não carregada. Verifique o index.html.');
      return;
    }
 
    onLoadingChange(true);
 
    try {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'openid email profile',
        callback: async (tokenResponse: { access_token?: string; error?: string }) => {
          if (tokenResponse.error || !tokenResponse.access_token) {
            onError('Login com Google cancelado.');
            onLoadingChange(false);
            return;
          }
          try {
            await onSuccess(tokenResponse.access_token);
          } catch {
            onError('Erro ao autenticar com Google.');
          } finally {
            onLoadingChange(false);
          }
        },
      });
 
      // prompt: 'select_account' força o popup de seleção de conta sempre
      client.requestAccessToken({ prompt: 'select_account' });
    } catch {
      onError('Erro ao abrir o login com Google.');
      onLoadingChange(false);
    }
  };
 
  return { trigger };
}
 