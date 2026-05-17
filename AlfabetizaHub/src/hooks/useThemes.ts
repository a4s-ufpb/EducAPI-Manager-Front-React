import { useState, useEffect } from 'react';
import { themesApi } from '../lib/api';
import type { Theme } from '../types';

export function useThemes() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    themesApi
      .list()
      .then(setThemes)
      .catch(() => setError('Erro ao carregar temas.'))
      .finally(() => setLoading(false));
  }, []);

  const addTheme = async (
    text: string,
    imageUrl = '',
    soundUrl = '',
    videoUrl = ''
  ): Promise<Theme> => {
    const created = await themesApi.create(text, imageUrl, soundUrl, videoUrl);
    setThemes((prev) => [created, ...prev]);
    return created;
  };

  const updateTheme = async (
    id: string,
    text: string,
    imageUrl = '',
    soundUrl = '',
    videoUrl = ''
  ): Promise<void> => {
    const updated = await themesApi.update(id, text, imageUrl, soundUrl, videoUrl);
    setThemes((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const removeTheme = async (id: string): Promise<void> => {
    await themesApi.remove(id);
    setThemes((prev) => prev.filter((t) => t.id !== id));
  };

  return { themes, loading, error, addTheme, updateTheme, removeTheme };
}
