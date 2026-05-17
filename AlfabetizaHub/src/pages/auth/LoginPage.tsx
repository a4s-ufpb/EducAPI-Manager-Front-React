import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../hooks/useAuth';
import { useGoogleLogin } from '../../hooks/useGoogleLogin';
import { friendlyError } from '../../lib/utils';
import GoogleButton from '../../components/shared/GoogleButton';
import AuthDivider from '../../components/shared/AuthDivider';
import ErrorMessage from '../../components/ui/ErrorMessage';
import Spinner from '../../components/ui/Spinner';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { trigger: triggerGoogle } = useGoogleLogin({
    onSuccess: async (token) => {
      await loginWithGoogle(token);
      navigate('/');
    },
    onError: setError,
    onLoadingChange: setLoading,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center px-4 py-12">
      {/* Decoração */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#5A5A40]/5" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#5A5A40]/8" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#5A5A40] rounded-2xl mb-4 shadow-lg shadow-[#5A5A40]/25">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#141414]">AlfabetizaHub</h1>
          <p className="text-sm text-[#141414]/50 font-mono uppercase tracking-widest mt-1">
            Sistema de Gestão Educacional
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-[#141414]/8 border border-[#141414]/5 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-[#141414]/8">
            <div className="flex-1 py-4 text-sm font-bold uppercase tracking-widest text-center text-[#5A5A40] border-b-2 border-[#5A5A40] bg-[#5A5A40]/5">
              Entrar
            </div>
            <Link
              to="/auth/cadastro"
              className="flex-1 py-4 text-sm font-bold uppercase tracking-widest text-center text-[#141414]/40 hover:text-[#141414]/70 transition-colors"
            >
              Cadastrar
            </Link>
          </div>

          <div className="p-8 space-y-6">
            <GoogleButton onClick={triggerGoogle} disabled={loading} />
            <AuthDivider />

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#141414]/30" />
                <input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-[#F5F5F0] rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/30 focus:bg-white transition-all placeholder:text-[#141414]/30"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#141414]/30" />
                <input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-[#F5F5F0] rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/30 focus:bg-white transition-all placeholder:text-[#141414]/30"
                />
              </div>

              <ErrorMessage message={error} />

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#5A5A40] hover:bg-[#5A5A40]/90 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-60 shadow-lg shadow-[#5A5A40]/20"
              >
                {loading ? <Spinner size="sm" className="text-white" /> : (
                  <>Entrar <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-[#141414]/40">
              Ainda não tem conta?{' '}
              <Link to="/auth/cadastro" className="text-[#5A5A40] font-bold hover:underline">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs font-mono text-[#141414]/25 uppercase tracking-widest mt-6">
          AlfabetizaHub &copy; {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  );
}
