import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Save, X } from 'lucide-react';
import type { Theme } from '../../types';

interface ThemeFormProps {
  visible: boolean;
  editing?: Theme | null;
  onSubmit: (text: string, imageUrl: string, soundUrl: string, videoUrl: string) => Promise<void>;
  onCancel: () => void;
}

export default function ThemeForm({ visible, editing, onSubmit, onCancel }: ThemeFormProps) {
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [soundUrl, setSoundUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editing) {
      setText(editing.text);
      setImageUrl(editing.imageUrl ?? '');
      setSoundUrl(editing.soundUrl ?? '');
      setVideoUrl(editing.videoUrl ?? '');
    } else {
      setText('');
      setImageUrl('');
      setSoundUrl('');
      setVideoUrl('');
    }
  }, [editing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      await onSubmit(text.trim(), imageUrl.trim(), soundUrl.trim(), videoUrl.trim());
      setText('');
      setImageUrl('');
      setSoundUrl('');
      setVideoUrl('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-[2rem] border border-[#5A5A40]/20 shadow-2xl space-y-6"
        >
          <h3 className="text-lg font-bold text-[#141414]">
            {editing ? 'Editar Tema' : 'Novo Tema'}
          </h3>

          {/* Texto do tema */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[#141414]/40 ml-1">
              Texto do Tema
            </label>
            <input
              autoFocus
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ex: Animais, Frutas, Cores..."
              className="w-full px-4 py-3 bg-[#F5F5F0] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#5A5A40]/30 transition-all focus:outline-none"
              required
            />
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#141414]/40 ml-1">
                URL da Imagem
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://exemplo.com/imagem.png"
                className="w-full px-4 py-3 bg-[#F5F5F0] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#5A5A40]/30 transition-all focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#141414]/40 ml-1">
                URL do Áudio
              </label>
              <input
                type="url"
                value={soundUrl}
                onChange={(e) => setSoundUrl(e.target.value)}
                placeholder="https://exemplo.com/audio.mp3"
                className="w-full px-4 py-3 bg-[#F5F5F0] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#5A5A40]/30 transition-all focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#141414]/40 ml-1">
                URL do Vídeo
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://exemplo.com/video.mp4"
                className="w-full px-4 py-3 bg-[#F5F5F0] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#5A5A40]/30 transition-all focus:outline-none"
              />
            </div>
          </div>

          {/* Preview da imagem */}
          {imageUrl && (
            <div className="bg-[#F5F5F0] p-4 rounded-2xl flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-lg overflow-hidden border border-[#141414]/10 flex-shrink-0">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) =>
                    (e.currentTarget.src = 'https://placehold.co/400x400?text=URL+inválida')
                  }
                />
              </div>
              <p className="text-sm font-medium text-[#141414]/60 italic">Pré-visualização da imagem.</p>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-[#141414]/60 font-semibold hover:text-[#141414] flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-[#5A5A40] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#5A5A40]/90 transition-all shadow-md active:scale-95 disabled:opacity-60"
            >
              <Save className="w-5 h-5" />
              {editing ? 'Salvar Alterações' : 'Criar Tema'}
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
