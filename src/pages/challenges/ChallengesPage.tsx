import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, ImageIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useChallenges } from '../../hooks/useChallenges';
import ChallengeCard from '../../components/shared/ChallengeCard';
import ChallengeForm from '../../components/shared/ChallengeForm';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';
import type { Challenge } from '../../types';

export default function ChallengesPage() {
  const { themeId } = useParams<{ themeId: string }>();
  const { user } = useAuth();
  const { challenges, theme, loading, addChallenge, updateChallenge, removeChallenge } =
    useChallenges(themeId);

  const [isAdding, setIsAdding] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);

  const handleAdd = async (text: string, imageUrl: string, file?: File | null) => {
    await addChallenge(text, imageUrl, file);
    setIsAdding(false);
  };

  const handleEdit = (challenge: Challenge) => {
    setEditingChallenge(challenge);
    setIsAdding(true);
  };

  const handleSave = async (text: string, imageUrl: string, file?: File | null) => {
    if (editingChallenge) {
      await updateChallenge(editingChallenge.id, text, imageUrl, file);
      setEditingChallenge(null);
    } else {
      await handleAdd(text, imageUrl, file);
    }
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Excluir este desafio?')) return;
    await removeChallenge(id);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingChallenge(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="p-2.5 bg-white border border-[#141414]/10 rounded-2xl hover:bg-[#141414]/5 transition-all text-[#141414]/60"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <nav className="flex items-center gap-2 text-xs font-mono text-[#141414]/40 uppercase tracking-widest mb-1">
            <Link to="/" className="hover:text-[#5A5A40]">
              Temas
            </Link>
            <span>/</span>
            <span className="text-[#141414]/60">{theme?.text || '...'}</span>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-[#141414]">Desafios</h1>
        </div>

        {user && (
          <button
            onClick={() => { setEditingChallenge(null); setIsAdding(true); }}
            className="ml-auto flex items-center justify-center gap-2 bg-[#5A5A40] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#5A5A40]/90 transition-all shadow-lg active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Novo Desafio
          </button>
        )}
      </div>

      {/* Form adicionar/editar */}
      <ChallengeForm
        visible={isAdding}
        editing={editingChallenge}
        onSubmit={handleSave}
        onCancel={handleCancel}
      />

      {/* Grid */}
      {challenges.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              user={user}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<ImageIcon className="w-8 h-8" />}
          title="Sem desafios ainda"
          description="Adicione imagens e palavras associadas a este tema."
          action={
            user ? (
              <button
                onClick={() => setIsAdding(true)}
                className="bg-[#141414] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#141414]/90 transition-all active:scale-95"
              >
                Criar o Primeiro Desafio
              </button>
            ) : undefined
          }
        />
      )}
    </div>
  );
}
