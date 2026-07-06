import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '../lib/api';
import type { AdminUser } from '../types';

/**
 * Carrega a listagem administrativa de usuários (GET /admin/users) e expõe
 * as ações de promover, rebaixar (ambas SYSADMIN only) e excluir
 * (ADMIN/SYSADMIN, com as regras de role aplicadas no backend).
 */
export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    return adminApi
      .listUsers(0, 100)
      .then((page) => setUsers(page.content))
      .catch(() => setError('Erro ao carregar usuários.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const promote = async (id: string): Promise<void> => {
    const updated = await adminApi.promote(id);
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
  };

  const demote = async (id: string): Promise<void> => {
    const updated = await adminApi.demote(id);
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
  };

  const removeUser = async (id: string): Promise<void> => {
    await adminApi.deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return { users, loading, error, reload, promote, demote, removeUser };
}
