import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { KeyRound, Trash2, AlertTriangle, CheckCircle2, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { friendlyError } from '../../lib/utils';
import ErrorMessage from '../../components/ui/ErrorMessage';
import Spinner from '../../components/ui/Spinner';

export default function ProfilePage() {
  const { user, changePassword, deleteAccount } = useAuth();
  const navigate = useNavigate();

  // ---- Troca de senha ----
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  // ---- Exclusão de conta ----
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  if (!user) return null;

  const isGoogleAccount = !!user.googleAccount;

  const validatePasswordForm = (): string => {
    if (newPassword.length < 8 || newPassword.length > 12) {
      return 'A nova senha deve ter entre 8 e 12 caracteres.';
    }
    if (newPassword !== confirmPassword) {
      return 'A confirmação não coincide com a nova senha.';
    }
    if (newPassword === currentPassword) {
      return 'A nova senha deve ser diferente da senha atual.';
    }
    return '';
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess(false);

    const validationError = validatePasswordForm();
    if (validationError) {
      setPwError(validationError);
      return;
    }

    setPwLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPwSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      // context: 'password' → 401 = "senha atual incorreta", 403 = "conta Google"
      setPwError(friendlyError(err, 'password'));
    } finally {
      setPwLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Tem certeza que deseja excluir sua conta?\n\n' +
        'Essa ação é permanente e também vai apagar todos os temas e desafios criados por você.'
    );
    if (!confirmed) return;

    setDeleteError('');
    setDeleteLoading(true);
    try {
      await deleteAccount();
      navigate('/auth', { replace: true });
    } catch (err) {
      setDeleteError(friendlyError(err));
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#141414]">Minha conta</h1>
        <p className="text-sm text-[#141414]/50 mt-1">Gerencie suas informações e preferências de segurança.</p>
      </div>

      {/* Dados da conta */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-[1.5rem] shadow-xl shadow-[#141414]/5 border border-[#141414]/5 p-6 sm:p-8 space-y-4"
      >
        <div className="flex items-center gap-4">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full object-cover" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#5A5A40]/10 flex items-center justify-center text-[#5A5A40] font-bold text-xl">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-bold text-[#141414]">{user.name}</p>
            <p className="text-sm text-[#141414]/50">{user.email}</p>
          </div>
        </div>

        {isGoogleAccount ? (
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5A5A40] bg-[#5A5A40]/10 border border-[#5A5A40]/20 rounded-full px-3 py-1.5 w-fit">
            <GoogleIcon className="w-3.5 h-3.5" />
            Conta conectada via Google
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#141414]/50 bg-[#141414]/5 border border-[#141414]/10 rounded-full px-3 py-1.5 w-fit">
            <Lock className="w-3.5 h-3.5" />
            Login local (e-mail e senha)
          </div>
        )}

        {user.role !== 'CLIENTE' && (
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5A5A40] bg-[#5A5A40]/10 border border-[#5A5A40]/20 rounded-full px-3 py-1.5 w-fit">
            <ShieldCheck className="w-3.5 h-3.5" />
            Papel: {user.role}
          </div>
        )}
      </motion.div>

      {/* Troca de senha */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="bg-white rounded-[1.5rem] shadow-xl shadow-[#141414]/5 border border-[#141414]/5 p-6 sm:p-8"
      >
        <div className="flex items-center gap-2 mb-1">
          <KeyRound className="w-5 h-5 text-[#5A5A40]" />
          <h2 className="font-bold text-[#141414]">Alterar senha</h2>
        </div>

        {isGoogleAccount ? (
          <div className="mt-4 flex items-start gap-3 bg-[#F5F5F0] border border-[#141414]/10 rounded-xl px-4 py-3.5">
            <GoogleIcon className="w-5 h-5 mt-0.5 shrink-0" />
            <p className="text-sm text-[#141414]/60">
              Sua conta usa o login do Google, então não existe uma senha local para alterar. Para trocar a senha de
              acesso, gerencie-a diretamente na sua Conta Google.
            </p>
          </div>
        ) : (
          <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#141414]/50 uppercase tracking-wide">
                Senha atual
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="mt-1.5 w-full px-4 py-3 bg-[#F5F5F0] rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/30 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#141414]/50 uppercase tracking-wide">
                Nova senha
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                maxLength={12}
                className="mt-1.5 w-full px-4 py-3 bg-[#F5F5F0] rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/30 focus:bg-white transition-all"
              />
              <p className="text-xs text-[#141414]/35 mt-1">Entre 8 e 12 caracteres.</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#141414]/50 uppercase tracking-wide">
                Confirmar nova senha
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1.5 w-full px-4 py-3 bg-[#F5F5F0] rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/30 focus:bg-white transition-all"
              />
            </div>

            <ErrorMessage message={pwError} />

            <AnimatePresence>
              {pwSuccess && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  Senha alterada com sucesso.
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={pwLoading}
              className="flex items-center justify-center gap-2 bg-[#5A5A40] hover:bg-[#5A5A40]/90 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {pwLoading ? <Spinner size="sm" className="text-white" /> : <>Salvar nova senha</>}
            </button>
          </form>
        )}
      </motion.div>

      {/* Zona de perigo */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-[1.5rem] shadow-xl shadow-red-900/5 border border-red-200 p-6 sm:p-8"
      >
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h2 className="font-bold text-[#141414]">Excluir conta</h2>
        </div>
        <p className="text-sm text-[#141414]/50 mt-2">
          Essa ação apaga permanentemente sua conta, seus temas e desafios cadastrados. Não é possível desfazer.
        </p>

        <ErrorMessage message={deleteError} />

        <button
          type="button"
          onClick={handleDeleteAccount}
          disabled={deleteLoading}
          className="mt-4 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-[0.98] disabled:opacity-60"
        >
          {deleteLoading ? <Spinner size="sm" className="text-white" /> : (
            <>
              <Trash2 className="w-4 h-4" />
              Excluir minha conta
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}

function GoogleIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
