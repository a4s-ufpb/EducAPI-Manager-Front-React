import { useState } from 'react';
import { ScrollText, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useAdminLogs } from '../../hooks/useAdminLogs';
import { friendlyError } from '../../lib/utils';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import type { AcaoAuditoria } from '../../types';

const acaoLabel: Record<AcaoAuditoria, string> = {
  LOGIN: 'Login',
  CRIACAO_TEMA: 'Criação de tema',
  EXCLUSAO_TEMA: 'Exclusão de tema',
  CRIACAO_DESAFIO: 'Criação de desafio',
  EXCLUSAO_DESAFIO: 'Exclusão de desafio',
  EXCLUSAO_USUARIO: 'Exclusão de usuário',
  PROMOCAO_ADMIN: 'Promoção a admin',
  DEMOCAO_ADMIN: 'Rebaixamento de admin',
  LIMPEZA_LOGS: 'Limpeza de logs',
};

const acaoOptions = Object.keys(acaoLabel) as AcaoAuditoria[];

// Opções de retenção sugeridas com base nas práticas usuais de retenção de
// log de auditoria/alteração de dados para sistemas educacionais (a
// referência legal do Marco Civil da Internet cobre especificamente logs de
// acesso, com prazo mínimo de 6 meses; para o log de auditoria deste
// sistema — que registra alterações administrativas — 1 a 2 anos é uma
// janela comum). O valor mínimo aceito pelo backend é 30 dias.
const retencaoPresets = [
  { label: '6 meses', dias: 180 },
  { label: '1 ano', dias: 365 },
  { label: '2 anos', dias: 730 },
  { label: '5 anos', dias: 1825 },
];

// O backend agora grava o timestamp já em horário de Brasília (UTC-3),
// então basta formatar como horário local, sem nenhuma conversão de fuso
// adicional aqui.
function formatTimestamp(iso: string): string {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'medium',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function AdminLogsPage() {
  const {
    logs,
    page,
    totalPages,
    loading,
    error,
    atorEmail,
    setAtorEmail,
    acao,
    setAcao,
    goToPage,
    limparAntigos,
  } = useAdminLogs();

  const [diasRetencao, setDiasRetencao] = useState(365);
  const [limpando, setLimpando] = useState(false);
  const [limpezaError, setLimpezaError] = useState('');
  const [limpezaSucesso, setLimpezaSucesso] = useState('');

  const handleLimpar = async () => {
    setLimpezaError('');
    setLimpezaSucesso('');

    if (
      !window.confirm(
        `Remover permanentemente todos os registros de auditoria com mais de ${diasRetencao} dias?\n\n` +
          'Essa ação não pode ser desfeita.'
      )
    )
      return;

    setLimpando(true);
    try {
      const resultado = await limparAntigos(diasRetencao);
      setLimpezaSucesso(
        resultado.removidos === 0
          ? 'Nenhum registro estava fora do período de retenção.'
          : `${resultado.removidos} registro(s) removido(s) (anteriores a ${formatTimestamp(resultado.cortadoEm)}).`
      );
    } catch (err) {
      setLimpezaError(friendlyError(err, 'admin'));
    } finally {
      setLimpando(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Filtrar por e-mail do ator..."
          value={atorEmail}
          onChange={(e) => setAtorEmail(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-white border border-[#141414]/10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/30 transition-all text-sm"
        />
        <select
          value={acao}
          onChange={(e) => setAcao(e.target.value as AcaoAuditoria | '')}
          className="px-4 py-2.5 bg-white border border-[#141414]/10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/30 transition-all text-sm"
        >
          <option value="">Todas as ações</option>
          {acaoOptions.map((a) => (
            <option key={a} value={a}>
              {acaoLabel[a]}
            </option>
          ))}
        </select>
      </div>

      {/* Limpeza por retenção */}
      <div className="bg-white rounded-3xl border border-[#141414]/5 shadow-sm p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="text-sm font-semibold text-[#141414]">Limpar registros antigos</span>
          <div className="flex flex-wrap gap-2">
            {retencaoPresets.map((preset) => (
              <button
                key={preset.dias}
                onClick={() => setDiasRetencao(preset.dias)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-colors ${
                  diasRetencao === preset.dias
                    ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                    : 'bg-white text-[#141414]/60 border-[#141414]/10 hover:bg-[#F5F5F0]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 sm:ml-auto">
            <input
              type="number"
              min={30}
              value={diasRetencao}
              onChange={(e) => setDiasRetencao(Number(e.target.value))}
              className="w-24 px-3 py-1.5 bg-white border border-[#141414]/10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/30 text-sm"
            />
            <span className="text-xs text-[#141414]/50">dias</span>
            <button
              onClick={handleLimpar}
              disabled={limpando || diasRetencao < 30}
              title="Remove permanentemente registros mais antigos que o período informado"
              className="flex items-center gap-1.5 px-4 py-1.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50 text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Limpar
            </button>
          </div>
        </div>
        <p className="text-xs text-[#141414]/40">
          Remove definitivamente as entradas de auditoria mais antigas que o período escolhido. Retenção mínima: 30
          dias. Ação irreversível.
        </p>
        <ErrorMessage message={limpezaError} />
        {limpezaSucesso && <p className="text-sm text-emerald-700">{limpezaSucesso}</p>}
      </div>

      <ErrorMessage message={error ?? ''} />

      {loading ? (
        <div className="flex justify-center py-24">
          <Spinner size="lg" />
        </div>
      ) : logs.length === 0 ? (
        <EmptyState
          icon={<ScrollText className="w-8 h-8" />}
          title="Nenhum registro encontrado"
          description="Não há entradas de auditoria para os filtros selecionados."
        />
      ) : (
        <>
          <div className="bg-white rounded-3xl border border-[#141414]/5 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#141414]/10 text-left text-[#141414]/40 uppercase text-xs tracking-wider">
                  <th className="px-6 py-4 font-semibold">Quando</th>
                  <th className="px-6 py-4 font-semibold">Ator</th>
                  <th className="px-6 py-4 font-semibold">Ação</th>
                  <th className="px-6 py-4 font-semibold">Entidade</th>
                  <th className="px-6 py-4 font-semibold">Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-[#141414]/5 last:border-0 hover:bg-[#F5F5F0]/50">
                    <td className="px-6 py-4 text-[#141414]/60 whitespace-nowrap">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#141414]">{log.atorNome}</div>
                      <div className="text-xs text-[#141414]/40">{log.atorEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex text-xs font-bold uppercase tracking-wider bg-[#5A5A40]/10 text-[#5A5A40] rounded-full px-3 py-1">
                        {acaoLabel[log.acao]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#141414]/60">
                      {log.tipoEntidade}
                      {log.entidadeId != null ? ` #${log.entidadeId}` : ''}
                    </td>
                    <td className="px-6 py-4 text-[#141414]/60 max-w-md">{log.detalhes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 0}
                className="p-2 rounded-full bg-white border border-[#141414]/10 disabled:opacity-40 hover:bg-[#F5F5F0] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-[#141414]/60 font-medium">
                Página {page + 1} de {totalPages}
              </span>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page + 1 >= totalPages}
                className="p-2 rounded-full bg-white border border-[#141414]/10 disabled:opacity-40 hover:bg-[#F5F5F0] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

