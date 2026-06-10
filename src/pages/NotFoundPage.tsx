import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col items-center justify-center text-center px-4">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-[#5A5A40]/10 rounded-2xl mb-6">
        <BookOpen className="w-8 h-8 text-[#5A5A40]" />
      </div>
      <h1 className="text-6xl font-bold text-[#141414] mb-4">404</h1>
      <p className="text-[#141414]/60 mb-8 text-lg">Página não encontrada.</p>
      <Link
        to="/"
        className="bg-[#5A5A40] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#5A5A40]/90 transition-all"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
