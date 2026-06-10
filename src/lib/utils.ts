// ============================================================
// UTILITÁRIOS GLOBAIS
// ============================================================

import { ApiError } from './api';

interface FieldMessage {
  fieldName: string;
  message: string;
}

interface ValidationErrorBody {
  errors?: FieldMessage[];
  message?: string;
}

/**
 * Converte um erro da API em uma mensagem amigável ao usuário.
 * Trata erros de validação de campo (400) com a lista real de problemas.
 */
export function friendlyError(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 401) return 'E-mail ou senha incorretos.';
    if (err.status === 409) return 'Este e-mail já está cadastrado.';

    // Erros de validação de campo: a API devolve { errors: [{ fieldName, message }] }
    if (err.status === 400) {
      const body = err.data as ValidationErrorBody | undefined;
      if (body?.errors && body.errors.length > 0) {
        const fieldLabels: Record<string, string> = {
          name: 'Nome',
          email: 'E-mail',
          password: 'Senha',
          word: 'Palavra',
        };
        return body.errors
          .map((e) => {
            const label = fieldLabels[e.fieldName] ?? e.fieldName;
            return `${label}: ${e.message}`;
          })
          .join(' • ');
      }
      return body?.message ?? 'Dados inválidos. Verifique os campos.';
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
