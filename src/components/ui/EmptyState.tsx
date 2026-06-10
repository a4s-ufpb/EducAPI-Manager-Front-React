import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-24 bg-white/50 rounded-3xl border-2 border-dashed border-[#141414]/10">
      <div className="bg-[#F5F5F0] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-[#141414]/20">
        {icon}
      </div>
      <h3 className="text-[#141414] font-bold text-xl mb-2">{title}</h3>
      <p className="text-[#141414]/40 max-w-xs mx-auto text-sm leading-relaxed mb-8">{description}</p>
      {action}
    </div>
  );
}
