import { useState } from 'react';
import { ShieldPlus, ShieldMinus, Trash2, ShieldCheck, ShieldAlert, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAdminUsers } from '../../hooks/useAdminUsers';
import { friendlyError } from '../../lib/utils';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import type { AdminUser } from '../../types';

const roleBadgeStyle: Record<AdminUser['role'], string> = {
  CLIENTE: 'bg-[#141414]/5 text-[#141414]/60 border-[#141414]/10',
  ADMIN: 'bg-blue-50 text-blue-700 border-blue-200',
  SYSADMIN: 'bg-[#5A5A40]/10 text-[#5A5A40] border-[#5A5A40]/30',
};

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const { users, loading, error, promote, demote, removeUser } = useAdminUsers();

  const [actionError, setActionError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  // Esta página só é alcançável por SYSADMIN (ver SysAdminRoute em router/index.tsx).
  // Regra do backend (UserService.deleteByAdmin/promote/demote): SYSADMIN pode
  // excluir qualquer usuário (exceto a própria conta), promover qualquer CLIENTE
  // a ADMIN e rebaixar qualquer ADMIN de volta para CLIENTE (também exceto a si mesmo).
  const canDelete = (target: AdminUser) => target.id !== currentUser?.id;
  const canPromote = (target: AdminUser) => target.role === 'CLIENTE';
  const canDemote = (target: AdminUser) => target.role === 'ADMIN' && target.id !== currentUser?.id;

  const handlePromote = async (target: AdminUser) => {
    if (!window.confirm(`Promover ${target.name} (${target.email}) para ADMIN?`)) return;
    setActionError('');
    setBusyId(target.id);
    try {
      await promote(target.id);
    } catch (err) {
      setActionError(friendlyError(err, 'admin'));
    } finally {
      setBusyId(null);
    }
  };

  const handleDemote = async (target: AdminUser) => {
    if (!window.confirm(`Rebaixar ${target.name} (${target.email}) de ADMIN para CLIENTE?`)) return;
    setActionError('');
    setBusyId(target.id);
    try {
      await demote(target.id);
    } catch (err) {
      setActionError(friendlyError(err, 'admin'));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (target: AdminUser) => {
    if (
      !window.confirm(
        `Excluir a conta de ${target.name} (${target.email})?\n\n` +
          'Temas e desafios criados por esse usuário não serão apagados: ficarão sem autor (órfãos).'
      )
    )
      return;
    setActionError('');
    setBusyId(target.id);
    try {
      await removeUser(target.id);
    } catch (err) {
      setActionError(friendlyError(err, 'admin'));
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (users.length === 0) {
    return (
      <EmptyState
        icon={<UserIcon className="w-8 h-8" />}
        title="Nenhum usuário encontrado"
        description="Ainda não há usuários cadastrados no sistema."
      />
    );
  }

  return (
    <div className="space-y-4">
      <ErrorMessage message={actionError} />

      <div className="bg-white rounded-3xl border border-[#141414]/5 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#141414]/10 text-left text-[#141414]/40 uppercase text-xs tracking-wider">
              <th className="px-6 py-4 font-semibold">Usuário</th>
              <th className="px-6 py-4 font-semibold">E-mail</th>
              <th className="px-6 py-4 font-semibold">Papel</th>
              <th className="px-6 py-4 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-[#141414]/5 last:border-0 hover:bg-[#F5F5F0]/50">
                <td className="px-6 py-4 font-medium text-[#141414]">
                  {u.name}
                  {u.id === currentUser?.id && (
                    <span className="ml-2 text-xs text-[#141414]/40 font-normal">(você)</span>
                  )}
                </td>
                <td className="px-6 py-4 text-[#141414]/60">{u.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider border rounded-full px-3 py-1 ${roleBadgeStyle[u.role]}`}
                  >
                    {u.role === 'SYSADMIN' && <ShieldAlert className="w-3 h-3" />}
                    {u.role === 'ADMIN' && <ShieldCheck className="w-3 h-3" />}
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {canPromote(u) && (
                      <button
                        onClick={() => handlePromote(u)}
                        disabled={busyId === u.id}
                        title="Promover a ADMIN"
                        className="p-2 bg-[#5A5A40]/10 text-[#5A5A40] rounded-xl hover:bg-[#5A5A40]/20 transition-colors disabled:opacity-50"
                      >
                        <ShieldPlus className="w-4 h-4" />
                      </button>
                    )}
                    {canDemote(u) && (
                      <button
                        onClick={() => handleDemote(u)}
                        disabled={busyId === u.id}
                        title="Rebaixar para CLIENTE"
                        className="p-2 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-colors disabled:opacity-50"
                      >
                        <ShieldMinus className="w-4 h-4" />
                      </button>
                    )}
                    {canDelete(u) && (
                      <button
                        onClick={() => handleDelete(u)}
                        disabled={busyId === u.id}
                        title="Excluir usuário"
                        className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
