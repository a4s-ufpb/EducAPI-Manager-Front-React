import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Save, Link as LinkIcon, Upload } from 'lucide-react';
import type { Challenge } from '../../types';

interface ChallengeFormProps {
  visible: boolean;
  editing?: Challenge | null;
  onSubmit: (text: string, imageUrl: string, file?: File | null) => Promise<void>;
  onCancel: () => void;
}

export default function ChallengeForm({ visible, editing, onSubmit, onCancel }: ChallengeFormProps) {
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');

  // Preenche os campos ao editar
  useEffect(() => {
    if (editing) {
      setText(editing.text);
      setImageUrl(editing.imageUrl);
    } else {
      setText('');
      setImageUrl('');
    }
    setImageMode('url');
    setImageFile(null);
    setFilePreview('');
  }, [editing]);

  // Gera/limpa o preview do arquivo selecionado
  useEffect(() => {
    if (!imageFile) {
      setFilePreview('');
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setFilePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (imageMode === 'url' && !imageUrl.trim()) return;
    if (imageMode === 'upload' && !imageFile && !editing) return;
    setLoading(true);
    try {
      await onSubmit(
        text.trim(),
        imageMode === 'url' ? imageUrl.trim() : '',
        imageMode === 'upload' ? imageFile : null
      );
      setText('');
      setImageUrl('');
      setImageFile(null);
      setImageMode('url');
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
            {editing ? 'Editar Desafio' : 'Novo Desafio'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#141414]/40 ml-1">
                Palavra do Desafio
              </label>
              <input
                autoFocus
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ex: Gato"
                className="w-full px-4 py-3 bg-[#F5F5F0] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#5A5A40]/30 transition-all focus:outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#141414]/40 ml-1">
                Imagem
              </label>

              {/* Tabs */}
              <div className="flex gap-2 mb-1">
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    imageMode === 'url'
                      ? 'bg-[#5A5A40] text-white'
                      : 'bg-[#F5F5F0] text-[#141414]/50 hover:text-[#141414]'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  URL
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('upload')}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    imageMode === 'upload'
                      ? 'bg-[#5A5A40] text-white'
                      : 'bg-[#F5F5F0] text-[#141414]/50 hover:text-[#141414]'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload
                </button>
              </div>

              {imageMode === 'url' ? (
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://exemplo.com/imagem.png"
                  className="w-full px-4 py-3 bg-[#F5F5F0] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#5A5A40]/30 transition-all focus:outline-none"
                  required={imageMode === 'url'}
                />
              ) : (
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2.5 bg-[#F5F5F0] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#5A5A40]/30 transition-all focus:outline-none text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#5A5A40] file:text-white"
                />
              )}
            </div>
          </div>

          {/* Preview */}
          {((imageMode === 'url' && imageUrl) || (imageMode === 'upload' && filePreview)) && (
            <div className="bg-[#F5F5F0] p-4 rounded-2xl flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-lg overflow-hidden border border-[#141414]/10">
                <img
                  src={imageMode === 'url' ? imageUrl : filePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) =>
                    (e.currentTarget.src = 'https://placehold.co/400x400?text=URL+inválida')
                  }
                />
              </div>
              <p className="text-sm font-medium text-[#141414]/60 italic">
                {imageMode === 'url' ? 'Pré-visualização.' : `Arquivo selecionado: ${imageFile?.name}`}
              </p>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-[#141414]/60 font-semibold hover:text-[#141414]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-[#5A5A40] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#5A5A40]/90 transition-all shadow-md active:scale-95 disabled:opacity-60"
            >
              <Save className="w-5 h-5" />
              {editing ? 'Salvar Alterações' : 'Criar Desafio'}
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
