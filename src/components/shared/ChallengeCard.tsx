import { motion } from 'motion/react';
import { Edit2, Trash2 } from 'lucide-react';
import type { Challenge, User } from '../../types';

interface ChallengeCardProps {
  challenge: Challenge;
  user: User | null;
  onEdit: (challenge: Challenge) => void;
  onDelete: (id: string) => void;
}

export default function ChallengeCard({ challenge, user, onEdit, onDelete }: ChallengeCardProps) {
  const isOwner = !!user && user.id === challenge.authorId;
  // Mesma regra do ChallengeService.delete/update: dono ou ADMIN/SYSADMIN podem
  // editar/excluir.
  const isAdminAcc = !!user && (user.role === 'ADMIN' || user.role === 'SYSADMIN');
  const canDelete = isOwner || isAdminAcc;

  return (
    <motion.div
      layout
      key={challenge.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group bg-white rounded-3xl border border-[#141414]/5 overflow-hidden shadow-sm hover:shadow-xl transition-all"
    >
      {/* Image */}
      <div className="aspect-square relative flex items-center justify-center bg-[#F5F5F0]">
        <img
          src={challenge.imageUrl}
          alt={challenge.text}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/400x400?text=Imagem+Indisponível';
          }}
        />
        {(isOwner || canDelete) && (
          <div className="absolute top-3 right-3 flex gap-2">
            {(isOwner || isAdminAcc) && (
              <button
                onClick={() => onEdit(challenge)}
                className="p-2 bg-white/90 backdrop-blur-sm text-[#141414] rounded-xl hover:bg-white shadow-lg"
                title={isOwner ? 'Editar' : 'Editar (moderação administrativa)'}
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDelete(challenge.id)}
                className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-lg"
                title={isOwner ? 'Excluir' : 'Excluir (moderação administrativa)'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 text-center">
        <h4 className="text-lg font-bold text-[#141414] tracking-tight">{challenge.text}</h4>
        <p className="text-[10px] font-mono text-[#141414]/20 uppercase tracking-[0.2em] mt-1">
          ID: {challenge.id.slice(0, 6)}
        </p>
      </div>
    </motion.div>
  );
}
