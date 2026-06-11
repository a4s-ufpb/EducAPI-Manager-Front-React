import { useState } from 'react';
import { Plus, Search, BookOpen } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useThemes } from '../../hooks/useThemes';
import ThemeCard from '../../components/shared/ThemeCard';
import ThemeForm from '../../components/shared/ThemeForm';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';
import type { Theme } from '../../types';

export default function ThemesPage() {
  const { user } = useAuth();
  const { themes, loading, addTheme, updateTheme, removeTheme } = useThemes();

  const [isAdding, setIsAdding] = useState(false);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [ownerFilter, setOwnerFilter] = useState<'all' | 'mine'>('all');

  const filtered = themes
    .filter((t) => t.text.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((t) => (ownerFilter === 'mine' ? t.authorId === user?.id : true));

  const handleAdd = async (text: string, imageUrl: string, soundUrl: string, videoUrl: string, file?: File | null) => {
    await addTheme(text, imageUrl, soundUrl, videoUrl, file);
    setIsAdding(false);
  };

  const handleEdit = (theme: Theme) => {
    setEditingTheme(theme);
    setIsAdding(true);
  };

  const handleSaveEdit = async (text: string, imageUrl: string, soundUrl: string, videoUrl: string, file?: File | null) => {
    if (!editingTheme) return;
    await updateTheme(editingTheme.id, text, imageUrl, soundUrl, videoUrl, file);
    setEditingTheme(null);
    setIsAdding(false);
  };

  const handleSubmit = async (text: string, imageUrl: string, soundUrl: string, videoUrl: string, file?: File | null) => {
    if (editingTheme) {
      await handleSaveEdit(text, imageUrl, soundUrl, videoUrl, file);
    } else {
      await handleAdd(text, imageUrl, soundUrl, videoUrl, file);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Excluir este tema e todos os seus desafios?')) return;
    await removeTheme(id);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingTheme(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#141414]">Temas</h1>
          <p className="text-[#141414]/60 text-sm mt-1">
            Gerencie os temas e palavras-chave para os desafios de alfabetização.
          </p>
        </div>
        {user && (
          <button
            onClick={() => { setEditingTheme(null); setIsAdding(true); }}
            className="flex items-center justify-center gap-2 bg-[#5A5A40] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#5A5A40]/90 transition-all shadow-lg shadow-[#5A5A40]/20 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Novo Tema
          </button>
        )}
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#141414]/30" />
        <input
          type="text"
          placeholder="Pesquisar temas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-[#141414]/10 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/30 transition-all"
        />
      </div>

      {/* Filtro de propriedade */}
      {user && (
        <div className="flex gap-2">
          <button
            onClick={() => setOwnerFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              ownerFilter === 'all'
                ? 'bg-[#5A5A40] text-white shadow-md'
                : 'bg-white text-[#141414]/60 border border-[#141414]/10 hover:text-[#141414]'
            }`}
          >
            Todos os temas
          </button>
          <button
            onClick={() => setOwnerFilter('mine')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              ownerFilter === 'mine'
                ? 'bg-[#5A5A40] text-white shadow-md'
                : 'bg-white text-[#141414]/60 border border-[#141414]/10 hover:text-[#141414]'
            }`}
          >
            Meus temas
          </button>
        </div>
      )}

      {/* Form de adição/edição */}
      <ThemeForm
        visible={isAdding}
        editing={editingTheme}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              user={user}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<BookOpen className="w-8 h-8" />}
          title="Nenhum tema encontrado"
          description="Crie seu primeiro tema pedagógico para começar."
          action={
            user ? (
              <button
                onClick={() => setIsAdding(true)}
                className="justify-center gap-2 bg-[#5A5A40] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#5A5A40]/90 transition-all shadow-lg shadow-[#5A5A40]/20 active:scale-95"
              >
                Criar o primeiro tema
              </button>
            ) : undefined
          }
        />
      )}
    </div>
  );
}
