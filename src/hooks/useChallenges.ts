import { useState, useEffect } from 'react';
import { challengesApi, themesApi } from '../lib/api';
import type { Challenge, Theme } from '../types';

export function useChallenges(themeId: string | undefined) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!themeId) return;
    Promise.all([
      themesApi.list().then((list) => list.find((t) => t.id === themeId) ?? null),
      challengesApi.list(themeId),
    ])
      .then(([t, c]) => {
        setTheme(t ?? null);
        setChallenges(c);
      })
      .catch(() => setError('Erro ao carregar desafios.'))
      .finally(() => setLoading(false));
  }, [themeId]);

  const addChallenge = async (text: string, imageUrl: string, file?: File | null): Promise<Challenge> => {
    if (!themeId) throw new Error('themeId é obrigatório');
    const created = await challengesApi.create(themeId, text, imageUrl, '', '', file);
    setChallenges((prev) => [created, ...prev]);
    return created;
  };

  // Preserva soundUrl/videoUrl existentes ao editar só word e imageUrl
  const updateChallenge = async (id: string, text: string, imageUrl: string, file?: File | null): Promise<void> => {
    if (!themeId) throw new Error('themeId é obrigatório');
    const current = challenges.find((c) => c.id === id);
    const updated = await challengesApi.update(
      themeId,
      id,
      text,
      imageUrl,
      current?.soundUrl ?? '',
      current?.videoUrl ?? '',
      file
    );
    setChallenges((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  const removeChallenge = async (id: string): Promise<void> => {
    if (!themeId) throw new Error('themeId é obrigatório');
    await challengesApi.remove(themeId, id);
    setChallenges((prev) => prev.filter((c) => c.id !== id));
  };

  return { challenges, theme, loading, error, addChallenge, updateChallenge, removeChallenge };
}
