// ============================================================
// UTILITÁRIOS GLOBAIS
// ============================================================

import { ApiError } from './api';

interface FieldMessage {
  fieldName: string;
  message: string;
}

// Corpo real de erro devolvido pelo ResourceExceptionHandler do backend:
// StandardError { status, msg, timeStamp, path }; ValidationError (subclasse)
// adiciona 'erros: FieldMessage[]'.
interface BackendErrorBody {
  erros?: FieldMessage[];
  msg?: string;
}

/**
 * Converte um erro da API em uma mensagem amigável ao usuário.
 * Trata erros de validação de campo (400) com a lista real de problemas.
 *
 * @param context 'auth' para login/cadastro, 'password' para troca de senha
 *   (muda o significado de 401/403, que têm causas diferentes em cada fluxo),
 *   'admin' para as ações administrativas (promover/excluir usuário).
 */
export function friendlyError(err: unknown, context: 'auth' | 'password' | 'admin' = 'auth'): string {
  if (err instanceof ApiError) {
    if (context === 'password') {
      if (err.status === 401) return 'Senha atual incorreta.';
      if (err.status === 403)
        return 'Esta conta foi criada com login do Google e não possui senha local. Não é possível alterá-la.';
    } else if (context === 'admin') {
      // O backend já manda a mensagem certa (msg) para esses casos —
      // ex: "ADMIN só pode excluir usuários com role CLIENTE.",
      // "Não é possível excluir a própria conta por este endpoint.",
      // "Usuário já possui privilégios administrativos." — então só
      // repassamos abaixo via err.message, sem sobrescrever.
    } else {
      if (err.status === 401) return 'E-mail ou senha incorretos.';
      if (err.status === 409) return 'Este e-mail já está cadastrado.';
    }

    // Erros de validação de campo: a API devolve { erros: [{ fieldName, message }] }
    if (err.status === 400) {
      const body = err.data as BackendErrorBody | undefined;
      if (body?.erros && body.erros.length > 0) {
        const fieldLabels: Record<string, string> = {
          name: 'Nome',
          email: 'E-mail',
          password: 'Senha',
          currentPassword: 'Senha atual',
          newPassword: 'Nova senha',
          word: 'Palavra',
        };
        return body.erros
          .map((e) => {
            const label = fieldLabels[e.fieldName] ?? e.fieldName;
            return `${label}: ${e.message}`;
          })
          .join(' • ');
      }
      return body?.msg ?? 'Dados inválidos. Verifique os campos.';
    }

    return err.message ?? 'Ocorreu um erro. Tente novamente.';
  }
  return 'Não foi possível conectar ao servidor.';
}

/**
 * Formata uma data ISO para exibição em pt-BR.
 */
export function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(isoString));
}

/**
 * Trunca um ID para exibição amigável.
 */
export function shortId(id: string, length = 8): string {
  return id.slice(0, length) + '...';
}
