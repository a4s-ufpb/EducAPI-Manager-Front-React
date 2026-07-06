import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '../lib/api';
import type { AcaoAuditoria, LimpezaLogsResult, LogAuditoria } from '../types';

/**
 * Carrega o log de auditoria (GET /admin/logs), paginado, ordenado do mais
 * recente para o mais antigo, e filtrável por e-mail do ator e tipo de
 * ação. Também expõe a limpeza por retenção (DELETE /admin/logs). Toda a
 * seção /admin é restrita a SYSADMIN (ver SysAdminRoute em router/index.tsx).
 */
export function useAdminLogs() {
  const [logs, setLogs] = useState<LogAuditoria[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [atorEmail, setAtorEmail] = useState('');
  const [acao, setAcao] = useState<AcaoAuditoria | ''>('');

  const load = useCallback(
    (targetPage: number) => {
      setLoading(true);
      setError(null);
      return adminApi
        .listLogs({ atorEmail: atorEmail || undefined, acao: acao || undefined, page: targetPage, size: 20 })
        .then((result) => {
          setLogs(result.content);
          setPage(result.number);
          setTotalPages(result.totalPages);
        })
        .catch(() => setError('Erro ao carregar o log de auditoria.'))
        .finally(() => setLoading(false));
    },
    [atorEmail, acao]
  );

  useEffect(() => {
    load(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atorEmail, acao]);

  const limparAntigos = async (diasRetencao: number): Promise<LimpezaLogsResult> => {
    const resultado = await adminApi.limparLogs(diasRetencao);
    await load(0);
    return resultado;
  };

  return {
    logs,
    page,
    totalPages,
    loading,
    error,
    atorEmail,
    setAtorEmail,
    acao,
    setAcao,
    goToPage: (p: number) => load(p),
    limparAntigos,
  };
}
