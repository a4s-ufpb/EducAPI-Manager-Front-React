import { Link } from 'react-router-dom';
import { Edit2, Trash2, ExternalLink, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import type { Theme, User } from '../../types';

interface ThemeCardProps {
  theme: Theme;
  user: User | null;
  onEdit: (theme: Theme) => void;
  onDelete: (id: string) => void;
}

export default function ThemeCard({ theme, user, onEdit, onDelete }: ThemeCardProps) {
  const isOwner = !!user && user.id === theme.authorId;

  return (
    <motion.div
      layout
      key={theme.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group bg-white rounded-3xl border border-[#141414]/5 overflow-hidden shadow-sm hover:shadow-xl transition-all"
    >
      {/* Imagem — igual ao ChallengeCard */}
      <div className="aspect-square relative flex items-center justify-center bg-[#F5F5F0]">
        {theme.imageUrl ? (
          <img
            src={theme.imageUrl}
            alt={theme.text}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}

        {/* Fallback: ícone centralizado */}
        <div className={`flex flex-col items-center gap-2 text-[#5A5A40]/40 ${theme.imageUrl ? 'hidden' : ''}`}>
          <BookOpen className="w-12 h-12" />
        </div>

        {/* Botões editar/excluir */}
        {isOwner && (
          <div className="absolute top-3 right-3 flex gap-2 z-10">
            <button
              onClick={() => onEdit(theme)}
              className="p-2 bg-white/90 backdrop-blur-sm text-[#141414] rounded-xl hover:bg-white shadow-lg"
              title="Editar"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(theme.id)}
              className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-lg"
              title="Excluir"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Info + botão */}
      <div className="p-5 space-y-3">
        <div className="text-center">
          <h3 className="text-lg font-bold text-[#141414] tracking-tight">{theme.text}</h3>
          <p className="text-[10px] font-mono text-[#141414]/20 uppercase tracking-[0.2em] mt-1">
            ID: {theme.id.slice(0, 6)}
          </p>
        </div>

        <Link
          to={`/themes/${theme.id}/challenges`}
          className="flex items-center justify-between w-full bg-[#141414] text-white px-5 py-3 rounded-2xl text-sm font-semibold hover:bg-[#141414]/90 transition-all group/btn active:scale-95"
        >
          Ver Desafios
          <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
